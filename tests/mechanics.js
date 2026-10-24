// Mechanics checks for dash, hit-cancel, charge, armor and parry. usage: node tests/mechanics.js
const fs = require("fs"), path = require("path");
const Sim = require("../game/sim.js");
const { S, IN, ST, STAGE, FEEL } = Sim;
const def = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, `../assets/fighters/${f}/moves.draft.json`)));
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? "ok   " : "FAIL ") + msg); if (!cond) fails++; };
function setup(a = "djinn-warrior", b = "djinn-warrior", patch) {
  const da = def(a), db = def(b);
  if (patch) patch(da, db);
  const M = Sim.match(da, db), s = M.create();
  s.f = FEEL.countdown + 1;
  for (const p of s.p) { p.y = STAGE.main.y; p.ground = 1; }
  s.p[0].x = 600 * S; s.p[0].face = 1; s.p[1].x = 640 * S; s.p[1].face = -1;
  return { M, s };
}
const run = (M, s, n, a = () => 0, b = () => 0) => { for (let k = 0; k < n; k++) M.step(s, [a(k), b(k)]); };

{ // dash: fast, then cancelable into a jump
  const { M, s } = setup(); s.p[1].x = 1000 * S;
  run(M, s, 1, () => IN.R | IN.X);
  ok(s.p[0].st === ST.DASH && s.p[0].vx > FEEL.run, "ground dodge with a direction starts a dash faster than running");
  run(M, s, FEEL.dashCancelFrom, () => IN.R);
  run(M, s, 2, (k) => (k === 0 ? IN.J : 0));
  ok(!s.p[0].ground, "a dash cancels into a jump after the cancel frame");
}
{ // dodge without a direction: an evasive backstep, away from where the fighter faces
  const { M, s } = setup(); s.p[1].x = 1000 * S;
  const x0 = s.p[0].x; run(M, s, 12, (k) => (k === 0 ? IN.X : 0));
  const back = (x0 - s.p[0].x) / S;
  ok(s.p[0].st === ST.DODGE && back > 20 && back < 100, `dodge without a direction backsteps (${back.toFixed(0)} px back)`);
}
{ // hit-cancel: after the jab connects, jump cuts the recovery
  const { M, s } = setup(); const m = M.mv[0][0];
  run(M, s, 1, () => IN.A);
  run(M, s, m.su + m.ac + FEEL.pauseMax + 2);
  const hit = s.p[0].hit;
  run(M, s, 2, (k) => (k === 0 ? IN.J : 0));
  ok(hit && s.p[0].st !== ST.ATK && !s.p[0].ground, "a connected jab cancels into a jump");
}
{ // charge: holding B stores power, the hit does more damage
  const dealt = (hold) => { const { M, s } = setup(); run(M, s, 1, () => IN.R | IN.B); run(M, s, 60, () => (hold ? IN.B : 0)); return s.p[1].dmg; };
  const plain = dealt(false), charged = dealt(true);
  ok(charged > plain && charged <= Math.ceil(plain * 1.5), `holding a heavy charges it (${plain} -> ${charged} damage)`);
}
{ // armor: the defender takes damage but keeps its move
  const armorPatch = (da, db) => { db.moves[5].armor = [0, 40]; };
  const { M, s } = setup("djinn-warrior", "djinn-warrior", armorPatch);
  run(M, s, 1, () => IN.A, () => IN.L | IN.B);
  run(M, s, M.mv[0][0].su + 2);
  ok(s.p[1].dmg > 0 && s.p[1].st === ST.ATK, "an armored move takes the damage and keeps going");
}
{ // parry: the attacker is stunned, the parrier takes nothing
  const parryPatch = (da, db) => { db.moves[2].parry = [1, 12]; };
  const { M, s } = setup("djinn-warrior", "djinn-warrior", parryPatch);
  run(M, s, 1, () => 0, () => IN.D | IN.A);
  run(M, s, 1, () => IN.A);
  run(M, s, M.mv[0][0].su + 2);
  ok(s.p[1].dmg === 0 && s.p[0].st === ST.HIT, "hitting a parry stuns the attacker and deals no damage");
}
{ // no infinite jab lock: a victim caught in a jab string can dodge out of it
  const { M, s } = setup();
  const press = (k) => (k % 2 ? 0 : IN.R | IN.A);
  let hits = 0, lastHf = s.hf;
  const count = () => { if (s.hf !== lastHf) { lastHf = s.hf; if (s.hp === 0) hits++; } };
  for (let k = 0; k < 40; k++) { M.step(s, [press(k), 0]); count(); } // the victim stands in the string
  const caught = hits;
  for (let k = 0; k < 300; k++) { M.step(s, [press(k + 40), k % 2 ? IN.X : 0]); count(); } // then mashes dodge
  ok(caught > 0 && hits - caught < 6, `a victim mashing dodge escapes a jab string (${caught} jabs caught, ${hits - caught} more in 5 s)`);
}
console.log(fails ? `${fails} failed` : "all mechanics ok");
process.exit(fails ? 1 : 0);
