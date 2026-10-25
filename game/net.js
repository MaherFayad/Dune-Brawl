// Dune Brawl rollback netcode for two to four players. Transport-agnostic: the session only needs a
// send(msg) function and receive(msg) calls, so it runs the same in the browser (over a WebRTC
// data channel) and in Node tests (over a simulated laggy, lossy channel).
//
// Every frame each side simulates with its own input (played DELAY frames late, which hides most
// latency) and a prediction of the other's input (their last confirmed one). When the real input
// arrives and differs, the session restores the snapshot from that frame and re-simulates up to
// now. Inputs are sent redundantly (the last few frames in every packet), so a lost packet costs
// nothing; a periodic state hash catches desyncs.
(function (root) {
  "use strict";

  const DELAY = 2;          // frames of input delay
  const MAX_ROLLBACK = 8;   // stall instead of predicting further ahead than this
  const REDUNDANCY = 8;     // past inputs repeated in every packet
  const HASH_EVERY = 60;    // compare state hashes once per second
  const KEEP = 180;         // frames of history kept for rollback and hashing

  // M: a Sim.match(), me: this player's slot (0 is the host), n: players (2 to 4),
  // send(msg): deliver a message to every other player (with 3 or 4, the host relays guests'
  // messages to each other), step(state, inputs): returns the next state.
  function Session(M, me, send, step, n = 2) {
    this.M = M; this.me = me; this.n = n; this.send = send; this.stepFn = step;
    this.peers = []; for (let j = 0; j < n; j++) if (j !== me) this.peers.push(j);
    this.state = M.create();
    this.frame = 0;            // next frame to simulate
    this.localTop = DELAY - 1; // last frame with a local input (the first DELAY frames are empty)
    this.local = [];           // my input per frame
    this.remote = [];          // per player: their confirmed input per frame
    this.conf = [];            // per player: last frame up to which their input is known
    this.peerFrame = []; this.peerAdv = []; this.peerHash = [];
    for (let j = 0; j < n; j++) { this.remote[j] = []; this.conf[j] = -1; this.peerFrame[j] = 0; this.peerAdv[j] = 0; this.peerHash[j] = {}; }
    this.used = [];            // the inputs each frame was simulated with
    this.snaps = [];           // state before each frame
    this.confirmed = -1;       // last frame up to which every peer input is known
    this.rollbackTo = -1;      // earliest frame that was mispredicted
    this.myHash = {};
    this.desync = -1;          // first frame whose hashes disagreed
    this.rollbacks = 0; this.stalls = 0; this.ticks = 0;
  }

  // a peer's input for frame f: the real one if it arrived, else their last confirmed one
  Session.prototype.predict = function (j, f) {
    const r = this.remote[j];
    if (r[f] !== undefined) return r[f];
    const last = Math.min(this.conf[j], f - 1);
    return last >= 0 && r[last] !== undefined ? r[last] : 0;
  };

  Session.prototype.simulate = function (f) {
    this.snaps[f] = this.M.clone(this.state);
    const ins = [];
    for (let j = 0; j < this.n; j++) ins[j] = j === this.me ? this.local[f] || 0 : this.predict(j, f);
    this.used[f] = ins;
    this.state = this.stepFn(this.state, ins);
  };

  Session.prototype.minPeerFrame = function () { let m = Infinity; for (const j of this.peers) m = Math.min(m, this.peerFrame[j]); return m; };

  Session.prototype.packet = function () {
    const f = this.localTop, n = [];
    for (let k = Math.max(0, f - REDUNDANCY + 1); k <= f; k++) n.push(this.local[k] || 0);
    return { t: "i", p: this.me, f, n, at: this.frame, adv: this.frame - this.minPeerFrame() };
  };

  // Called once per 60 Hz tick with the local input. Returns true if a frame was simulated.
  Session.prototype.tick = function (input) {
    this.ticks++;
    if (this.rollbackTo >= 0) this.rollback();
    // stay in step: never run more than MAX_ROLLBACK frames past the last confirmed input, and
    // let the slowest peer catch up when we are clearly ahead of it
    const ahead = this.frame - this.confirmed - 1 >= MAX_ROLLBACK;
    let adv = -Infinity;
    for (const j of this.peers) adv = Math.max(adv, (this.frame - this.peerFrame[j]) - this.peerAdv[j]);
    if (ahead || (adv > 2 && this.ticks % 4 === 0)) {
      this.stalls++;
      this.send(this.packet());
      return false;
    }
    this.local[this.frame + DELAY] = input; this.localTop = this.frame + DELAY;
    this.send(this.packet());
    this.simulate(this.frame);
    this.frame++;
    this.checkHash();
    this.prune();
    return true;
  };

  Session.prototype.rollback = function () {
    const r = this.rollbackTo;
    this.rollbackTo = -1;
    if (r >= this.frame || !this.snaps[r]) return;
    this.rollbacks++;
    this.state = this.M.clone(this.snaps[r]);
    for (let f = r; f < this.frame; f++) this.simulate(f);
  };

  Session.prototype.receive = function (msg) {
    const j = msg.p === undefined ? 1 - this.me : msg.p; // two-player packets may leave out the sender
    if (j === this.me || j < 0 || j >= this.n) return;
    if (msg.t === "i") {
      const first = msg.f - msg.n.length + 1, r = this.remote[j], from = Math.max(0, Math.min(first, this.conf[j] + 1));
      for (let k = 0; k < msg.n.length; k++) {
        const f = first + k;
        if (f >= 0 && r[f] === undefined) r[f] = msg.n[k];
      }
      while (r[this.conf[j] + 1] !== undefined) this.conf[j]++;
      let c = Infinity; for (const q of this.peers) c = Math.min(c, this.conf[q]);
      this.confirmed = c;
      // the first frame simulated with a guess for this player that no longer holds (a wrong guess,
      // or a later prediction that changed with the confirmed input) must be redone; keep the
      // earliest, since another player's packet may already have asked for an earlier one
      for (let f = from; f < this.frame; f++) {
        if (this.used[f] && this.used[f][j] !== this.predict(j, f)) { if (this.rollbackTo < 0 || f < this.rollbackTo) this.rollbackTo = f; break; }
      }
      if (msg.at > this.peerFrame[j]) { this.peerFrame[j] = msg.at; this.peerAdv[j] = msg.adv; }
    } else if (msg.t === "h") {
      this.peerHash[j][msg.f] = msg.h;
      this.compare(msg.f);
    }
  };

  // hash the state at confirmed frames: every player must agree exactly
  Session.prototype.checkHash = function () {
    const f = Math.floor(Math.min(this.confirmed, this.frame - 1) / HASH_EVERY) * HASH_EVERY;
    if (f <= 0 || this.myHash[f] !== undefined || !this.snaps[f]) return;
    if (this.rollbackTo >= 0 && this.rollbackTo <= f) return;
    this.myHash[f] = this.M.hash(this.snaps[f]);
    this.send({ t: "h", p: this.me, f, h: this.myHash[f] });
    this.compare(f);
  };

  Session.prototype.compare = function (f) {
    if (this.myHash[f] === undefined) return;
    for (const j of this.peers) {
      const h = this.peerHash[j][f];
      if (h !== undefined && h !== this.myHash[f] && (this.desync < 0 || f < this.desync)) this.desync = f;
    }
  };

  Session.prototype.prune = function () {
    const old = this.frame - KEEP;
    if (old < 0) return;
    delete this.snaps[old]; delete this.used[old];
    if (old < this.confirmed) { for (const j of this.peers) delete this.remote[j][old - 1]; delete this.local[old]; }
    delete this.myHash[old - HASH_EVERY];
    for (const j of this.peers) delete this.peerHash[j][old - HASH_EVERY];
  };

  // The sim step used online: like the offline loop, a finished match restarts when either player
  // presses jump or light, but here it happens inside the input stream so both sides agree.
  function makeStep(Sim, M) {
    const go = Sim.IN.J | Sim.IN.A;
    return (s, inputs) => {
      if (s.over && s.overT > 60 && inputs.reduce((x, y) => x | y, 0) & go) return M.create();
      M.step(s, inputs);
      return s;
    };
  }

  const api = { Session, makeStep, DELAY, MAX_ROLLBACK };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Net = api;
})(this);
