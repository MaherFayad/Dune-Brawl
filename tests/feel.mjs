// Feel harness: measures the sim in body heights and frames, compares to the reference targets.
// usage: node tests/feel.mjs [fighter-id] [--json]
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Sim = require("../game/sim.js");
const { S, IN, ST, STAGE, FEEL } = Sim;
// FEEL_OVERRIDE='{"grav":60}' node tests/feel.mjs  tries values without editing the sim
if (process.env.FEEL_OVERRIDE) Object.assign(FEEL, JSON.parse(process.env.FEEL_OVERRIDE));

const id = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "djinn-warrior";
const def = (f) => JSON.parse(readFileSync(new URL(`../assets/fighters/${f}/moves.draft.json`, import.meta.url)));
const targets = JSON.parse(readFileSync(new URL("../docs/design/feel-targets.json", import.meta.url)));
const BODY = FEEL.h * S;
const b = (v) => v / BODY;

function fresh(a = id, v = id) {
  const M = Sim.match(def(a), def(v));
  const s = M.create();
  s.f = FEEL.countdown + 1;
  for (const p of s.p) { p.y = STAGE.main.y; p.ground = 1; } // skip the spawn drop
  return { M, s };
}
function run(M, s, frames, inA = () => 0, inB = () => 0) {
  for (let k = 0; k < frames; k++) M.step(s, [inA(k, s), inB(k, s)]);
}

const out = {};
out.stageWidth = b(STAGE.main.x2 - STAGE.main.x1);
out.platformHeight = b(STAGE.main.y - STAGE.plats[0].y);
{ // run speed and stage crossing
  const { M, s } = fresh();
  run(M, s, 40, () => IN.R);
  out.runSpeed = b(Math.abs(s.p[0].vx));
  out.stageCrossFrames = (STAGE.main.x2 - STAGE.main.x1) / Math.abs(s.p[0].vx);
}
{ // jumps
  const { M, s } = fresh();
  let apex = 0, air = 0, y0 = s.p[0].y;
  run(M, s, 1, () => IN.J);
  for (let k = 0; k < 200 && !s.p[0].ground; k++) { M.step(s, [IN.J, 0]); air++; apex = Math.max(apex, y0 - s.p[0].y); }
  out.fullJumpHeight = b(apex); out.fullJumpAirtime = air + 1;
  const t = fresh(); let hop = 0; const yy = t.s.p[0].y;
  run(t.M, t.s, 1, () => IN.J);
  for (let k = 0; k < 120 && !t.s.p[0].ground; k++) { t.M.step(t.s, [0, 0]); hop = Math.max(hop, yy - t.s.p[0].y); }
  out.shortHopHeight = b(hop);
  out.jumpsTotal = 1 + t.M.ph[0].airJumps;
  out.fallSpeed = b(t.M.ph[0].maxFall);
  out.fastFallSpeed = b(t.M.ph[0].fastFall);
}
{ // attack timing and hitstop
  const { M } = fresh();
  const mv = M.mv[0];
  const lights = [0, 1, 2, 3, 4, 8].map((i) => mv[i].su), heavies = [5, 7].map((i) => mv[i].su);
  out.lightStartup = lights.reduce((a, c) => a + c, 0) / lights.length;
  out.heavyStartup = heavies.reduce((a, c) => a + c, 0) / heavies.length;
  const pause = (d) => Math.min(FEEL.pauseMax, FEEL.pauseBase + Math.trunc(d / FEEL.pauseDiv));
  out.hitstopLight = pause(mv[0].dmg); out.hitstopHeavy = pause(mv[5].dmg);
}
// launch a victim with move `slot` at `pct` damage; returns launch speed (bodies/frame), hitstun and KO
function launch(slot, pct, victimAI, mid) {
  const { M, s } = fresh();
  const a = s.p[0], v = s.p[1], m = STAGE.main;
  a.x = mid ? 640 * S : m.x2 - 70 * S; a.face = 1; v.x = a.x + 40 * S; v.face = -1; v.dmg = pct;
  const key = [IN.A, IN.R | IN.A, IN.D | IN.A, IN.U | IN.A, IN.A, IN.R | IN.B, IN.U | IN.B, IN.D | IN.B][slot];
  run(M, s, 1, () => key);
  let speed = 0, stun = 0, ko = false, frames = 0;
  for (let k = 0; k < 420; k++) {
    M.step(s, [0, victimAI ? victimAI(s) : 0]);
    if (!speed && v.st === ST.HIT) { speed = Math.hypot(v.vx, v.vy); stun = v.t; }
    if (v.st === ST.DEAD) { ko = true; frames = k; break; }
  }
  return { speed: b(speed), stun, ko, frames };
}
// a victim that recovers like a player: drift toward the stage, save jumps until it drops to
// ledge height, recovery move when out of jumps, wall jumps off the island side
const recoverAI = (s) => {
  const v = s.p[1], m = STAGE.main;
  if (v.st === ST.HIT || v.st === ST.DEAD || v.ground) return 0;
  let k = v.x > m.x2 ? IN.L : v.x < m.x1 ? IN.R : 0;
  const low = v.y > m.y - 40 * S;
  if (v.st === ST.IDLE && v.vy > 0 && low && s.f % 2 === 0) k |= v.wall || v.jumps > 0 ? IN.J : v.recov ? 0 : IN.U | IN.B;
  return k;
};
out.launchLight50 = launch(1, 50).speed;
out.launchHeavy100 = launch(5, 100).speed;
out.hitstunLight0 = launch(0, 0).stun;
out.hitstunHeavy100 = launch(5, 100).stun;
for (const [name, mid] of [["killSideHeavyLedge", false], ["killSideHeavyMidStage", true]]) {
  let kill = null;
  for (let pct = 0; pct <= 300; pct += 5) if (launch(5, pct, recoverAI, mid).ko) { kill = pct; break; }
  out[name] = kill; // victim recovers toward the stage with jumps and recovery
}
out.dodgeFrames = FEEL.dodgeG;
out.dodgeDistance = (() => { const { M, s } = fresh(); run(M, s, 1, () => IN.R | IN.X); const x0 = s.p[0].x; run(M, s, FEEL.dodgeG, () => 0); return b(Math.abs(s.p[0].x - x0)); })();

if (process.argv.includes("--json")) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }
const rows = Object.entries(out).map(([k, v]) => {
  const t = targets[k];
  const val = typeof v === "number" ? +v.toFixed(3) : v;
  let verdict = "";
  if (t && typeof v === "number") {
    const [lo, hi] = Array.isArray(t.range) ? t.range : [t.value, t.value];
    verdict = v >= lo && v <= hi ? "ok" : v < lo ? "LOW" : "HIGH";
  }
  return { metric: k, value: val, target: t ? (t.range ? t.range.join(" to ") : t.value) : "", verdict };
});
console.log(`fighter: ${id}`);
console.table(rows);
