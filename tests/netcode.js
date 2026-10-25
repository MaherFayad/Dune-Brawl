// Rollback netcode check: two sessions over a simulated network (latency, jitter, loss) must end
// in the same state as a plain offline run fed the same inputs. usage: node tests/netcode.js
const fs = require("fs"), path = require("path");
const Sim = require("../game/sim.js"), Net = require("../game/net.js");
const def = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, `../assets/fighters/${f}/moves.draft.json`)));
let fails = 0;
const ok = (c, m) => { console.log((c ? "ok   " : "FAIL ") + m); if (!c) fails++; };

function scenario(name, latency, jitter, loss, frames, seed) {
  let r = seed;
  const rnd = () => ((r = (r * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const defs = [def("djinn-warrior"), def("melting-yeti")];
  const mk = () => Sim.match(defs[0], defs[1]);
  const queues = [[], []]; // messages in flight to player i: { due, msg }
  let clock = 0;
  const sessions = [0, 1].map((me) => {
    const M = mk();
    return new Net.Session(M, me, (msg) => {
      if (rnd() < loss) return;
      queues[1 - me].push({ due: clock + latency + Math.floor(rnd() * (jitter + 1)), msg: JSON.parse(JSON.stringify(msg)) });
    }, Net.makeStep(Sim, M));
  });
  // sticky random inputs, like a player holding directions and tapping buttons
  const held = [0, 0], log = [[], []];
  const nextInput = (i) => {
    if (rnd() < 0.08) held[i] = [0, 1, 2, 4, 8, 1 | 4, 2 | 4][Math.floor(rnd() * 7)];
    const tap = rnd() < 0.12 ? [16, 32, 64, 128][Math.floor(rnd() * 4)] : 0;
    return held[i] | tap;
  };
  for (; clock < frames; clock++) {
    for (const i of [0, 1]) {
      const due = queues[i].filter((q) => q.due <= clock);
      queues[i] = queues[i].filter((q) => q.due > clock);
      for (const q of due) sessions[i].receive(q.msg);
    }
    for (const i of [0, 1]) {
      const s = sessions[i], f = s.frame, input = nextInput(i);
      if (s.tick(input)) log[i][f + Net.DELAY] = input;
    }
  }
  // let everything in flight arrive, with no new input, until both are confirmed
  for (let k = 0; k < 120; k++, clock++) {
    for (const i of [0, 1]) { for (const q of queues[i].filter((q) => q.due <= clock)) sessions[i].receive(q.msg); queues[i] = queues[i].filter((q) => q.due > clock); }
    for (const i of [0, 1]) { const f = sessions[i].frame; if (sessions[i].tick(0)) log[i][f + Net.DELAY] = 0; }
  }
  const F = Math.min(sessions[0].confirmed, sessions[1].confirmed, sessions[0].frame - 1, sessions[1].frame - 1);
  // offline replay with the true inputs
  const M = mk(), step = Net.makeStep(Sim, M);
  let st = M.create();
  for (let f = 0; f < F; f++) st = step(st, [log[0][f] || 0, log[1][f] || 0]);
  const truth = M.hash(st), h0 = M.hash(sessions[0].snaps[F]), h1 = M.hash(sessions[1].snaps[F]);
  const s0 = sessions[0], s1 = sessions[1];
  ok(h0 === truth && h1 === truth && s0.desync < 0 && s1.desync < 0,
    `${name}: both peers match the offline run at frame ${F} (rollbacks ${s0.rollbacks}/${s1.rollbacks}, stalls ${s0.stalls}/${s1.stalls}, frames ${s0.frame}/${s1.frame} of ${clock})`);
  return { s0, s1 };
}

scenario("LAN, 1 frame", 1, 0, 0, 3600, 7);
scenario("same city, 3 to 5 frames (50 to 80 ms), 5% loss", 3, 2, 0.05, 3600, 11);
scenario("across the Gulf, 6 to 10 frames (100 to 170 ms), 10% loss", 6, 4, 0.1, 3600, 23);
const { s0 } = scenario("bad link, 10 to 18 frames, 20% loss", 10, 8, 0.2, 2400, 5);
ok(s0.rollbacks > 0, "the bad link actually exercised rollback");
// four players: guests talk only to the host, which relays every guest's packets to the others
function scenario4(name, latency, jitter, loss, frames, seed) {
  let r = seed;
  const rnd = () => ((r = (r * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const defs = [def("djinn-warrior"), def("melting-yeti"), def("djinn-warrior"), def("melting-yeti")];
  const mk = () => Sim.match(defs);
  const N = 4, queues = [[], [], [], []];
  let clock = 0;
  const deliver = (to, msg, hops) => { for (let h = 0; h < hops; h++) if (rnd() < loss) return; queues[to].push({ due: clock + hops * latency + Math.floor(rnd() * (jitter + 1)), msg: JSON.parse(JSON.stringify(msg)) }); };
  const sessions = [0, 1, 2, 3].map((me) => {
    const M = mk();
    return new Net.Session(M, me, (msg) => {
      for (let to = 0; to < N; to++) if (to !== me) deliver(to, msg, me === 0 || to === 0 ? 1 : 2); // guest to guest goes through the host
    }, Net.makeStep(Sim, M), N);
  });
  const held = [0, 0, 0, 0], log = [[], [], [], []];
  const nextInput = (i) => {
    if (rnd() < 0.08) held[i] = [0, 1, 2, 4, 8, 1 | 4, 2 | 4][Math.floor(rnd() * 7)];
    return held[i] | (rnd() < 0.12 ? [16, 32, 64, 128][Math.floor(rnd() * 4)] : 0);
  };
  const pump = () => { for (let i = 0; i < N; i++) { for (const q of queues[i].filter((q) => q.due <= clock)) sessions[i].receive(q.msg); queues[i] = queues[i].filter((q) => q.due > clock); } };
  for (; clock < frames; clock++) { pump(); for (let i = 0; i < N; i++) { const f = sessions[i].frame, inp = nextInput(i); if (sessions[i].tick(inp)) log[i][f + Net.DELAY] = inp; } }
  for (let k = 0; k < 200; k++, clock++) { pump(); for (let i = 0; i < N; i++) { const f = sessions[i].frame; if (sessions[i].tick(0)) log[i][f + Net.DELAY] = 0; } }
  const F = Math.min(...sessions.map((x) => Math.min(x.confirmed, x.frame - 1)));
  const M = mk(), step = Net.makeStep(Sim, M);
  let st = M.create();
  for (let f = 0; f < F; f++) st = step(st, log.map((l) => l[f] || 0));
  const truth = M.hash(st), all = sessions.every((x) => M.hash(x.snaps[F]) === truth && x.desync < 0);
  ok(all, `${name}: all four peers match the offline run at frame ${F} (rollbacks ${sessions.map((x) => x.rollbacks).join("/")})`);
}
scenario4("4 players, same city via the host relay, 5% loss", 3, 2, 0.05, 2400, 31);
scenario4("4 players, across the Gulf via the host relay, 10% loss", 6, 4, 0.1, 2400, 47);
console.log(fails ? `${fails} failed` : "netcode ok");
process.exit(fails ? 1 : 0);
