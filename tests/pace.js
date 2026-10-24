// Match pacing: runs the game's own bot (lifted from game/main.js) against itself headless and
// reports KO rate and damage at KO, to compare with the reference (one KO per ~40 s, median about 162%).
// usage: node tests/pace.js [fighterA] [fighterB] [minutes] [seed]
const fs = require("fs"), path = require("path");
const Sim = require("../game/sim.js");
const { S, IN, ST, STAGE, FEEL } = Sim;
const src = fs.readFileSync(path.join(__dirname, "../game/main.js"), "utf8");
const body = src.slice(src.indexOf("  function bot("), src.indexOf("  // ---------- assets"));
const [a = "djinn-warrior", b = "dagger-dancer", mins = 6, seed0 = 1] = process.argv.slice(2);
let seed = Number(seed0);
Math.random = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // repeatable bot choices
const bot = new Function("S", "IN", "ST", "STAGE", "FEEL", body + "; return bot;")(S, IN, ST, STAGE, FEEL);
const def = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, `../assets/fighters/${f}/moves.draft.json`)));
const M = Sim.match(def(a), def(b));
let s = M.create();
const kos = [];
for (let k = 0; k < 3600 * mins; k++) {
  const before = s.p.map((p) => ({ st: p.st, dmg: p.dmg, x: p.x, y: p.y }));
  M.step(s, [bot(s, 0, 2), bot(s, 1, 2)]);
  s.p.forEach((p, i) => {
    if (before[i].st !== ST.DEAD && p.st === ST.DEAD) kos.push({ k, i, dmg: before[i].dmg, bottom: before[i].y > STAGE.main.y + 300 * S });
  });
  if (s.over && s.overT > 60) s = M.create();
}
const mean = kos.length ? Math.round(kos.reduce((t, q) => t + q.dmg, 0) / kos.length) : 0;
const sorted = kos.map((q) => q.dmg).sort((x, y) => x - y), median = sorted.length ? sorted[sorted.length >> 1] : 0;
console.log(`${a} vs ${b}, ${mins} min: ${kos.length} KOs, one per ${(60 * mins / Math.max(1, kos.length)).toFixed(0)} s, mean damage at KO ${mean}%, median ${median}%, off the bottom ${kos.filter((q) => q.bottom).length}`);
