// Dune Brawl test build: local play (vs bot, 2 players, bot vs bot), sprites, stage, effects.
(() => {
  "use strict";
  const { S, IN, ST, STAGE, FEEL } = Sim;
  const ROOT = "..";
  // ready: shown on the select screen. art and portrait point at the v2 rework once it lands.
  const FIGHTERS = {
    "djinn-warrior": { name: "Saif", title: "The Bound Blade", color: "#3d4fd6", glow: "#36e2d4", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "dune-ghoul": { name: "Abu Sarab", title: "Ghoul of the Dunes", color: "#7fbf3a", glow: "#c6ff3d", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "falcon-rider": { name: "Nawaf", title: "Falconer of the Heights", color: "#e9dcc0", glow: "#ffcf5a", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "sea-siren": { name: "Dana", title: "Bride of the Sea", color: "#1fb5a6", glow: "#8ff5ea", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "dagger-dancer": { name: "Marjana", title: "Bane of the Forty", color: "#d6337a", glow: "#ffd0e4", ready: 1 },
    "vampire-countess": { name: "Vespera", title: "The Countess in the Shade", color: "#b3123a", glow: "#ff5c7a", art: "anim-v2", ready: 1, victoryHold: 15,
      remap: { dair: { sheet: "side_light", rot: 1.2, axis: "fwd" } } }, // her down air clip never points down: the lunge, turned into a dive
    "gorilla-lumberjack": { name: "Timber", title: "The Gentle Feller", color: "#c8302c", glow: "#ffb15c", art: "anim-v2" },
    "fennec-host": { name: "Finjan", title: "The Host Who Pours First", color: "#f2b632", glow: "#fff0a0", art: "anim-v2" },
    "clockwork-elephant": { name: "Tiktak", title: "The Brass Hour", color: "#c9973a", glow: "#5ff0d8", art: "anim-v2" },
    "melting-yeti": { name: "Brrr", title: "The Homesick Snow", color: "#9fd8ff", glow: "#e8fbff", art: "anim-v2", ready: 1 },
    "baby-roc": { name: "Rukhayy", title: "The Roc Who Cannot Fly Yet", color: "#2443b8", glow: "#ffd25a", art: "anim-v2" },
    "chameleon-slinger": { name: "Hirba", title: "The Slow Trick Shot", color: "#7ccf2a", glow: "#ff5ad0", art: "anim-v2" },
  };
  const portraitSrc = (id) => `${ROOT}/assets/fighters/${id}/${FIGHTERS[id].portrait || "source/portrait.png"}`;
  const TEAM = ["#2fd5c4", "#ff7a45"];
  const params = new URLSearchParams(location.search);

  // ---------- canvas ----------
  const cv = document.getElementById("c"), g = cv.getContext("2d");
  let dpr = 1, W = 0, H = 0;
  function resize() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; }
  addEventListener("resize", resize); resize();

  // ---------- input ----------
  const keys = new Set();
  addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    keys.add(e.code);
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "F2", "F3"].includes(e.code)) e.preventDefault();
    if (e.code === "F2" && mode !== "online") togglePanel(); // live physics edits would desync an online match
    if (e.code === "F3") showBoxes = !showBoxes;
    if (e.code === "KeyM" && window.Sfx) Sfx.toggle();
    if (e.code === "Escape") { if (mode === "online") leaveOnline("You left the match."); showMenu(); }
  });
  addEventListener("keyup", (e) => keys.delete(e.code));
  addEventListener("blur", () => keys.clear());
  const SOLO = { L: ["KeyA", "ArrowLeft"], R: ["KeyD", "ArrowRight"], U: ["KeyW", "ArrowUp"], D: ["KeyS", "ArrowDown"], J: ["Space"], A: ["KeyJ", "KeyC"], B: ["KeyK", "KeyX"], X: ["KeyL", "ShiftLeft", "ShiftRight"] };
  const P1 = { L: ["KeyA"], R: ["KeyD"], U: ["KeyW"], D: ["KeyS"], J: ["Space"], A: ["KeyF"], B: ["KeyG"], X: ["KeyH", "ShiftLeft"] };
  const P2 = { L: ["ArrowLeft"], R: ["ArrowRight"], U: ["ArrowUp"], D: ["ArrowDown"], J: ["ShiftRight", "Numpad0"], A: ["Period", "Numpad1"], B: ["Slash", "Numpad2"], X: ["Comma", "Numpad3"] };
  const read = (map) => { let v = 0; for (const k in map) if (map[k].some((c) => keys.has(c))) v |= IN[k]; return v; };
  function pad(i) {
    const gp = navigator.getGamepads && navigator.getGamepads()[i];
    if (!gp) return 0;
    const b = (n) => gp.buttons[n] && gp.buttons[n].pressed, ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    let v = 0;
    if (ax < -0.4 || b(14)) v |= IN.L; if (ax > 0.4 || b(15)) v |= IN.R;
    if (ay < -0.5 || b(12)) v |= IN.U; if (ay > 0.5 || b(13)) v |= IN.D;
    if (b(0) || b(3)) v |= IN.J; if (b(2)) v |= IN.A; if (b(1)) v |= IN.B;
    if (b(4) || b(5) || b(6) || b(7)) v |= IN.X;
    return v;
  }

  // ---------- bot (render-side input generator; local modes only) ----------
  function bot(s, i, level) {
    const me = s.p[i], foe = s.p[1 - i], m = STAGE.main;
    if (me.st === ST.DEAD || s.f < FEEL.countdown) return 0;
    // alternate press and release per bot from the sim frame: a shared counter bumped by two
    // bots each frame gave each one a constant parity, so one held jump forever and never jumped
    const even = (s.f + i) % 2 === 0, dx = foe.x - me.x, dy = foe.y - me.y;
    let v = 0;
    const offL = me.x < m.x1 + 10 * S, offR = me.x > m.x2 - 10 * S;
    const under = !me.ground && me.y > m.y; // below the stage top while airborne means off stage
    // edge-guard like the reference players: chase an opponent who is off stage, keeping one jump
    // in reserve for the way back, and hit them with aerials (a spike from above)
    const foeOff = foe.st !== ST.DEAD && (foe.x < m.x1 - 30 * S || foe.x > m.x2 + 30 * S || foe.y > m.y + 20 * S);
    const ledgeX = foe.x < (m.x1 + m.x2) / 2 ? m.x1 : m.x2;
    if (foeOff && me.jumps >= 1 && me.y < m.y + 30 * S && Math.abs(me.x - ledgeX) < 230 * S) {
      const near = Math.abs(dx) < 80 * S && Math.abs(dy) < 90 * S;
      v |= dx > 0 ? IN.R : IN.L;
      if (me.ground && even && Math.random() < 0.5) v |= IN.J;
      else if (!me.ground && me.jumps > 1 && dy < -40 * S && me.vy > -200 && even) v |= IN.J;
      if (near && even && Math.random() < 0.25 + 0.1 * level) v |= dy > 30 * S ? IN.D | IN.A : IN.A;
      return v;
    }
    if (((me.x < m.x1 - 4 * S || me.x > m.x2 + 4 * S) && !me.ground) || under || (!me.ground && me.y > m.y - 10 * S && (offL || offR))) {
      // under the island: steer out past the nearer ledge first, then back in once above it
      const cx = (m.x1 + m.x2) / 2, outside = me.x < m.x1 || me.x > m.x2;
      v |= under && !outside ? (me.x < cx ? IN.L : IN.R) : me.x < cx ? IN.R : IN.L;
      if (me.vy > -200 && even) v |= me.wall || me.jumps > 0 ? IN.J : me.recov ? 0 : IN.U | IN.B;
      return v;
    }
    if (foe.st === ST.DEAD) return Math.abs(me.x - 640 * S) > 60 * S ? (me.x < 640 * S ? IN.R : IN.L) : 0;
    // like the reference players: buffer a dodge as hitstun ends to slip out of a string
    if (me.st === ST.HIT && me.t <= 3 && me.launch < 1800 && even && Math.random() < 0.3 + 0.1 * level) return v | IN.X;
    const close = Math.abs(dx) < 95 * S && Math.abs(dy) < 90 * S;
    if (!close) v |= dx > 0 ? IN.R : IN.L;
    if (!close && me.ground && Math.abs(dx) > 220 * S && even && Math.random() < 0.05) v |= IN.X; // dash in
    // the reference fights in the air: hop in from mid range, chase a launched foe upward
    const chase = foe.st === ST.HIT && dy < -60 * S && Math.abs(dx) < 260 * S;
    if (even && (me.ground || me.jumps > 0)) {
      if (chase && Math.random() < 0.3) v |= IN.J;
      else if (me.ground && !close && Math.abs(dx) < 300 * S && Math.random() < 0.06) v |= IN.J;
      else if (dy < -110 * S && me.ground && Math.random() < 0.12) v |= IN.J;
    }
    if (foe.st === ST.ATK && close && even && Math.random() < 0.04 + 0.04 * level) return v | IN.X;
    if (close && even && Math.random() < 0.08 + 0.05 * level) {
      if (dx) v |= dx > 0 ? IN.R : IN.L;
      const r = Math.random();
      if (!me.ground) v |= dy > 40 * S ? IN.D | IN.A : r < 0.4 ? IN.A : foe.dmg > 110 && r < 0.6 ? IN.B : IN.A;
      else if (dy < -50 * S) v |= IN.U | IN.A;
      else if (foe.dmg > 90 && r < 0.5) v |= IN.B;
      else v |= r < 0.15 ? IN.D | IN.A : IN.A;
      if (r > 0.6) v &= ~(IN.L | IN.R);
    }
    return v;
  }

  // ---------- assets ----------
  const stageArt = {};
  async function loadStage() {
    const load = (n) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = `${ROOT}/assets/stages/dune-island/${n}`; });
    const [bg, island, plat] = await Promise.all([load("background.jpg"), load("island.webp"), load("platform.webp")]);
    // Value plan: the background is the quietest layer (hazy, soft, desaturated), the stage is
    // calmer than the fighters except for its bright walkable top edge, and the fighters carry
    // the most saturation and the darkest outlines.
    stageArt.bg = bg && grade(bg, "saturate(0.75) brightness(1.12) contrast(0.95) blur(1.5px)", null, true);
    stageArt.island = island && shade(edgeLit(island, "saturate(0.9) brightness(0.42) contrast(1.15)", 0.05));
    stageArt.plat = plat && edgeLit(plat, "saturate(0.85) brightness(0.45) contrast(1.1)", 0.2);
  }
  function grade(im, filter, haze, sky) {
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const x = c.getContext("2d"); x.filter = filter; x.drawImage(im, 0, 0); x.filter = "none";
    if (haze) { x.fillStyle = haze; x.fillRect(0, 0, c.width, c.height); }
    if (sky) {
      // high-key sky like the reference: a pale warm haze lifts the area the fighters jump
      // through, so their darker, saturated colors read against it
      const v = x.createLinearGradient(0, 0, 0, c.height);
      v.addColorStop(0, "rgba(255,240,222,0.24)"); v.addColorStop(0.5, "rgba(255,232,206,0.12)");
      v.addColorStop(0.8, "rgba(255,200,150,0.08)"); v.addColorStop(1, "rgba(60,30,40,0.2)");
      x.fillStyle = v; x.fillRect(0, 0, c.width, c.height);
    }
    return c;
  }
  function shade(c) {
    // the island body falls into shadow toward its point, so the top edge leads the eye
    const x = c.getContext("2d"), v = x.createLinearGradient(0, 0, 0, c.height);
    v.addColorStop(0, "rgba(20,10,34,0)"); v.addColorStop(0.18, "rgba(20,10,34,0.1)"); v.addColorStop(1, "rgba(20,10,34,0.72)");
    x.globalCompositeOperation = "source-atop"; x.fillStyle = v; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = "source-over";
    return c;
  }
  function edgeLit(im, filter, band) {
    const c = grade(im, filter), x = c.getContext("2d"), h = Math.round(im.height * band);
    x.drawImage(im, 0, 0, im.width, h, 0, 0, im.width, h); // keep the walkable top at full brightness
    return c;
  }

  // ---------- match ----------
  let mode = "menu", pick = [params.get("p1") || "djinn-warrior", params.get("p2") || "dune-ghoul"];
  let M = null, st = null, defs = [], gfx = [], showBoxes = false;
  const loading = { done: 0, total: 0, t: 0, tip: 0 };
  const cardArt = {};
  const img = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
  async function load() {
    loading.done = 0; loading.total = 0; loading.t = 0; loading.tip = Math.floor(Math.random() * TIPS.length);
    // the versus cards first (one small image each), so the loading screen has its art at once
    await Promise.all(pick.map(async (id) => { if (!cardArt[id]) cardArt[id] = await img(`${ROOT}/assets/fighters/${id}/${FIGHTERS[id].basePose || "source/base-pose.png"}`); }));
    defs = await Promise.all(pick.map(async (id) => (await fetch(`${ROOT}/assets/fighters/${id}/moves.draft.json`)).json()));
    const progress = { onCount: (n) => (loading.total += n), onSheet: () => loading.done++ };
    gfx = await Promise.all(pick.map((id, i) => Render.loadFighter(id, ROOT, { art: FIGHTERS[id].art, height: (defs[i].stats || {}).height, basePose: FIGHTERS[id].basePose, victoryHold: FIGHTERS[id].victoryHold, remap: FIGHTERS[id].remap, ...progress })));
    await Promise.all(pick.map((id) => new Promise((ok) => { const im = new Image(); im.onload = () => { portraits[id] = im; ok(); }; im.onerror = ok; im.src = portraitSrc(id); })));
    M = Sim.match(defs[0], defs[1]); st = M.create(); fx.reset(); Object.assign(cam, { x: 640, y: 330, z: 0.9 });
  }
  // the versus screen stays up for at least 1.6 s so the cards register, as in the reference
  const holdCards = (t0) => new Promise((ok) => setTimeout(ok, Math.max(0, 1600 - (performance.now() - t0))));
  async function startMatch(m) { const t0 = performance.now(); mode = "loading"; hideMenu(); await load(); await holdCards(t0); mode = m; }
  function rebuild() { if (defs.length) { M = Sim.match(defs[0], defs[1]); } }

  // ---------- effects (render only, driven by sim events) ----------
  // Painted effect sprites (assets/vfx) do the heavy lifting; a few embers add motion.
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const vfx = {};
  ["star1", "star2", "star3", "puff1", "puff2", "puff3", "puff4",
   "smear1", "smear2", "smear3", "kick1", "kick2", "kick3", "ko-splash", "ko-cloud"].forEach((n) => { const im = new Image(); im.onload = () => (vfx[n] = im); im.src = `${ROOT}/assets/vfx/${n}.webp`; });
  const fx = {
    sprites: [], parts: [], shake: 0, lastHf: -1, lastKf: -1, koStamp: [0, 0],
    grounded: [1, 1], wasSt: [0, 0], lastVy: [0, 0], after: [[], []],
    bats: [], petals: [], marks: [], banner: null, won: 0, stats: [], lastDmg: [0, 0], hitOn: [-1e9, -1e9],
    reset() {
      Object.assign(this, { sprites: [], parts: [], shake: 0, lastHf: -1, lastKf: -1, koStamp: [0, 0], bats: [], petals: [], marks: [], banner: null, won: 0, koHold: 0,
        stats: [0, 1].map(() => ({ kos: 0, falls: 0, acc: 0, done: 0, taken: 0 })), lastDmg: [0, 0], hitOn: [-1e9, -1e9] });
    },
    // a painted sprite: grows from s0 to s1 in `pop` frames, holds, then fades over the rest of `life` frames
    add(name, x, y, opt) { this.sprites.push({ name, x, y, t: 0, rot: 0, flip: 1, s0: 0.6, s1: 1, pop: 3, life: 18, w: 80, ax: 0.5, ay: 0.5, alpha: 1, ...opt }); },
    // flat white cel effects, as in the reference: puffs stay where they were made
    puff(x, y, w, opt) { this.add(`puff${1 + Math.floor(rnd() * 4)}`, x, y, { w, rot: (rnd() - 0.5) * 0.6, s0: 0.7, s1: 1.15, pop: 6, life: 30, ...opt }); },
    kick(x, y, w, flip) { this.add(`kick${1 + Math.floor(rnd() * 3)}`, x, y, { w, ay: 0.95, flip, s0: 0.6, s1: 1, pop: 3, life: 16 }); },
  };
  // sounds (game/audio.js), panned by where they happen on screen
  const sfx = (name, x, o) => { if (window.Sfx && mode !== "loading") Sfx.play(name, Math.max(-1, Math.min(1, (x - cam.x) / 640)), { fighter: o && o.who !== undefined ? pick[o.who] : null, ...o }); };
  // ---------- per-fighter flair (game/flair.js) ----------
  const style = (i) => Flair.STYLES[pick[i]] || {};
  const flairApi = {
    S, ST, rnd: () => rnd(),
    body: (i) => (gfx[i] ? gfx[i].h : 64),
    move: (i, mv) => M.mv[i][mv],
    bat(x, y, a, size, speed) { const v = speed * (2.5 + rnd() * 3); fx.bats.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, size, ph: rnd() * 6.28, life: 1 }); },
    petal(x, y, dir, power) {
      const a = (dir > 0 ? 0 : Math.PI) + (rnd() - 0.5) * 1.5, v = (1.5 + rnd() * 3.5) * power;
      fx.petals.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.2, rot: rnd() * 6.28, vr: (rnd() - 0.5) * 0.3, size: 2 + rnd() * 1.6 * Math.min(1.6, power), c: Flair.ROSE[Math.floor(rnd() * 4)], life: 1, fall: 1 });
    },
    petalIn(x, y) { const a = rnd() * 6.28; fx.petals.push({ x: x + Math.cos(a) * 28, y: y + Math.sin(a) * 28, vx: -Math.cos(a) * 1.7, vy: -Math.sin(a) * 1.7, rot: a, vr: 0.25, size: 2.2, c: Flair.ROSE[Math.floor(rnd() * 4)], life: 0.45, fall: 0 }); },
    petalRain(x, y) { fx.petals.push({ x: x + (rnd() - 0.5) * 320, y: y - 120 - rnd() * 220, vx: (rnd() - 0.5) * 0.6, vy: 0.5 + rnd() * 0.6, rot: rnd() * 6.28, vr: (rnd() - 0.5) * 0.12, size: 2.5 + rnd() * 2, c: Flair.ROSE[Math.floor(rnd() * 4)], life: 3, fall: 0.2 }); },
    mark(m) { fx.marks.push({ t: 0, ...m }); },
  };
  // a fighter's swing crescents in their own colour (the reference tints smears by weapon)
  const tinted = {};
  function tintedVfx(name, color) {
    const key = name + color, im = vfx[name];
    if (tinted[key] || !im) return tinted[key] || null;
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const x = c.getContext("2d"); x.drawImage(im, 0, 0);
    x.globalCompositeOperation = "source-atop"; x.globalAlpha = 0.78; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return (tinted[key] = c);
  }
  function events(s) {
    // countdown and match end cues
    const cd = FEEL.countdown - s.f;
    if (cd === 125 || cd === 84 || cd === 42) sfx("count", cam.x); // the first event runs one frame in
    if (cd === 0) sfx("go", cam.x);
    if (s.over && s.overT === 1) sfx("game", cam.x);
    if (s.hf !== fx.lastHf && s.hf >= 0) {
      fx.lastHf = s.hf;
      const x = s.hx / S, y = s.hy / S, k = s.hk / 100, heavy = k > 18;
      if (s.ha === 2) { // parry: a bright ring and a hard shake, no damage spark
        fx.add("star2", x, y, { w: 70, rot: rnd() * 6.28, s0: 0.3, s1: 1.4, pop: 3, life: 14 });
        fx.shake = Math.max(fx.shake, 6);
        if (style(1 - s.hp).parried) style(1 - s.hp).parried(flairApi, 1 - s.hp, x, y);
        sfx("parry", x);
      } else {
        fx.hitOn[1 - s.hp] = s.f;
        if (style(s.hp).hit) style(s.hp).hit(flairApi, s.hp, x, y, s.p[s.hp].face, heavy, s.p[s.hp].mv);
        sfx(heavy ? "hitHeavy" : "hit", x, { k, who: s.hp, mv: s.p[s.hp].mv });
        const atk = s.p[s.hp], dir = atk ? atk.face : 1, body = gfx[1 - s.hp] ? gfx[1 - s.hp].h : 64;
        fx.shake = Math.max(fx.shake, heavy ? 6 : 3); // the reference camera barely moves: 0.05 to 0.1 bodies
        // a small flat white starburst at the contact point; colour comes from the victim flash
        fx.add(`star${1 + Math.floor(rnd() * 3)}`, x, y, { w: body * (heavy ? 0.62 : 0.45), rot: rnd() * 6.28, s0: 1, s1: 0.7, pop: 1, life: heavy ? 10 : 7 });
        for (let j = 0; j < 3; j++) {
          const a = (dir > 0 ? 0 : Math.PI) + (rnd() - 0.5) * 1.6, sp = 2 + rnd() * 3;
          fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 0.4, size: 1.5 + rnd(), c: "#ffffff", g: 0.1 });
        }
      }
    }
    if (s.kf !== fx.lastKf && s.kf >= 0) {
      fx.lastKf = s.kf; fx.shake = 8; fx.koStamp[s.kp] = 70; fx.koHold = 70;
      // stats for the results screen: a fall within 5 s of being hit is the hitter's KO, else an accident
      const killer = s.f - fx.hitOn[s.kp] < 300 ? 1 - s.kp : -1;
      fx.stats[s.kp].falls++; if (killer >= 0) fx.stats[killer].kos++; else fx.stats[s.kp].acc++;
      fx.banner = { killer, victim: s.kp, t: 0 };
      sfx("ko", s.kx / S, { scorer: killer >= 0 ? pick[killer] : null });
      // the reference KOs at the screen edge: a white ink splash and a cloud bank burst inward
      // from where the fighter left the view, with speed lines in the attacker's team colour
      const z = Math.min(W / 1280, H / 720) * cam.z, hw = W / 2 / z, hh = H / 2 / z;
      const kx = s.kx / S, ky = s.ky / S, ang = Math.atan2(cam.y - ky, cam.x - kx);
      const t = Math.min(hw / Math.max(1e-6, Math.abs(Math.cos(ang))), hh / Math.max(1e-6, Math.abs(Math.sin(ang))));
      const x = cam.x - Math.cos(ang) * t, y = cam.y - Math.sin(ang) * t, scr = (H / z);
      fx.add("ko-cloud", x, y, { w: scr * 0.55, ax: 0, ay: 0.5, rot: ang, s0: 0.4, s1: 1.05, pop: 10, life: 70 });
      fx.add("ko-splash", x, y, { w: scr * 0.6, ax: 0, ay: 0.5, rot: ang, s0: 0.5, s1: 1.1, pop: 4, life: 34 });
      const team = style(1 - s.kp).ko || TEAM[1 - s.kp];
      if (style(1 - s.kp).scoredKO) style(1 - s.kp).scoredKO(flairApi, 1 - s.kp, x, y, ang, scr);
      for (let j = 0; j < 18; j++) {
        const a = ang + (rnd() - 0.5) * 1.2, sp = 10 + rnd() * 16;
        fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.8 + rnd() * 0.4, size: 2 + rnd() * 3, c: rnd() < 0.6 ? team : "#ffffff", g: 0 });
      }
    }
    s.p.forEach((p, i) => { // damage dealt and taken, for the results screen
      const d = p.dmg - fx.lastDmg[i];
      if (d > 0) { fx.stats[i].taken += d; fx.stats[1 - i].done += d; }
      fx.lastDmg[i] = p.dmg;
    });
    if (s.over && !fx.won) { fx.won = 1; const w = s.p[s.over - 1]; if (style(s.over - 1).won) style(s.over - 1).won(flairApi, s.over - 1, w.x / S, w.y / S); }
    s.p.forEach((p, i) => {
      if (p.st === ST.DEAD) return;
      if (style(i).frame) style(i).frame(flairApi, i, p, s);
      const x = p.x / S, y = p.y / S;
      const body = gfx[i] ? gfx[i].h : 64;
      if (p.ground && !fx.grounded[i]) {
        fx.puff(x - body * 0.3, y - 6, body * 0.35); fx.puff(x + body * 0.3, y - 6, body * 0.35);
        if ((p.st === ST.ATK || fx.wasSt[i] === ST.ATK) && style(i).land) style(i).land(flairApi, i, x, y, p.mv);
        sfx("land", x);
      }
      if (!p.ground && fx.grounded[i] && p.vy < 0) { fx.kick(x, y, body * 0.6, -p.face); sfx("jump", x); }
      if (!p.ground && !fx.grounded[i] && p.vy < -1000 && fx.lastVy[i] >= -1000 && p.st === ST.IDLE) { fx.puff(x, y + 4, body * 0.5, { s0: 0.4, s1: 1.3, life: 22 }); sfx("airJump", x); } // air jump ring
      fx.lastVy[i] = p.vy;
      if (p.st === ST.DODGE || p.st === ST.DASH) { if (s.f % 2 === 0) { fx.after[i].unshift({ x: p.x, y: p.y }); fx.after[i].length = Math.min(fx.after[i].length, 4); } }
      else fx.after[i].length = 0;
      fx.grounded[i] = p.ground;
      if ((p.st === ST.DODGE || p.st === ST.DASH) && fx.wasSt[i] !== p.st) {
        const back = p.vx ? -Math.sign(p.vx) : -p.face;
        if (p.ground) fx.kick(x, y, body * 0.7, back); else fx.puff(x, y - body / 2, body * 0.5, { s0: 0.5, s1: 1.3, life: 18 });
        if (style(i).dodge) style(i).dodge(flairApi, i, x, y, back);
        sfx(p.st === ST.DASH ? "dash" : "dodge", x, { who: i });
      }
      // the reference's signature: a launched fighter leaves a thick continuous cloud column
      // behind it, drawn under the fighters, gone after about 50 frames
      const sp = Math.hypot(p.vx, p.vy);
      if (p.st === ST.HIT && p.launch > 1800 && sp > 600) {
        const w = body * (0.42 + Math.min(0.3, p.launch / 12000));
        fx.puff(x - (p.vx / S) * 0.3, y - body / 2 - (p.vy / S) * 0.3, w, { s0: 0.9, s1: 1.25, pop: 8, life: 50, under: 1 });
      }
      if (p.st === ST.ATK && p.t === M.mv[i][p.mv].su && p.mv <= 4) { // a white swing crescent on every light, hit or miss
        const b = M.box(p, M.mv[i][p.mv]).map((v) => v / S);
        const sm = `smear${1 + Math.floor(rnd() * 3)}`;
        sfx("swing", x, { who: i, mv: p.mv });
        fx.add(sm, (b[0] + b[1]) / 2, (b[2] + b[3]) / 2, { w: Math.max(18, (b[1] - b[0]) * 0.55), flip: -p.face, rot: (rnd() - 0.5) * 0.4, s0: 0.85, s1: 1, pop: 1, life: 7, alpha: 0.9, im: style(i).smear && tintedVfx(sm, style(i).smear) });
      }
      if (p.st === ST.ATK && p.t === M.mv[i][p.mv].su && p.mv > 4 && p.mv !== 9) sfx("swingHeavy", x, { who: i, mv: p.mv });
      fx.wasSt[i] = p.st;
    });
  }
  function stepFx() {
    for (const q of fx.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.vx *= 0.93; q.life -= 0.035; }
    fx.parts = fx.parts.filter((q) => q.life > 0);
    for (const e of fx.sprites) e.t++;
    fx.sprites = fx.sprites.filter((e) => e.t < e.life);
    for (const b of fx.bats) { b.x += b.vx; b.y += b.vy; b.vx *= 0.96; b.vy = b.vy * 0.96 - 0.05 + Math.sin(b.ph * 0.5) * 0.12; b.ph += 0.85; b.life -= 0.022; }
    fx.bats = fx.bats.filter((b) => b.life > 0);
    for (const q of fx.petals) { q.x += q.vx + Math.sin(q.rot * 2) * 0.35 * q.fall; q.y += q.vy; q.vx *= 0.95; q.vy = Math.min(1.4, q.vy * 0.96 + 0.07 * q.fall); q.rot += q.vr; q.life -= 0.018; }
    fx.petals = fx.petals.filter((q) => q.life > 0);
    for (const m of fx.marks) m.t++;
    fx.marks = fx.marks.filter((m) => m.t < m.life);
    if (fx.banner) fx.banner.t++;
    if (fx.koHold > 0) fx.koHold--;
    fx.shake *= 0.7;
    fx.koStamp = fx.koStamp.map((t) => Math.max(0, t - 1));
  }

  // ---------- camera ----------
  const cam = { x: 640, y: 380, z: 1 };
  function updateCam(s) {
    // frame the fighters, not the stage, like the reference broadcast camera: a tight window
    // (max zoom puts the silhouette at about 12 percent of screen height, as in the reference)
    // around the pair (never narrower than about 10 bodies) that follows them off the ledge and
    // up into the air, with only a light pull toward stage center
    if (s.f < FEEL.countdown) { cam.x += (640 - cam.x) * 0.2; cam.y += (330 - cam.y) * 0.2; cam.z += (0.9 - cam.z) * 0.2; return; } // the countdown shows the whole stage
    const live = s.over ? [s.p[s.over - 1]] : s.p.filter((p) => p.st !== ST.DEAD);
    if (!live.length) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of live) { const x = p.x / S, y = p.y / S; x0 = Math.min(x0, x - 110); x1 = Math.max(x1, x + 110); y0 = Math.min(y0, y - 150); y1 = Math.max(y1, y + 70); }
    // match over: push in on the winner so the victory animation reads
    const w = Math.max(s.over ? 420 : 640, x1 - x0), h = Math.max(s.over ? 240 : 340, y1 - y0);
    const z = Math.max(0.62, Math.min(s.over ? 1.7 : 1.28, Math.min(1280 / (w + 160), 720 / (h + 120))));
    const tx = ((x0 + x1) / 2) * 0.85 + 640 * 0.15, ty = ((y0 + y1) / 2) * 0.8 + 400 * 0.2;
    const ease = fx.koHold > 0 ? 0.012 : 1; // after a KO the camera holds still while the splash plays at the edge
    cam.x += (tx - cam.x) * 0.12 * ease; cam.y += (ty - cam.y) * 0.12 * ease; cam.z += (z - cam.z) * 0.09 * ease;
  }

  // ---------- drawing ----------
  function drawBackground() {
    const sc = Math.min(W / 1280, H / 720);
    if (stageArt.bg) {
      const im = stageArt.bg, k = Math.max(W / im.width, H / im.height) * 1.15;
      const px = (cam.x - 640) * 0.08 * sc, py = (cam.y - 380) * 0.05 * sc;
      g.drawImage(im, (W - im.width * k) / 2 - px, (H - im.height * k) / 2 - py, im.width * k, im.height * k);
    } else {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "#1b1036"); gr.addColorStop(0.55, "#4a2552"); gr.addColorStop(0.85, "#c2573b"); gr.addColorStop(1, "#f2a35e");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    // warm sunset glow low on the horizon, offset from the play area
    const glow = g.createRadialGradient(W * 0.78, H * 0.78, 10, W * 0.78, H * 0.78, W * 0.55);
    glow.addColorStop(0, "rgba(255,170,90,0.42)"); glow.addColorStop(0.4, "rgba(255,120,70,0.14)"); glow.addColorStop(1, "rgba(255,120,70,0)");
    g.fillStyle = glow; g.fillRect(0, 0, W, H);
    // drifting sand haze, far layer
    const t = performance.now() / 1000;
    g.save(); g.globalAlpha = 0.18;
    for (let k = 0; k < 3; k++) {
      const yy = H * (0.58 + k * 0.12), off = ((t * (12 + k * 8)) % (W * 2)) - W;
      const gr = g.createLinearGradient(0, yy - 60, 0, yy + 60);
      gr.addColorStop(0, "rgba(233,194,123,0)"); gr.addColorStop(0.5, "rgba(233,194,123,0.55)"); gr.addColorStop(1, "rgba(233,194,123,0)");
      g.fillStyle = gr; g.fillRect(off, yy - 60, W * 2, 120);
    }
    g.restore();
  }
  // foreground: sand motes in front of everything, and a vignette that frames the fight
  const motes = Array.from({ length: 70 }, (_, k) => ({ x: (k * 977) % 1600, y: (k * 571) % 900, r: 0.6 + (k % 4) * 0.5, s: 0.4 + (k % 5) * 0.25 }));
  function drawAtmosphere() {
    const t = performance.now() / 16.7;
    g.save();
    for (const m of motes) {
      const x = ((m.x + t * m.s * 1.6) % 1600) / 1600 * W, y = ((m.y + Math.sin(t / 40 + m.x) * 12) % 900) / 900 * H;
      g.globalAlpha = 0.25 + 0.2 * Math.sin(t / 30 + m.y); g.fillStyle = "#f3d9a4";
      g.beginPath(); g.arc(x, y, m.r * dpr * 0.8, 0, 7); g.fill();
    }
    g.restore();
    const v = g.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(10,4,20,0)"); v.addColorStop(1, "rgba(10,4,20,0.22)");
    g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  function drawStage() {
    const m = STAGE.main, x1 = m.x1 / S, x2 = m.x2 / S, y = m.y / S;
    if (stageArt.island) {
      const im = stageArt.island, w = (x2 - x1) * 1.06, h = (im.height / im.width) * w;
      g.drawImage(im, x1 - (w - (x2 - x1)) / 2, y - h * 0.035, w, h);
    } else {
      g.fillStyle = "#7b4a3a"; g.fillRect(x1, y, x2 - x1, m.keel / S);
    }
    g.fillStyle = "rgba(255,226,170,0.9)"; g.fillRect(x1 + 6, y - 1, x2 - x1 - 12, 2); // brightest line: the stage edge
    for (const pl of STAGE.plats) {
      const a = pl.x1 / S, b = pl.x2 / S, py = pl.y / S;
      if (stageArt.plat) { const im = stageArt.plat, w = (b - a) * 1.08, h = (im.height / im.width) * w; g.drawImage(im, a - (w - (b - a)) / 2, py - h * 0.2, w, h); }
      else { g.fillStyle = "#c98a5b"; g.fillRect(a, py - 2, b - a, 12); }
      g.fillStyle = "rgba(255,226,170,0.75)"; g.fillRect(a + 6, py - 1, b - a - 12, 2);
    }
  }
  const tintBuf = document.createElement("canvas"), tg = tintBuf.getContext("2d");
  function drawSprite(i, p, f, alpha, tint, halo, tintColor = "#fff") {
    const win = st && st.over === i + 1 && st.overT > 20 ? st.overT - 20 : -1;
    const F = gfx[i], ps = Render.pose(F, p, f, M.mv[i], Sim, win);
    const x = p.x / S, y = p.y / S;
    if (!ps) return;
    const { sh, k, rot } = ps, sc = sh.scale;
    const screenBody = F.h * cam.z * Math.min(W / 1280, H / 720) * dpr;
    const { im, f: div } = Render.mip(sh, screenBody), cell = sh.size / div;
    let src = im, sx = k * cell;
    if (tint) { // flash a white overlay on the sprite only, through a small buffer
      tintBuf.width = cell; tintBuf.height = cell;
      tg.drawImage(im, sx, 0, cell, cell, 0, 0, cell, cell);
      tg.globalCompositeOperation = "source-atop"; tg.globalAlpha = tint; tg.fillStyle = tintColor; tg.fillRect(0, 0, cell, cell);
      tg.globalCompositeOperation = "source-over"; tg.globalAlpha = 1;
      src = tintBuf; sx = 0;
    }
    g.save(); g.globalAlpha = alpha; g.translate(Math.round(x), Math.round(y)); g.scale(p.face, 1);
    if (rot) { g.translate(0, -F.h / 2); g.rotate(rot); g.translate(0, F.h / 2); } // remapped sheet, turned about the body centre
    if (p.st === ST.HIT && p.launch > 2600 && !F.sheets.tumble) { g.translate(0, -F.h / 2); g.rotate((f % 24) / 24 * Math.PI * 2 * -1); g.translate(0, F.h / 2); }
    if (halo) { g.shadowColor = halo; g.shadowBlur = 3 * dpr; }
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(src, sx, 0, cell, cell, -sh.pivot[0] * sc, (-sh.pivot[1] + sh.dy[k]) * sc, sh.size * sc, sh.size * sc);
    g.restore();
  }
  function drawFighter(s, i) {
    const p = s.p[i];
    if (p.st === ST.DEAD) return;
    const x = p.x / S, y = p.y / S, m = M.mv[i][p.mv];
    if (s.f < FEEL.countdown - FEEL.spawnRelease + 4) { // spawn pad glowing under the hanging fighter
      g.save(); g.globalAlpha = 0.85; g.fillStyle = TEAM[i]; g.shadowColor = TEAM[i]; g.shadowBlur = 14;
      g.beginPath(); g.ellipse(x, y + 2, 26, 6, 0, 0, 7); g.fill(); g.restore();
    }
    if (p.ground) { g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(x, y + 1, 20, 4.5, 0, 0, 7); g.fill(); }
    if (p.ground) { g.strokeStyle = TEAM[i]; g.lineWidth = 2.5; g.globalAlpha = 0.9; g.beginPath(); g.ellipse(x, y + 1, 17, 4, 0, 0, 7); g.stroke(); g.globalAlpha = 1; }
    if (p.hang > 0) { // respawn pad, like the opening
      g.save(); g.globalAlpha = 0.85; g.fillStyle = TEAM[i]; g.shadowColor = TEAM[i]; g.shadowBlur = 14;
      g.beginPath(); g.ellipse(x, y + 2, 26, 6, 0, 0, 7); g.fill(); g.restore();
    }
    let tint = 0, tintColor = "#fff";
    if (p.st === ST.ATK && m.su - p.t > 0 && m.su - p.t <= 2 && m.su >= 8) tint = 0.55; // heavy startup flash
    // the reference's strongest cue: a struck fighter flashes as a flat silhouette in their own
    // damage colour, through the hit pause and the start of a launch
    const age = s.f - s.hf, launched = p.launch > 1800;
    if (p.st === ST.HIT && s.hp === 1 - i && s.ha === 0 && age < (launched ? 24 : 9)) { tint = age < (launched ? 18 : 6) ? 1 : 0.55; tintColor = dmgColor(Math.max(45, p.dmg)); } // never white: yellow from the first hit
    if (p.st === ST.HIT && launched && age < 16 && (p.vx || p.vy)) { // launch smear: two copies trail back along the flight line
      const v = Math.hypot(p.vx, p.vy), ux = p.vx / v, uy = p.vy / v, len = Math.min(1.4, p.launch / 3000) * gfx[i].h;
      for (const [k, al] of [[0.6, 0.45], [1, 0.22]]) drawSprite(i, { ...p, x: p.x - ux * len * k * S, y: p.y - uy * len * k * S }, s.f, al, 1, null, dmgColor(Math.max(45, p.dmg)));
    }
    if (p.st === ST.ATK && m.su >= 8 && p.t >= m.su && p.t < m.su + m.ac + 2) // heavy attacker: white streak behind the strike
      drawSprite(i, { ...p, x: p.x - p.face * 14 * S }, s.f, 0.4, 1, null, "#fff");
    if (p.st === ST.ATK && p.chg > 0 && p.t === m.su - 1) tint = 0.25 + 0.25 * Math.sin(s.f * 0.8); // a held heavy pulses while it charges
    if (s.ha === 1 && s.hp === 1 - i && s.f - s.hf < 6) tint = 0.45;                         // armor took the hit
    const blink = p.inv > 0 && Math.floor(s.f / 6) % 2 === 0;
    const jitter = p.st === ST.HIT && s.freeze > 0 ? (rnd() - 0.5) * 4 : 0;
    g.save(); g.translate(jitter, 0);
    const evading = p.st === ST.DODGE || p.st === ST.DASH;
    if (evading) { // afterimages trail behind a dodge or dash so it reads as movement, not a fade
      const trail = fx.after[i];
      for (let k = trail.length - 1; k >= 0; k--) drawSprite(i, { ...p, x: trail[k].x, y: trail[k].y }, s.f, 0.32 - k * 0.07, 1, null, style(i).after || TEAM[i]);
      if (p.st === ST.DODGE && !tint) { tint = 0.18 + 0.14 * Math.sin(s.f * 1.3); tintColor = "#ffffff"; } // invulnerable shimmer
    }
    drawSprite(i, p, s.f, blink ? 0.55 : 1, tint, "rgba(8,3,18,0.7)", tintColor);
    g.restore();
    if (showBoxes) {
      g.strokeStyle = "rgba(80,200,255,.9)"; g.lineWidth = 1;
      g.strokeRect(x - M.ph[i].hw / S, y - M.ph[i].h / S, (M.ph[i].hw * 2) / S, M.ph[i].h / S);
      if (p.st === ST.ATK && p.t >= m.su && p.t < m.su + m.ac) {
        const b = M.box(p, m).map((v) => v / S);
        g.fillStyle = "rgba(255,60,60,.35)"; g.fillRect(b[0], b[2], b[1] - b[0], b[3] - b[2]);
      }
    }
    const label = mode === "bot" ? (i === 0 ? "YOU" : "BOT") : mode === "demo" ? FIGHTERS[pick[i]].name.toUpperCase() : "P" + (i + 1);
    g.textAlign = "center"; g.fillStyle = TEAM[i]; g.strokeStyle = "#140b1f"; g.lineWidth = 3;
    const top = y - gfx[i].h - 16;
    g.beginPath(); g.moveTo(x - 5, top); g.lineTo(x + 5, top); g.lineTo(x, top + 6); g.closePath(); g.stroke(); g.fill();
  }
  function drawFx(under) {
    for (const e of fx.sprites) {
      if (!e.under !== !under) continue;
      const im = e.im || vfx[e.name];
      if (!im) continue;
      const k = e.t < e.pop ? e.t / e.pop : 1, sc = e.s0 + (e.s1 - e.s0) * (1 - (1 - k) * (1 - k));
      const fade = e.t < e.pop ? 1 : 1 - (e.t - e.pop) / Math.max(1, e.life - e.pop);
      const w = e.w * sc, h = (im.height / im.width) * w;
      g.save(); g.translate(e.x, e.y); g.rotate(e.rot); g.scale(e.flip, 1);
      g.globalAlpha = e.alpha * Math.min(1, fade * 1.4);
      g.drawImage(im, -w * e.ax, -h * e.ay, w, h);
      g.restore();
    }
    g.globalAlpha = 1;
    if (under) return;
    for (const q of fx.parts) { g.globalAlpha = Math.min(1, q.life * 1.5); g.fillStyle = q.c; g.beginPath(); g.arc(q.x, q.y, q.size * 0.7, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    drawMarks();
    for (const q of fx.petals) { g.globalAlpha = Math.min(1, q.life * 2); Flair.petal(g, q.x, q.y, q.size, q.rot, q.c, "rgba(190,60,110,0.45)"); }
    for (const b of fx.bats) { g.globalAlpha = Math.min(1, b.life * 2.2); Flair.bat(g, b.x, b.y, b.size, b.ph, Math.atan2(b.vy, Math.abs(b.vx) + 0.01) * 0.35, "#1a0a14", "#ff3d64"); }
    g.globalAlpha = 1;
  }
  // marks: pierce glints, rings, the parry canopy and ward, KO crests
  function drawMarks() {
    for (const m of fx.marks) {
      const k = m.t / m.life, fade = 1 - k;
      g.save();
      if (m.kind === "pierce") { // a long thin glint straight through the target
        const L = m.len * 64 * (0.6 + 0.4 * Math.min(1, m.t / 3));
        g.translate(m.x, m.y); g.scale(m.dir, 1); g.globalAlpha = fade;
        g.fillStyle = "#ff8fb1"; g.beginPath(); g.moveTo(-L * 0.35, 0); g.lineTo(L * 0.1, -2.6 * fade - 0.5); g.lineTo(L * 0.65, 0); g.lineTo(L * 0.1, 2.6 * fade + 0.5); g.closePath(); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-L * 0.32, 0); g.lineTo(L * 0.1, -1.3); g.lineTo(L * 0.62, 0); g.lineTo(L * 0.1, 1.3); g.closePath(); g.fill();
      } else if (m.kind === "ring") {
        const r = (m.r0 + (m.r1 - m.r0) * (1 - (1 - k) * (1 - k))) * 64 * 0.5;
        g.translate(m.x, m.y); g.scale(1, m.flat ? 0.28 : 1); g.globalAlpha = fade;
        g.lineWidth = 7 * fade + 1; g.strokeStyle = "#14060f"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
        g.lineWidth = 4 * fade + 0.5; g.strokeStyle = m.color; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
      } else if (m.kind === "crest") { // pops in over the KO cloud, holds, rises and fades
        const pop = m.t < 7 ? 0.4 + (m.t / 7) * 0.75 : m.t < 12 ? 1.15 - (m.t - 7) * 0.03 : 1;
        Flair.crest(g, m.x, m.y - Math.max(0, m.t - 40) * 0.5, m.size * pop, m.t > m.life - 30 ? (m.life - m.t) / 30 : 1);
      } else if ((m.kind === "ward" || m.kind === "canopy") && st) {
        const p = st.p[m.i], body = gfx[m.i] ? gfx[m.i].h : 64, x = p.x / S + p.face * body * 0.32, y = p.y / S - body * 0.5;
        g.translate(x, y); g.scale(p.face, 1);
        if (m.kind === "ward") {
          g.globalAlpha = 0.55 + 0.3 * Math.sin(st.f * 1.5); g.lineCap = "round";
          g.lineWidth = 5; g.strokeStyle = "#14060f"; g.beginPath(); g.arc(-body * 0.1, 0, body * 0.5, -1.1, 1.1); g.stroke();
          g.lineWidth = 3; g.strokeStyle = "#ff3d64"; g.beginPath(); g.arc(-body * 0.1, 0, body * 0.5, -1.1, 1.1); g.stroke();
        } else Flair.canopy(g, -body * 0.08, 0, body * (0.45 + 0.2 * Math.min(1, m.t / 4)), Math.min(1, fade * 1.6), "#ff3d64");
      }
      g.restore();
    }
  }
  // ---------- HUD: matches the reference layout ----------
  // Top-right corner only: an italic match timer, then one round portrait per fighter. Damage is a
  // colored arc around the portrait (white, yellow, orange, red, dark red), stocks a single digit.
  const portraits = {};
  const DMG_STOPS = [[0, [255, 255, 255]], [45, [255, 244, 140]], [70, [247, 232, 40]], [105, [255, 140, 26]], [150, [236, 40, 26]], [220, [140, 10, 20]]];
  function dmgColor(d) {
    for (let k = 1; k < DMG_STOPS.length; k++) {
      const [d1, c1] = DMG_STOPS[k], [d0, c0] = DMG_STOPS[k - 1];
      if (d <= d1) { const t = (d - d0) / (d1 - d0); return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * t)).join(",")})`; }
    }
    return "rgb(140,10,20)";
  }
  function italic(text, x, y, size, fill, align) {
    g.font = `italic 900 ${size}px "Arial Black", "Segoe UI Black", system-ui, sans-serif`;
    g.textAlign = align || "left"; g.textBaseline = "alphabetic"; g.lineJoin = "round";
    g.lineWidth = Math.max(3, size * 0.22); g.strokeStyle = "#0b0a1a"; g.strokeText(text, x, y);
    g.fillStyle = fill; g.fillText(text, x, y);
  }
  function portrait(i, p, cx, cy, r, s) {
    const im = portraits[pick[i]], dead = p.st === ST.DEAD || p.stocks <= 0;
    g.save();
    g.fillStyle = "#1c1b46"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    if (im) {
      // the head may break out of the top of the circle, as in the reference
      g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.moveTo(cx + r * 0.82, cy - r * 0.55); g.arc(cx, cy - r * 0.55, r * 0.82, 0, Math.PI * 2); g.clip();
      if (dead) g.filter = "grayscale(1) brightness(0.6)";
      const sz = r * 2.25; g.drawImage(im, cx - sz * 0.5, cy - sz * 0.62, sz, sz); g.filter = "none";
    }
    g.restore();
    g.lineWidth = Math.max(2, r * 0.09); g.strokeStyle = "#0b0a1a"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
    // damage arc: dark under-stroke then the colored arc, from about 7 o'clock round to 2 o'clock
    const a0 = Math.PI * 0.62, a1 = -Math.PI * 0.14, w = r * 0.34, d = dead ? 0 : p.dmg;
    const hit = s.hf >= 0 && s.f - s.hf < 8 && s.p[1 - s.hp] === p, jig = hit ? (rnd() - 0.5) * r * 0.25 : 0;
    g.lineCap = "round";
    g.lineWidth = w + 4; g.strokeStyle = "#0b0a1a"; g.beginPath(); g.arc(cx + jig, cy, r * 0.98, a0, a1, true); g.stroke();
    g.lineWidth = w; g.strokeStyle = dead ? "#5a5670" : dmgColor(d); g.beginPath(); g.arc(cx + jig, cy, r * 0.98, a0, a1, true); g.stroke();
    italic(String(Math.max(0, p.stocks)), cx - r * 1.02, cy + r * 1.02, r * 0.95, "#ffffff", "center");
    const ko = fx.koStamp[i];
    if (ko > 0) { // red KO stamp slams onto the portrait
      const sc = ko > 64 ? 1 + (ko - 64) * 0.12 : 1;
      g.save(); g.globalAlpha = Math.min(1, ko / 12); g.translate(cx, cy); g.rotate(-0.25); g.scale(sc, sc);
      g.lineWidth = r * 0.22; g.strokeStyle = "#e0242f"; g.beginPath(); g.arc(0, 0, r * 0.82, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(-r * 0.58, -r * 0.58); g.lineTo(r * 0.58, r * 0.58); g.stroke();
      g.restore();
    }
    if (showBoxes) italic(d + "%", cx, cy + r * 2.0, r * 0.6, dmgColor(d), "center");
  }
  function hud(s) {
    const u = Math.min(W / 1280, H / 720), r = 19 * u, top = 30 * u;
    if (mode === "online" && net.session) {
      const d = net.session.desync;
      italic(d >= 0 ? `OUT OF SYNC AT FRAME ${d}` : `ONLINE  ${Math.round(net.rtt)} MS`, 18 * u, H - 18 * u, 13 * u, d >= 0 ? "#ff6b6b" : "#ffffff", "left");
    }
    const right = W - 26 * u;
    const cx2 = right - r, cx1 = cx2 - r * 2.85;
    // match timer: 8 minutes from the end of the countdown
    const left = Math.max(0, 8 * 60 - Math.max(0, s.f - FEEL.countdown) / 60);
    const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(Math.floor(left % 60)).padStart(2, "0");
    italic(`${mm}:${ss}`, cx1 - r * 1.55, top + r * 0.45, 17 * u, "#ffffff", "right");
    portrait(0, s.p[0], cx1, top + r * 0.15, r, s);
    portrait(1, s.p[1], cx2, top + r * 0.15, r, s);

    // countdown as measured: each numeral 42 frames (ghost slam in, hold, a 1 frame gap), then the
    // go word for 45 frames that tilts away at the end
    const CD = 42, go = s.f >= FEEL.countdown;
    if (!s.over && s.f < FEEL.countdown + 45 && (go || FEEL.countdown - s.f <= 3 * CD)) {
      const n = Math.ceil((FEEL.countdown - s.f) / CD), ph = go ? s.f - FEEL.countdown : CD - 1 - ((FEEL.countdown - s.f - 1) % CD);
      if (go || ph < CD - 1) {
        const ghost = ph < 7, pop = ghost ? 1.6 - (ph / 7) * 0.6 : 1, out = go && ph > 36 ? (ph - 36) / 9 : 0;
        g.save(); g.translate(W / 2, H * 0.42); g.rotate(out * 0.25); g.scale(pop * (1 + out * 0.3), pop * (1 + out * 0.3));
        display(go ? "BRAWL!" : String(n), 0, 0, (go ? 150 : 170) * u, { ghost, alpha: ghost ? 0.35 + (ph / 7) * 0.65 : 1 - out, arch: go ? 0.09 : 0 });
        g.restore();
      }
    }
    if (fx.banner && fx.banner.t < 170 && !s.over) koBanner(fx.banner, u);
    if (s.over && s.overT < 110) { // GAME! slams in on the last KO
      const pop = s.overT < 8 ? 1.6 - s.overT * 0.075 : 1;
      g.save(); g.translate(W / 2, H * 0.42); g.scale(pop, pop);
      display("GAME!", 0, 0, 150 * u, { ghost: s.overT < 6, alpha: s.overT < 6 ? 0.4 + s.overT * 0.1 : 1, arch: 0.08 });
      g.restore();
    } else if (s.over) results(s, u);
  }
  // Big display words: italic, a yellow to red gradient over a dark red extrusion and a thick
  // outline, optionally arched; a ghost frame is translucent pale pink with no depth.
  function display(text, x, y, size, o = {}) {
    g.save(); g.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    g.font = `${size}px "Lilita One", "Arial Black", system-ui, sans-serif`; g.textBaseline = "middle"; g.lineJoin = "round";
    const widths = [...text].map((c) => g.measureText(c).width), total = widths.reduce((a, b) => a + b, 0) * 0.98;
    const letters = []; let cx = x - total / 2;
    for (let k = 0; k < text.length; k++) {
      const mid = cx + widths[k] / 2, t = total ? (mid - x) / (total / 2) : 0;
      letters.push({ c: text[k], x: mid, y: y + (o.arch ? size * o.arch * 4 * t * t : 0) - (o.arch ? size * o.arch * 2 : 0), r: o.arch ? t * o.arch * 2.2 : 0 });
      cx += widths[k] * 0.98;
    }
    const each = (fn) => { for (const L of letters) { g.save(); g.translate(L.x, L.y); g.rotate(L.r); g.transform(1, 0, -0.16, 1, 0, 0); fn(L.c); g.restore(); } };
    const depth = o.ghost ? 0 : Math.max(2, size * 0.075);
    g.textAlign = "center";
    each((c) => { g.lineWidth = size * 0.16; g.strokeStyle = "#1a0610"; g.strokeText(c, 0, depth); });
    for (let d = depth; d > 0; d -= 1) each((c) => { g.fillStyle = "#7d0f14"; g.fillText(c, 0, d); });
    if (!o.ghost) each((c) => { g.lineWidth = size * 0.1; g.strokeStyle = "#1a0610"; g.strokeText(c, 0, 0); });
    const grd = g.createLinearGradient(0, -size * 0.42, 0, size * 0.42);
    if (o.ghost) { grd.addColorStop(0, "#fff4f7"); grd.addColorStop(1, "#ffc2d2"); }
    else { grd.addColorStop(0, "#ffe873"); grd.addColorStop(0.45, "#ff9a2a"); grd.addColorStop(1, "#e3262e"); }
    each((c) => { g.fillStyle = grd; g.fillText(c, 0, 0); });
    if (!o.ghost) each((c) => { g.globalAlpha *= 0.55; g.lineWidth = Math.max(1, size * 0.018); g.strokeStyle = "#fff6c8"; g.strokeText(c, -size * 0.01, -size * 0.015); });
    g.restore();
  }
  // KO feed, as in the reference: the scorer's portrait, their name on a navy plate, an arrow,
  // then the fighter who fell; it drops in from the top and leaves after about 3 s
  function koBanner(b, u) {
    const tIn = Math.min(1, b.t / 8), tOut = b.t > 155 ? (b.t - 155) / 15 : 0, y = (24 - 70 * (1 - tIn) - 70 * tOut) * u + 26 * u;
    const who = b.killer >= 0 ? b.killer : b.victim, name = FIGHTERS[pick[who]].name.toUpperCase();
    const w = 300 * u, h = 34 * u, x = W / 2 - w / 2, r = 24 * u;
    g.save();
    const plate = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    plate.addColorStop(0, "#22307a"); plate.addColorStop(1, "#111a4d");
    g.fillStyle = plate; g.strokeStyle = "#0b0a1a"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x + 10 * u, y - h / 2); g.lineTo(x + w, y - h / 2); g.lineTo(x + w - 10 * u, y + h / 2); g.lineTo(x, y + h / 2); g.closePath(); g.fill(); g.stroke();
    g.font = `${22 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff";
    g.fillText(b.killer >= 0 ? name : `${name} FELL`, W / 2 - 10 * u, y + 1);
    if (b.killer >= 0) { g.fillStyle = "#8fc7ff"; g.beginPath(); g.moveTo(x + w - 46 * u, y - 10 * u); g.lineTo(x + w - 30 * u, y); g.lineTo(x + w - 46 * u, y + 10 * u); g.closePath(); g.fill(); }
    roundPortrait(pick[who], x - 8 * u, y, r);
    if (b.killer >= 0) roundPortrait(pick[b.victim], x + w + 8 * u, y, r * 0.9);
    g.restore();
  }
  function roundPortrait(id, cx, cy, r) {
    g.save(); g.fillStyle = "#1c1b46"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.clip();
    if (portraits[id]) g.drawImage(portraits[id], cx - r * 1.15, cy - r * 1.35, r * 2.3, r * 2.3);
    g.restore();
    g.lineWidth = Math.max(2, r * 0.14); g.strokeStyle = "#8d93b8"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
    g.lineWidth = 2; g.strokeStyle = "#0b0a1a"; g.beginPath(); g.arc(cx, cy, r + r * 0.07, 0, 7); g.stroke();
  }
  // results, as in the reference: a title bar, each fighter on a pillar (the winner's is taller)
  // in their victory or idle pose, and a stats card with a rank tab
  function results(s, u) {
    const t = s.overT - 110, k = Math.min(1, t / 18), wi = s.over - 1;
    g.save(); g.globalAlpha = k;
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(46,30,92,0.97)"); sky.addColorStop(1, "rgba(120,70,120,0.95)");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const bw = Math.min(W - 40 * u, 620 * u);
    g.fillStyle = "rgba(14,12,48,0.92)"; g.fillRect(W / 2 - bw / 2, 22 * u, bw, 44 * u);
    g.font = `${30 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff";
    g.fillText(`${FIGHTERS[pick[wi]].name.toUpperCase()} WINS!`, W / 2, 45 * u);
    g.fillStyle = "rgba(14,12,48,0.6)"; g.fillRect(W / 2 - bw / 2, 70 * u, bw, 34 * u);
    g.font = `${15 * u}px "Lilita One", "Arial Black", sans-serif`; g.fillStyle = "#ffd36b";
    g.fillText("SPACE OR J: REMATCH       ESC: MENU", W / 2, 88 * u);
    const order = [wi, 1 - wi];
    order.forEach((i, rank) => {
      const cx = W / 2 + (rank === 0 ? -1 : 1) * Math.min(W * 0.22, 210 * u), top = H * (rank === 0 ? 0.5 : 0.57) + (1 - k) * 80 * u;
      pillar(cx, top, 200 * u, i);
      const p = s.p[i], sc = 2.2 * u;
      g.save(); g.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * cx, dpr * (top - 6 * u));
      drawSprite(i, { ...p, x: 0, y: 0, st: ST.IDLE, ground: 1, vx: 0, vy: 0, face: rank === 0 ? 1 : -1, inv: 0 }, s.f, 1, 0, "rgba(8,3,18,0.7)");
      g.restore();
      statsCard(cx, top + 70 * u, 210 * u, i, rank, u);
    });
    g.restore();
  }
  function pillar(cx, top, w, i) {
    const h = H - top + 10;
    const body = g.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    body.addColorStop(0, "#8a5f3c"); body.addColorStop(0.35, "#d2a46b"); body.addColorStop(0.7, "#b8864f"); body.addColorStop(1, "#6e4a2e");
    g.fillStyle = body; g.strokeStyle = "#1a0e10"; g.lineWidth = 3;
    g.fillRect(cx - w * 0.44, top + 10, w * 0.88, h); g.strokeRect(cx - w * 0.44, top + 10, w * 0.88, h);
    g.beginPath(); g.ellipse(cx, top + 14, w / 2, w * 0.13, 0, 0, 7); g.fillStyle = "#c99a62"; g.fill(); g.stroke();
    g.beginPath(); g.ellipse(cx, top + 4, w / 2, w * 0.13, 0, 0, 7); g.fillStyle = "#e2bb83"; g.fill(); g.stroke();
    g.save(); g.shadowColor = TEAM[i]; g.shadowBlur = 16; g.lineWidth = 3; g.strokeStyle = TEAM[i];
    g.beginPath(); g.ellipse(cx, top + 4, w * 0.36, w * 0.085, 0, 0, 7); g.stroke(); g.restore();
  }
  function statsCard(cx, y, w, i, rank, u) {
    const st0 = fx.stats[i], x = cx - w / 2, h = 150 * u;
    g.fillStyle = "rgba(16,18,62,0.95)"; g.strokeStyle = "#0b0a1a"; g.lineWidth = 3;
    rr(x, y, w, h, 8 * u); g.fill(); g.stroke();
    g.fillStyle = "#2a3a8a"; rr(cx - 28 * u, y - 18 * u, 56 * u, 24 * u, 10 * u); g.fill(); g.stroke();
    g.font = `${15 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff";
    g.fillText(rank === 0 ? "1st" : "2nd", cx, y - 6 * u);
    roundPortrait(pick[i], x + 26 * u, y + 30 * u, 18 * u);
    g.textAlign = "left"; g.font = `${19 * u}px "Lilita One", "Arial Black", sans-serif`; g.fillStyle = "#fff";
    g.fillText(FIGHTERS[pick[i]].name.toUpperCase(), x + 52 * u, y + 24 * u);
    g.font = `600 ${11 * u}px system-ui, sans-serif`; g.fillStyle = "#8fc7ff";
    g.fillText(FIGHTERS[pick[i]].title || "", x + 52 * u, y + 41 * u);
    const rows = [["KOs", st0.kos], ["Falls", st0.falls], ["Accidents", st0.acc], ["Dmg Done", st0.done], ["Dmg Taken", st0.taken]];
    rows.forEach(([label, v], r) => {
      const yy = y + 66 * u + r * 16 * u;
      g.textAlign = "left"; g.font = `700 ${13 * u}px system-ui, sans-serif`; g.fillStyle = "#fff"; g.fillText(label, x + 14 * u, yy);
      g.textAlign = "right"; g.fillText(String(v), x + w - 14 * u, yy);
    });
  }
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  // a fighter outside the view shows in a glass bubble at the screen edge, as in the reference
  function bubble(s, i, z) {
    const p = s.p[i];
    if (p.st === ST.DEAD || p.hang > 0) return;
    const F = gfx[i], hw = W / 2 / z, hh = H / 2 / z, x = p.x / S, y = p.y / S - F.h / 2;
    const r = (H * 0.09) / z, pad = r + 8 / z;
    if (Math.abs(x - cam.x) < hw + F.h * 0.3 && Math.abs(y - cam.y) < hh + F.h * 0.5) return;
    const cx = Math.max(cam.x - hw + pad, Math.min(cam.x + hw - pad, x)), cy = Math.max(cam.y - hh + pad, Math.min(cam.y + hh - pad, y));
    g.save();
    g.fillStyle = "rgba(205,210,225,0.35)"; g.strokeStyle = "#0b0a1a"; g.lineWidth = 3 / z;
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.stroke(); g.clip();
    g.translate(cx, cy); g.scale(0.55, 0.55); g.translate(-cx, -cy);
    const age = s.f - s.hf, hitNow = p.st === ST.HIT && s.hp === 1 - i && age < 24;
    drawSprite(i, { ...p, x: cx * S, y: (cy + F.h / 2) * S }, s.f, 1, hitNow ? 1 : 0, null, dmgColor(p.dmg));
    g.restore();
  }
  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBackground();
    if (!st) return;
    const z = Math.min(W / 1280, H / 720) * cam.z;
    g.save();
    g.translate(W / 2 + (rnd() - 0.5) * fx.shake, H / 2 + (rnd() - 0.5) * fx.shake); g.scale(z, z); g.translate(-cam.x, -cam.y);
    drawStage();
    drawFx(true);
    for (const t of [0, 1]) drawFighter(st, t);
    drawFx();
    for (const t of [0, 1]) bubble(st, t, z);
    g.restore();
    drawAtmosphere();
    hud(st);
  }

  // ---------- loop ----------
  function tick() {
    if (mode === "online") {
      if (!net.session) return;
      net.session.tick(read(SOLO) | pad(0));
      st = net.session.state;
      events(st); stepFx(); updateCam(st);
      return;
    }
    if (!st) return;
    let a = 0, b = 0;
    if (mode === "bot") { a = read(SOLO) | pad(0); b = bot(st, 1, 1); }
    else if (mode === "local") { a = read(P1) | pad(0); b = read(P2) | pad(1); }
    else if (mode === "demo") { a = bot(st, 0, 2); b = bot(st, 1, 2); }
    // rematch: a human presses jump or light (the bot's own presses never restart the match)
    const human = mode === "bot" ? a : a | b;
    if (st.over && st.overT > 60 && (human & (IN.J | IN.A) || mode === "demo")) { st = M.create(); fx.reset(); return; }
    M.step(st, [a, b]);
    events(st); stepFx(); updateCam(st);
  }
  const dbg = { paused: false }; // test hook: freezes the sim for screenshots
  // test hook: advance exactly n frames with fixed inputs while paused, for frame-exact captures
  dbg.su = (i) => M.mv[i][st.p[i].mv].su;
  dbg.step = (n, a = 0, b = 0) => { for (let k = 0; k < n; k++) { M.step(st, [a, b]); events(st); stepFx(); updateCam(st); } };
  let acc = 0, last = performance.now();
  function frame(now) {
    acc += Math.min(250, now - last); last = now;
    let n = 0;
    while (acc >= 1000 / 60 && n < 6) { if (mode !== "menu" && mode !== "loading" && !dbg.paused) tick(); acc -= 1000 / 60; n++; }
    if (n === 6) acc = 0;
    draw();
    if (mode === "loading") { loading.t++; drawLoading(); }
    requestAnimationFrame(frame);
  }
  // a click on a mode never looks like a freeze: the versus screen from the reference, a card per
  // fighter (art, name, title, four stat bars) sliding in, a loading bar on top and a tip below
  const TIPS = ["The more damage you take, the farther each hit sends you.",
    "Dodge with a direction to dash. Dodge with no direction to step back.",
    "Hold heavy to charge it. Up and heavy is your recovery move.",
    "A fighter flashes in their damage colour when hit. Red means one more hit.",
    "Slide down a wall and jump off it to get back to the stage."];
  function drawLoading() {
    const u = Math.min(W / 1280, H / 720), t = loading.t;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#2a1d5e"); bg.addColorStop(0.6, "#6b4c9a"); bg.addColorStop(1, "#c98a7a");
    g.globalAlpha = 0.94; g.fillStyle = bg; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
    // top bar with the progress fill
    const k = loading.total ? loading.done / loading.total : 0, bw = Math.min(W - 40 * u, 560 * u), bx = (W - bw) / 2;
    g.fillStyle = "rgba(14,12,48,0.9)"; g.fillRect(bx, 18 * u, bw, 30 * u);
    g.fillStyle = "rgba(47,213,196,0.35)"; g.fillRect(bx, 18 * u, bw * k, 30 * u);
    g.font = `${18 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff";
    g.fillText("LOADING...", W / 2, 34 * u);
    const cw = Math.min(280 * u, W * 0.36), ch = cw * 1.55, gap = Math.min(150 * u, W * 0.1);
    pick.forEach((id, i) => {
      const slide = Math.max(0, 1 - t / 16), ease = slide * slide;
      const cx = W / 2 + (i ? 1 : -1) * (gap / 2 + cw / 2) + (i ? 1 : -1) * ease * W * 0.6, cy = H * 0.52;
      card(id, i, cx, cy, cw, ch, u);
    });
    g.save(); g.translate(W / 2, H * 0.52); display("VS", 0, 0, 90 * u, { alpha: Math.min(1, Math.max(0, (t - 10) / 8)) }); g.restore();
    g.font = `600 ${15 * u}px system-ui, sans-serif`; g.fillStyle = "#f4ecff"; g.textAlign = "center";
    g.fillStyle = "rgba(14,12,48,0.7)"; g.fillRect(0, H - 44 * u, W, 44 * u);
    g.fillStyle = "#f4ecff"; g.fillText(TIPS[loading.tip], W / 2, H - 22 * u);
  }
  function card(id, i, cx, cy, w, h, u) {
    const F = FIGHTERS[id], x = cx - w / 2, y = cy - h / 2, arch = w * 0.5, def = defs[i];
    const shape = (pad) => { g.beginPath(); g.moveTo(x + pad, y + h - pad); g.lineTo(x + pad, y + arch); g.arc(cx, y + arch, w / 2 - pad, Math.PI, 0); g.lineTo(x + w - pad, y + h - pad); g.closePath(); };
    g.save();
    shape(0); g.fillStyle = "#b9a27a"; g.fill(); g.lineWidth = 4; g.strokeStyle = "#0b0a1a"; g.stroke();
    shape(9 * u); g.fillStyle = "#090a2e"; g.fill(); g.lineWidth = 3; g.strokeStyle = "#e9c27a"; g.stroke();
    g.save(); shape(9 * u); g.clip();
    const glow = g.createRadialGradient(cx, cy + h * 0.05, 10, cx, cy + h * 0.05, w * 0.7);
    glow.addColorStop(0, F.color + "66"); glow.addColorStop(1, "rgba(9,10,46,0)");
    g.fillStyle = glow; g.fillRect(x, y, w, h);
    const art = cardArt[id];
    if (art) { const ah = h * 0.5, aw = art.width / art.height * ah, s2 = Math.min(1, (w * 0.9) / aw); g.drawImage(art, cx - (aw * s2) / 2, cy + h * 0.27 - ah * s2, aw * s2, ah * s2); }
    g.restore();
    g.fillStyle = TEAM[i]; g.beginPath(); g.arc(cx, y + 8 * u, 20 * u, 0, 7); g.fill(); g.lineWidth = 4; g.strokeStyle = "#0b0a1a"; g.stroke();
    g.font = `${34 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 6 * u; g.strokeStyle = "#0b0a1a"; g.strokeText(F.name.toUpperCase(), cx, y + 58 * u); g.fillStyle = "#fff"; g.fillText(F.name.toUpperCase(), cx, y + 58 * u);
    g.font = `600 ${13 * u}px system-ui, sans-serif`; g.fillStyle = "#9fc4ff"; g.fillText(F.title || "", cx, y + 84 * u);
    if (def) {
      const st0 = def.stats || {}, moves = def.moves || [], dmg = moves.reduce((a, m) => a + (m.dmg || 0), 0);
      const bars = [["POWER", dmg], ["SPEED", st0.run || 100], ["AIR", ((st0.airSpeed || 100) + (st0.jump || 100)) / 2], ["WEIGHT", st0.weight || 100]];
      bars.forEach(([label, v], r) => {
        const yy = y + h - 82 * u + r * 17 * u, n = Math.max(1, Math.min(10, Math.round(5 + (v - 100) / 4))); // baseline 100 = 5 of 10
        g.font = `700 ${10 * u}px system-ui, sans-serif`; g.textAlign = "left"; g.fillStyle = "#9fc4ff"; g.fillText(label, x + 22 * u, yy);
        for (let b = 0; b < 10; b++) { g.fillStyle = b < n ? "#2fd5c4" : "#1f2156"; g.fillRect(x + 82 * u + b * 15 * u, yy - 5 * u, 13 * u, 10 * u); }
      });
    }
    g.restore();
  }

  // ---------- online: rollback over a WebRTC data channel (game/net.js) ----------
  // PeerJS's free public server only introduces the two browsers; the match itself runs peer to
  // peer. A room is a 5 letter code; the host plays on the left. Add TURN servers in
  // game/net-config.js if friends on strict networks (mobile hotspots, some ISPs) cannot connect.
  const ROOM = "dune-brawl-v1-";
  const ICE = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun.cloudflare.com:3478" }].concat(window.DUNE_TURN || []);
  // both sides must run the same rules: a mismatch would desync, so it refuses to start instead
  const VERSION = (() => { let h = 5381; for (const c of JSON.stringify([FEEL, Object.keys(FIGHTERS)])) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h.toString(36); })();
  const net = { peer: null, conn: null, me: 0, session: null, queue: [], rtt: 0, mine: null, theirs: null, started: false, timer: 0 };
  const say = (t) => { document.getElementById("netStatus").textContent = t; };
  function newCode() {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let c = "";
    for (let k = 0; k < 5; k++) c += a[Math.floor(Math.random() * a.length)];
    return c;
  }
  function leaveOnline(why) {
    clearInterval(net.timer);
    const peer = net.peer, conn = net.conn;
    Object.assign(net, { peer: null, conn: null, session: null, queue: [], theirs: null, started: false });
    if (conn) conn.close();
    if (peer) peer.destroy();
    if (net.mine) pick[0] = net.mine;
    if (why) say(why);
  }
  function hostRoom() {
    if (!window.Peer) return say("The online library did not load. Check your connection and refresh.");
    leaveOnline();
    const code = newCode();
    net.peer = new Peer(ROOM + code, { config: { iceServers: ICE } });
    say("Opening a room...");
    net.peer.on("open", () => {
      const link = `${location.origin}${location.pathname}?join=${code}`;
      document.getElementById("netLink").hidden = false;
      document.getElementById("netLinkText").value = link;
      say(`Room ${code} is open. Send your friend the link, then wait here.`);
    });
    net.peer.on("connection", (c) => { if (net.conn) c.close(); else connected(c, 0); });
    net.peer.on("error", (e) => (e.type === "unavailable-id" ? hostRoom() : say(`Online error: ${e.type}. Try again.`)));
  }
  function joinRoom(raw) {
    const code = raw.trim().toUpperCase();
    if (!window.Peer) return say("The online library did not load. Check your connection and refresh.");
    if (code.length !== 5) return say("Type the 5 letter room code first.");
    leaveOnline();
    net.peer = new Peer({ config: { iceServers: ICE } });
    say(`Joining room ${code}...`);
    net.peer.on("open", () => connected(net.peer.connect(ROOM + code, { reliable: false, serialization: "json" }), 1));
    net.peer.on("error", (e) => say(e.type === "peer-unavailable" ? `No room ${code}. Check the code with your friend.` : `Online error: ${e.type}. Try again.`));
  }
  function connected(c, me) {
    net.conn = c; net.me = me; net.mine = pick[0];
    c.on("open", () => {
      say("Connected. Loading the match...");
      // the channel may drop messages: keep saying hello until the friend's match is running
      net.timer = setInterval(() => {
        if (!c.open) return;
        if (!net.started) c.send({ t: "hello", pick: net.mine, ver: VERSION });
        c.send({ t: "ping", ts: performance.now() });
      }, 250);
    });
    c.on("data", (m) => {
      if (m.t === "ping") return c.send({ t: "pong", ts: m.ts });
      if (m.t === "pong") { net.rtt = net.rtt ? net.rtt * 0.8 + (performance.now() - m.ts) * 0.2 : performance.now() - m.ts; return; }
      if (m.t === "hello") {
        if (m.ver !== VERSION) return say("Your friend has a different version of the game. Both of you refresh the page.");
        if (!net.theirs && FIGHTERS[m.pick]) { net.theirs = m.pick; startOnline(); }
        return;
      }
      if (m.t === "i") net.started = true;
      if (net.session) net.session.receive(m); else net.queue.push(m);
    });
    c.on("close", () => { if (net.conn === c) { leaveOnline("Your friend left the match."); showMenu(); } });
    c.on("error", () => { if (net.conn === c) { leaveOnline("The connection failed. Try again, or add a TURN server (see game/net-config.js)."); showMenu(); } });
  }
  async function startOnline() {
    pick = net.me === 0 ? [net.mine, net.theirs] : [net.theirs, net.mine];
    const t0 = performance.now(); mode = "loading"; hideMenu();
    await load(); await holdCards(t0);
    if (!net.conn) return showMenu();
    net.session = new Net.Session(M, net.me, (msg) => { if (net.conn && net.conn.open) net.conn.send(msg); }, Net.makeStep(Sim, M));
    st = net.session.state;
    for (const m of net.queue) net.session.receive(m);
    net.queue = [];
    mode = "online";
  }

  // ---------- menu ----------
  const menu = document.getElementById("menu");
  function showMenu() { mode = "menu"; menu.hidden = false; }
  function hideMenu() { menu.hidden = true; }
  function buildPickers() {
    [0, 1].forEach((i) => {
      const row = document.getElementById("pick" + i);
      row.innerHTML = "";
      for (const id in FIGHTERS) {
        if (!FIGHTERS[id].ready) continue;
        const b = document.createElement("button");
        b.className = "chip" + (pick[i] === id ? " on" : ""); b.setAttribute("aria-pressed", pick[i] === id);
        b.innerHTML = `<i class="disc"><img alt="" src="${portraitSrc(id)}"></i><span>${FIGHTERS[id].name}</span>`;
        b.onclick = () => { pick[i] = id; buildPickers(); };
        row.appendChild(b);
      }
    });
  }
  document.getElementById("bBot").onclick = () => startMatch("bot");
  document.getElementById("bLocal").onclick = () => startMatch("local");
  document.getElementById("bDemo").onclick = () => startMatch("demo");
  document.getElementById("bOnline").onclick = () => { const o = document.getElementById("online"); o.hidden = !o.hidden; };
  document.getElementById("bHost").onclick = hostRoom;
  document.getElementById("bJoin").onclick = () => joinRoom(document.getElementById("joinCode").value);
  document.getElementById("bCopy").onclick = () => { const t = document.getElementById("netLinkText"); t.select(); navigator.clipboard && navigator.clipboard.writeText(t.value); say("Link copied. Send it to your friend."); };

  // ---------- F2 tuning panel ----------
  const TUNE = [["kbMul", 100, 600], ["hitstunDiv", 48, 300], ["hitDecay", 0, 10], ["grav", 40, 120], ["hitGrav", 20, 90],
    ["maxFall", 800, 2000], ["fastFall", 1200, 3000], ["run", 500, 1400], ["airMax", 400, 1200], ["jumpV", 1000, 2200],
    ["airJumpV", 900, 2000], ["pauseBase", 0, 10], ["pauseDiv", 1, 6], ["pauseMax", 4, 20]];
  const panel = document.getElementById("panel");
  function togglePanel() {
    panel.hidden = !panel.hidden;
    if (panel.hidden) return;
    panel.innerHTML = "<b>F2 feel tuning</b> (live; copy values into sim.js FEEL)";
    for (const [k, lo, hi] of TUNE) {
      const row = document.createElement("label");
      row.innerHTML = `<span>${k}</span><input type="range" min="${lo}" max="${hi}" value="${FEEL[k]}"><output>${FEEL[k]}</output>`;
      const [inp, out] = [row.querySelector("input"), row.querySelector("output")];
      inp.oninput = () => { FEEL[k] = +inp.value; out.textContent = inp.value; rebuild(); };
      panel.appendChild(row);
    }
    const dump = document.createElement("button"); dump.textContent = "Copy values";
    dump.onclick = () => navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(Object.fromEntries(TUNE.map(([k]) => [k, FEEL[k]]))));
    panel.appendChild(dump);
  }

  buildPickers();
  loadStage();
  if (document.fonts) document.fonts.load('40px "Lilita One"'); // canvas text alone never triggers the web font download
  if (params.get("join")) { // opened from a friend's link: pick a fighter, then join
    showMenu(); document.getElementById("online").hidden = false;
    document.getElementById("joinCode").value = params.get("join").toUpperCase();
    say("Your friend invited you. Pick your fighter in the Player 1 row, then press Join.");
  } else if (params.get("mode")) startMatch(params.get("mode")); else showMenu();
  requestAnimationFrame(frame);
  // defineProperties, not Object.assign: assign would copy the getters' values once at load
  window.__db = Object.defineProperties(dbg, {
    state: { get: () => st }, mode: { get: () => mode }, fx: { value: fx }, cam: { value: cam }, net: { value: net },
  });
})();
