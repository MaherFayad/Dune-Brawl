// Dune Brawl rollback netcode for two players. Transport-agnostic: the session only needs a
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

  // M: a Sim.match(), me: 0 (host, left) or 1 (guest, right),
  // send(msg): deliver a message to the peer, step(state, inputs): returns the next state.
  function Session(M, me, send, step) {
    this.M = M; this.me = me; this.send = send; this.stepFn = step;
    this.state = M.create();
    this.frame = 0;            // next frame to simulate
    this.localTop = DELAY - 1; // last frame with a local input (the first DELAY frames are empty)
    this.local = [];           // my input per frame
    this.remote = [];          // the peer's confirmed input per frame
    this.used = [];            // the peer input each frame was simulated with
    this.snaps = [];           // state before each frame
    this.confirmed = -1;       // last frame up to which every peer input is known
    this.peerFrame = 0;        // the peer's frame when it last sent
    this.peerAdv = 0;          // the peer's own frame advantage, as it reported
    this.rollbackTo = -1;      // earliest frame that was mispredicted
    this.myHash = {}; this.peerHash = {};
    this.desync = -1;          // first frame whose hashes disagreed
    this.rollbacks = 0; this.stalls = 0; this.ticks = 0;
  }

  Session.prototype.predict = function (f) {
    if (this.remote[f] !== undefined) return this.remote[f];
    const last = Math.min(this.confirmed, f - 1);
    return last >= 0 && this.remote[last] !== undefined ? this.remote[last] : 0;
  };

  Session.prototype.simulate = function (f) {
    this.snaps[f] = this.M.clone(this.state);
    const r = this.predict(f), l = this.local[f] || 0;
    this.used[f] = r;
    this.state = this.stepFn(this.state, this.me === 0 ? [l, r] : [r, l]);
  };

  Session.prototype.packet = function () {
    const f = this.localTop, n = [];
    for (let k = Math.max(0, f - REDUNDANCY + 1); k <= f; k++) n.push(this.local[k] || 0);
    return { t: "i", f, n, at: this.frame, adv: this.frame - this.peerFrame };
  };

  // Called once per 60 Hz tick with the local input. Returns true if a frame was simulated.
  Session.prototype.tick = function (input) {
    this.ticks++;
    if (this.rollbackTo >= 0) this.rollback();
    // stay in step: never run more than MAX_ROLLBACK frames past the last confirmed input, and
    // let the peer catch up when we are clearly ahead of it
    const ahead = this.frame - this.confirmed - 1 >= MAX_ROLLBACK;
    const adv = (this.frame - this.peerFrame) - this.peerAdv;
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
    if (msg.t === "i") {
      const first = msg.f - msg.n.length + 1;
      for (let k = 0; k < msg.n.length; k++) {
        const f = first + k;
        if (f < 0 || this.remote[f] !== undefined) continue;
        this.remote[f] = msg.n[k];
        // a frame we already simulated with a wrong guess must be redone
        if (f < this.frame && this.used[f] !== msg.n[k] && (this.rollbackTo < 0 || f < this.rollbackTo)) this.rollbackTo = f;
      }
      while (this.remote[this.confirmed + 1] !== undefined) this.confirmed++;
      // later predictions change when the confirmed input changes, so redo from there too
      if (this.rollbackTo >= 0) for (let f = this.rollbackTo; f < this.frame; f++) if (this.used[f] !== this.predict(f)) { this.rollbackTo = f; break; }
      if (msg.at > this.peerFrame) { this.peerFrame = msg.at; this.peerAdv = msg.adv; }
    } else if (msg.t === "h") {
      this.peerHash[msg.f] = msg.h;
      this.compare(msg.f);
    }
  };

  // hash the state at confirmed frames: both sides must agree exactly
  Session.prototype.checkHash = function () {
    const f = Math.floor(Math.min(this.confirmed, this.frame - 1) / HASH_EVERY) * HASH_EVERY;
    if (f <= 0 || this.myHash[f] !== undefined || !this.snaps[f]) return;
    if (this.rollbackTo >= 0 && this.rollbackTo <= f) return;
    this.myHash[f] = this.M.hash(this.snaps[f]);
    this.send({ t: "h", f, h: this.myHash[f] });
    this.compare(f);
  };

  Session.prototype.compare = function (f) {
    if (this.myHash[f] === undefined || this.peerHash[f] === undefined) return;
    if (this.myHash[f] !== this.peerHash[f] && (this.desync < 0 || f < this.desync)) this.desync = f;
  };

  Session.prototype.prune = function () {
    const old = this.frame - KEEP;
    if (old < 0) return;
    delete this.snaps[old]; delete this.used[old];
    if (old < this.confirmed) { delete this.remote[old - 1]; delete this.local[old]; }
    delete this.myHash[old - HASH_EVERY]; delete this.peerHash[old - HASH_EVERY];
  };

  // The sim step used online: like the offline loop, a finished match restarts when either player
  // presses jump or light, but here it happens inside the input stream so both sides agree.
  function makeStep(Sim, M) {
    const go = Sim.IN.J | Sim.IN.A;
    return (s, inputs) => {
      if (s.over && s.overT > 60 && (inputs[0] | inputs[1]) & go) return M.create();
      M.step(s, inputs);
      return s;
    };
  }

  const api = { Session, makeStep, DELAY, MAX_ROLLBACK };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Net = api;
})(this);
