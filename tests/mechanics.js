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
{ // finisher: a charged side heavy on a fighter at the finisher's damage plays the cinematic, then KOs
  const { M, s } = setup(); const v = s.p[1]; v.dmg = FEEL.finDamage + 10; s.p[1].x = 660 * S;
  M.step(s, [IN.R | IN.B, 0]); for (let k = 0; k < 60 && !s.fin; k++) M.step(s, [IN.B, 0]);
  ok(s.fin === FEEL.finFrames - 0 || s.fin > 0, "a charged side heavy on a fighter at the finisher's damage starts the finisher");
  const hold = { x: v.x, y: v.y }; run(M, s, FEEL.finFrames - 10);
  ok(v.x === hold.x && v.y === hold.y, "the game holds still while the finisher plays");
  let ko = false; for (let k = 0; k < 300 && !ko; k++) { M.step(s, [0, 0]); ko = v.st === ST.DEAD || v.stocks < 3; }
  ok(ko, "the finisher ends in a KO");
}
// ---- the stick kit (fighters whose definition sets kit) ----
const kit = (da, db) => { da.kit = 1; db.kit = 1; };
{ // instant jump, higher than the reference jump
  const r = setup(), k = setup("djinn-warrior", "djinn-warrior", kit);
  run(k.M, k.s, 1, () => IN.J);
  ok(!k.s.p[0].ground, "kit: the jump leaves the ground at once");
  let top = 0, topR = 0; const y0 = k.s.p[0].y;
  for (let j = 0; j < 60; j++) { k.M.step(k.s, [IN.J, 0]); top = Math.max(top, y0 - k.s.p[0].y); }
  run(r.M, r.s, 1 + FEEL.jumpSquat, () => IN.J); for (let j = 0; j < 60; j++) { r.M.step(r.s, [IN.J, 0]); topR = Math.max(topR, y0 - r.s.p[0].y); }
  ok(top > topR * 1.15, `kit: a full jump goes higher (${(top / S).toFixed(0)} px against ${(topR / S).toFixed(0)})`);
}
{ // sprint builds while running
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); s.p[1].x = 1050 * S; s.p[0].x = 250 * S;
  run(M, s, 10, () => IN.R); const v10 = s.p[0].vx; run(M, s, 30, () => IN.R);
  ok(s.p[0].vx > v10 * 1.2, `kit: running builds into a sprint (${v10} to ${s.p[0].vx})`);
}
{ // slide: low and fast; it ducks under a jab
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0];
  run(M, s, 1, () => IN.R | IN.D | IN.X);
  ok(p.st === ST.DASH && p.slide === 1 && p.vx >= FEEL.kit.slideSpeed, "kit: down + dodge on the ground slides");
}
{ // air dashes: two per airtime, back on landing
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0]; s.p[1].x = 1050 * S;
  p.y = -300 * S; p.ground = 0; p.vy = 0; // high above the stage, so nothing lands mid-test
  run(M, s, 2);
  run(M, s, 1, () => IN.R | IN.X); const one = p.st === ST.DODGE && p.adash === 1;
  run(M, s, FEEL.kit.dashACd + 2); run(M, s, 1, () => IN.L | IN.U | IN.X); const two = p.st === ST.DODGE && p.adash === 2;
  run(M, s, FEEL.kit.dashACd + 2); run(M, s, 1, () => IN.R | IN.X); const none = p.st !== ST.DODGE;
  ok(one && two && none, "kit: two air dashes per airtime, a third waits");
  run(M, s, 400); ok(p.ground && p.adash === 0, "kit: landing gives the air dashes back");
}
{ // grace jump after running off a ledge, and a super jump from a crouch
  const g1 = setup("djinn-warrior", "djinn-warrior", kit), p = g1.s.p[0]; p.x = (STAGE.main.x2 - 4 * S); g1.s.p[1].x = 600 * S;
  let k = 0; while (p.ground && k++ < 40) g1.M.step(g1.s, [IN.R, 0]);
  run(g1.M, g1.s, 2, () => IN.R); run(g1.M, g1.s, 1, () => IN.J);
  ok(p.vy < -1000, "kit: a jump a moment after running off the ledge still works");
  const g2 = setup("djinn-warrior", "djinn-warrior", kit); g2.s.p[1].x = 1050 * S;
  run(g2.M, g2.s, FEEL.kit.crouchFor + 2, () => IN.D); run(g2.M, g2.s, 1, () => IN.J);
  ok(g2.s.p[0].sj === 1 && g2.s.p[0].vy < g2.M.ph[0].jumpV, "kit: a crouch held a moment turns the jump into a super jump");
}
{ // wall run: holding toward the island's side runs up it; a jump kicks off away from it
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0]; s.p[1].x = 400 * S;
  Object.assign(p, { x: STAGE.main.x2 + 10 * S, y: STAGE.main.y + 50 * S, ground: 0, vx: 0, vy: 0, face: -1 });
  run(M, s, 1, () => IN.L); const y0 = p.y; run(M, s, 6, () => IN.L);
  ok(p.wr > 0 && p.y < y0, `kit: holding toward the wall runs up it (${p.wr} frames, rose ${((y0 - p.y) / S).toFixed(0)} px)`);
  run(M, s, 5, () => IN.L | IN.J);
  ok(p.x > STAGE.main.x2 + 40 * S && p.face === 1 && p.vy < -1200, "kit: a wall jump kicks up and away from the wall, even holding toward it");
}
{ // combos: lights that hit chain into hit 2 and a finisher with more damage
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const a = s.p[0], v = s.p[1]; v.x = 650 * S;
  const steps = [], dmg = [];
  for (let n = 0; n < 3; n++) {
    let k = 0; while (a.st === ST.ATK && k++ < 60) M.step(s, [0, 0]); // wait for the move to end or cancel
    const before = v.dmg; M.step(s, [IN.A, 0]); steps.push(a.cmb);
    k = 0; while (!a.hit && a.st === ST.ATK && k++ < 40) M.step(s, [0, 0]);
    dmg.push(v.dmg - before); v.x = a.x + a.face * 40 * S; v.st = ST.IDLE; v.vx = 0; v.vy = 0; v.y = a.y; v.ground = 1;
  }
  ok(steps.join() === "0,1,2", `kit: three lights in a row are hit 1, hit 2 and the finisher (${steps})`);
  ok(dmg[2] > dmg[0], `kit: the combo finisher deals more damage (${dmg})`);
}
{ // a jab string connects all three hits by stepping in, with no help
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const a = s.p[0], v = s.p[1]; v.x = a.x + 60 * S;
  let hits = 0, k = 0;
  for (let n = 0; n < 3; n++) {
    M.step(s, [IN.A, 0]);
    for (k = 0; k < 60 && a.st === ST.ATK && !a.hit; k++) M.step(s, [0, 0]);
    if (a.hit) hits++;
    for (k = 0; k < 60 && a.st === ST.ATK && a.t < M.mv[0][a.mv].su + M.mv[0][a.mv].ac; k++) M.step(s, [0, 0]);
  }
  ok(hits === 3, `kit: a jab string lands all three hits on its own (${hits})`);
}
{ // a dash strike: an air dash cancels into an attack that keeps the dash's speed
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0]; s.p[1].x = 1050 * S;
  p.y = -300 * S; p.ground = 0; p.vy = 0; run(M, s, 2);
  run(M, s, 1, () => IN.R | IN.X); run(M, s, FEEL.kit.dashStrikeFrom, () => IN.R); run(M, s, 1, () => IN.R | IN.A);
  ok(p.st === ST.ATK && p.vx > FEEL.kit.airMax, `kit: an air dash cancels into an attack at speed (${p.vx})`);
}
{ // a running attack slides into the strike instead of stopping dead
  const a = setup("djinn-warrior", "djinn-warrior", kit), b = setup("djinn-warrior", "djinn-warrior", kit);
  for (const g of [a, b]) { g.s.p[1].x = 1050 * S; g.s.p[0].x = 250 * S; }
  run(a.M, a.s, 30, () => IN.R); const x0 = a.s.p[0].x; run(a.M, a.s, 1, () => IN.A); run(a.M, a.s, 8);
  const x1 = b.s.p[0].x; run(b.M, b.s, 1, () => IN.A); run(b.M, b.s, 8);
  ok(a.s.p[0].x - x0 > 60 * S && b.s.p[0].x - x1 < 10 * S, `kit: a running attack carries ${((a.s.p[0].x - x0) / S).toFixed(0)} px, a standing one ${((b.s.p[0].x - x1) / S).toFixed(0)}`);
}
{ // landing on a foe's head stomps them and bounces high, once per airtime
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0], o = s.p[1];
  o.x = 600 * S; Object.assign(p, { x: 600 * S, y: o.y - M.ph[1].h - 60 * S, ground: 0, vy: 800 });
  let k = 0; while (!p.hb && k++ < 30) M.step(s, [0, 0]);
  ok(p.hb && p.vy < -1500 && o.st === ST.HIT && o.dmg === FEEL.kit.stompDmg, "kit: landing on a head stomps it and bounces high");
}
// ---- weapon throws and clashes ----
{ // a thrown blade flies, hits the foe in its path, then drops and sticks in the stage
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0], v = s.p[1]; v.x = 900 * S;
  run(M, s, 1, () => IN.T);
  ok(p.st === ST.THROW, "kit: the throw button starts a throw");
  let k = 0; while (p.ws !== 1 && k++ < 30) M.step(s, [0, 0]);
  ok(p.ws === 1 && !p.wpn, "kit: the blade leaves the hand and flies");
  k = 0; while (v.dmg === 0 && k++ < 60) M.step(s, [0, 0]);
  ok(v.dmg === FEEL.kit.throwDmg && v.st === ST.HIT, `kit: the flying blade hits the foe in its path (${v.dmg})`);
  k = 0; while (p.ws !== 2 && k++ < 120) M.step(s, [0, 0]);
  ok(p.ws === 2, "kit: after the hit the blade drops and sticks in the stage");
  const before = v.dmg; v.x = 1000 * S; v.st = ST.IDLE; v.t = 0;
  M.step(s, [IN.R | IN.A, 0]); k = 0; while (p.st === ST.ATK && k++ < 40) M.step(s, [0, 0]);
  p.x = p.wx; p.y = STAGE.main.y; M.step(s, [0, 0]);
  ok(p.wpn === 1 && p.ws === 0, "kit: walking over the stuck blade picks it up");
}
{ // fists hit softer than the blade
  const a = setup("djinn-warrior", "djinn-warrior", kit), b = setup("djinn-warrior", "djinn-warrior", kit);
  a.s.p[0].wpn = 0; a.s.p[0].ws = 2; a.s.p[0].wx = 100 * S; a.s.p[0].wy = 2000 * S; // the blade stuck far away
  for (const g of [a, b]) { g.M.step(g.s, [IN.R | IN.A, 0]); let k = 0; while (g.s.p[0].st === ST.ATK && k++ < 40) g.M.step(g.s, [0, 0]); }
  ok(a.s.p[1].dmg > 0 && a.s.p[1].dmg < b.s.p[1].dmg, `kit: unarmed hits deal less (${a.s.p[1].dmg} against ${b.s.p[1].dmg})`);
}
{ // a thrown blade off the stage comes back to the hand
  const { M, s } = setup("djinn-warrior", "djinn-warrior", kit); const p = s.p[0]; s.p[1].x = 300 * S; p.x = 1000 * S;
  run(M, s, 1, () => IN.T); let k = 0; while (p.ws !== 0 || p.st === ST.THROW || !k) { if (k++ > 200) break; M.step(s, [0, 0]); }
  ok(p.wpn === 1 && p.ws === 0 && k < 200, `kit: a blade thrown off the stage comes back (${k} frames)`);
}
{ // two swings meeting: a clash, both recoil apart, nobody takes damage
  const { M, s } = setup(); const a = s.p[0], b = s.p[1]; a.x = 600 * S; b.x = 690 * S;
  M.step(s, [IN.R | IN.A, IN.L | IN.A]); let k = 0;
  while (a.st === ST.ATK && b.st === ST.ATK && k++ < 20) M.step(s, [0, 0]);
  ok(a.st === ST.CLASH && b.st === ST.CLASH && a.dmg === 0 && b.dmg === 0 && s.cf >= 0, "two swings meeting clash: both recoil, no damage");
  run(M, s, 4);
  ok(a.vx < 0 && b.vx > 0, "the clash pushes both fighters apart");
}
// ---- four fighters ----
{ // free for all: four spawns, one swing can hit two foes, the last fighter standing wins
  const d = def("djinn-warrior"), M = Sim.match([d, d, d, d]), s = M.create();
  ok(s.p.length === 4 && new Set(s.p.map((p) => p.x)).size === 4, "four fighters spawn at four places");
  s.f = FEEL.countdown + 1;
  for (const p of s.p) { p.y = STAGE.main.y; p.ground = 1; p.x = 900 * S; p.face = -1; }
  s.p[0].x = 600 * S; s.p[0].face = 1; s.p[1].x = 640 * S; s.p[2].x = 645 * S;
  M.step(s, [IN.R | IN.A, 0, 0, 0]); let k = 0; while (s.p[0].st === ST.ATK && k++ < 40) M.step(s, [0, 0, 0, 0]);
  ok(s.p[1].dmg > 0 && s.p[2].dmg > 0 && s.p[3].dmg === 0, `one side light hits both foes in reach (${s.p.map((p) => p.dmg)})`);
  for (const j of [1, 2]) s.p[j].stocks = 0;
  s.p[3].stocks = 1; s.p[3].x = 2000 * S; M.step(s, [0, 0, 0, 0]);
  ok(s.over === 1, `with one fighter left, the match ends for them (over ${s.over})`);
}
console.log(fails ? `${fails} failed` : "all mechanics ok");
process.exit(fails ? 1 : 0);
