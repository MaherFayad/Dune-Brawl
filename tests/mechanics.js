// Mechanics checks for dash, hit-cancel, charge, armor, parry and the reference's dodge,
// chase dodge, gravity cancel, whiff and jump timing rules. usage: node tests/mechanics.js
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
  run(M, s, 2 + FEEL.jumpSquat, (k) => (k === 0 ? IN.J : 0)); // the jump leaves the ground after its startup
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
  run(M, s, 2 + FEEL.jumpSquat, (k) => (k === 0 ? IN.J : 0)); // the jump leaves the ground after its startup
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
{ // dodge timing: 2 startup frames (still hittable), then invincible
  const { M, s } = setup();
  run(M, s, 1, () => 0, () => IN.X);                 // the victim backsteps
  const v = s.p[1];
  ok(v.st === ST.DODGE && v.dt - v.t < FEEL.dodgeStart, "a dodge starts with its startup frames");
  run(M, s, FEEL.dodgeStart);
  ok(v.st === ST.DODGE && v.dt - v.t >= FEEL.dodgeStart && v.dt === FEEL.dodgeStart + FEEL.dodgeInvGround, `ground dodge: ${FEEL.dodgeStart} startup + ${FEEL.dodgeInvGround} invincible frames`);
}
{ // air dodge cooldown: 163 frames in the air; landing 75+ frames after it clears the cooldown
  const { M, s } = setup(); const p = s.p[0];
  run(M, s, 1 + FEEL.jumpSquat, () => IN.J); run(M, s, 6, () => IN.J);
  run(M, s, 1, () => IN.R | IN.X);
  ok(p.st === ST.DODGE && p.dk === 1 && p.dcd >= FEEL.dodgeCdA - 2, `an air dodge sets a ${FEEL.dodgeCdA} frame cooldown`);
  run(M, s, 120, () => 0);
  ok(p.ground && p.dcd === 0, `landing ${FEEL.dodgeLandCd}+ frames after an air dodge clears its cooldown`);
  const t = setup(), q = t.s.p[0];
  run(t.M, t.s, 1 + FEEL.jumpSquat, () => IN.J); run(t.M, t.s, 2, () => IN.J);
  run(t.M, t.s, 1, () => IN.D | IN.X); // dodge straight down: lands at once
  run(t.M, t.s, 20, () => 0);
  ok(q.ground && q.dcd > 0 && q.dcd <= FEEL.dodgeLandCd, `landing soon after an air dodge caps the cooldown at ${FEEL.dodgeLandCd} frames (${q.dcd} left)`);
}
{ // chase dodge: landing a hit gives dodges that ignore the cooldown, cancelable into an attack
  const { M, s } = setup(); const p = s.p[0], m = M.mv[0][0];
  p.dcd = 999; // the dodge itself is on cooldown
  run(M, s, 1, () => IN.A); run(M, s, m.su + m.ac + FEEL.pauseMax);
  ok(p.hit && p.chase === 2, "a grounded hit grants 2 chase dodges");
  run(M, s, 1, () => IN.R | IN.X);
  ok(p.st === ST.DODGE && p.dk === 4 && p.chase === 1, "a chase dodge goes off despite the cooldown");
  run(M, s, 4, () => 0); run(M, s, 1, () => IN.A);
  ok(p.st === ST.ATK && p.inv > 0, `an attack within ${FEEL.chaseCancel} frames cancels the chase dodge, with invincibility`);
}
{ // gravity cancel: an in-place dodge then an attack gives an air move on the ground
  const { M, s } = setup(); const p = s.p[0]; s.p[1].x = 1000 * S;
  run(M, s, 1, () => IN.X); run(M, s, 3, () => 0); run(M, s, 1, () => IN.A);
  ok(p.st === ST.ATK && p.mv === 4 && p.ground, "a gravity cancel turns a grounded neutral light into the neutral air");
}
{ // whiffing locks the dodge for a few frames; hits recover faster than misses
  const { M, s } = setup(); const p = s.p[0], m = M.mv[0][1]; s.p[1].x = 1000 * S;
  run(M, s, 1, () => IN.R | IN.A); run(M, s, m.su + m.ac + m.re);
  ok(p.st === ST.IDLE && p.lock > 0, `a missed attack locks the dodge for ${FEEL.missDodgeLock} frames`);
  const a = setup(), b = setup(); b.s.p[1].x = 1000 * S;
  const ends = (t) => { let k = 0; t.M.step(t.s, [IN.R | IN.A, 0]); while (t.s.p[0].st === ST.ATK && k < 200) { t.M.step(t.s, [0, 0]); k++; } return k; };
  const onHit = ends(a), onMiss = ends(b);
  ok(onHit < onMiss + FEEL.pauseMax, `recovery is shorter on hit (${onHit} frames incl. hit pause) than on a miss (${onMiss})`);
}
{ // jump startup: the jump leaves the ground after 2 frames; a tap during it is a short hop
  const { M, s } = setup(); const p = s.p[0];
  run(M, s, 1, () => IN.J);
  ok(p.ground && p.squat > 0, `a jump waits ${FEEL.jumpSquat} startup frames on the ground`);
  run(M, s, FEEL.jumpSquat, () => IN.J);
  ok(!p.ground && p.vy < 0, "then leaves the ground");
}
{ // heavy (signature) attacks share a short global cooldown
  const { M, s } = setup(); const p = s.p[0], m = M.mv[0][5]; s.p[1].x = 1000 * S;
  run(M, s, 1, () => IN.R | IN.B); let k = 0; while (p.st === ST.ATK && k++ < 200) M.step(s, [0, 0]);
  ok(p.sig > 0, `a heavy ends with a ${FEEL.sigCd} frame signature cooldown`);
  M.step(s, [IN.R | IN.B, 0]);
  ok(p.st !== ST.ATK, "a heavy pressed during it waits");
}
console.log(fails ? `${fails} failed` : "all mechanics ok");
process.exit(fails ? 1 : 0);
