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
    // stick fighters (game/stick.js): drawn from a skeleton; `kin` is the painted fighter whose
    // moveset, effects and sound flavour they borrow
    "stick-vespera": { name: "Vespera", title: "The Countess in the Shade", color: "#d0173f", glow: "#ff5c7a", ready: 1, stick: 1, kin: "vampire-countess" },
    "stick-saif": { name: "Saif", title: "The Bound Blade", color: "#1f5a43", glow: "#36e2d4", ready: 1, stick: 1, kin: "djinn-warrior" },
    "stick-marjana": { name: "Marjana", title: "Bane of the Forty", color: "#c22a6e", glow: "#ffd0e4", ready: 1, stick: 1, kin: "dagger-dancer" },
    "stick-dana": { name: "Dana", title: "Bride of the Sea", color: "#128a7f", glow: "#8ff5ea", ready: 1, stick: 1, kin: "sea-siren" },
    "stick-nawaf": { name: "Nawaf", title: "Falconer of the Heights", color: "#7a4a22", glow: "#ffcf5a", ready: 1, stick: 1, kin: "falcon-rider" },
    "chameleon-slinger": { name: "Hirba", title: "The Slow Trick Shot", color: "#7ccf2a", glow: "#ff5ad0", art: "anim-v2" },
  };
  const kin = (id) => (FIGHTERS[id] && FIGHTERS[id].kin) || id;
  const stickArt = {}; // generated stills for stick fighters: chip portrait and loading card
  const portraitSrc = (id) => {
    if (FIGHTERS[id].stick) return (stickArt[id] = stickArt[id] || Stick.still(id, 160, true).toDataURL());
    return `${ROOT}/assets/fighters/${id}/${FIGHTERS[id].portrait || "source/portrait.png"}`;
  };
  const TEAM = ["#2fd5c4", "#ff7a45", "#b07cff", "#8fe04a"]; // player colours: teal, orange, violet, lime
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
  const SOLO = { L: ["KeyA", "ArrowLeft"], R: ["KeyD", "ArrowRight"], U: ["KeyW", "ArrowUp"], D: ["KeyS", "ArrowDown"], J: ["Space"], A: ["KeyJ", "KeyC"], B: ["KeyK", "KeyX"], X: ["KeyL", "ShiftLeft", "ShiftRight"], T: ["KeyI", "KeyV"] };
  const P1 = { L: ["KeyA"], R: ["KeyD"], U: ["KeyW"], D: ["KeyS"], J: ["Space"], A: ["KeyF"], B: ["KeyG"], X: ["KeyH", "ShiftLeft"], T: ["KeyT"] };
  const P2 = { L: ["ArrowLeft"], R: ["ArrowRight"], U: ["ArrowUp"], D: ["ArrowDown"], J: ["ShiftRight", "Numpad0"], A: ["Period", "Numpad1"], B: ["Slash", "Numpad2"], X: ["Comma", "Numpad3"], T: ["Quote", "Numpad4"] };
  const read = (map) => { let v = 0; for (const k in map) if (map[k].some((c) => keys.has(c))) v |= IN[k]; return v; };
  function pad(i) {
    const gp = navigator.getGamepads && navigator.getGamepads()[i];
    if (!gp) return 0;
    const b = (n) => gp.buttons[n] && gp.buttons[n].pressed, ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    let v = 0;
    if (ax < -0.4 || b(14)) v |= IN.L; if (ax > 0.4 || b(15)) v |= IN.R;
    if (ay < -0.5 || b(12)) v |= IN.U; if (ay > 0.5 || b(13)) v |= IN.D;
    if (b(0)) v |= IN.J; if (b(2)) v |= IN.A; if (b(1)) v |= IN.B; if (b(3)) v |= IN.T; // Y throws
    if (b(4) || b(5) || b(6) || b(7)) v |= IN.X;
    return v;
  }

  // ---------- bot (render-side input generator; local modes only) ----------
  // the foe a bot (or the camera) cares about: the nearest fighter still in the match
  function foeOf(s, i) {
    let best = null, bd = Infinity;
    s.p.forEach((q, j) => { if (j === i || q.stocks <= 0) return; const d = Math.hypot(q.x - s.p[i].x, q.y - s.p[i].y) + (q.st === ST.DEAD ? 1e9 : 0); if (d < bd) { bd = d; best = q; } });
    return best || s.p[(i + 1) % s.p.length];
  }
  function bot(s, i, level) {
    const me = s.p[i], foe = foeOf(s, i), m = STAGE.main;
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
    // only from above ledge height with jumps to spare: a bot that dives below it never makes it back
    if (foeOff && me.jumps >= 2 && me.y < m.y - 20 * S && Math.abs(me.x - ledgeX) < 230 * S) {
      const near = Math.abs(dx) < 80 * S && Math.abs(dy) < 90 * S;
      v |= dx > 0 ? IN.R : IN.L;
      if (me.ground && even && Math.random() < 0.5) v |= IN.J;
      else if (!me.ground && me.jumps > 1 && dy < -40 * S && me.vy > -200 && even) v |= IN.J;
      if (near && even && Math.random() < 0.25 + 0.1 * level) v |= dy > 30 * S ? IN.D | IN.A : IN.A;
      return v;
    }
    if (((me.x < m.x1 - 4 * S || me.x > m.x2 + 4 * S) && !me.ground) || under || (!me.ground && me.y > m.y - 10 * S && (offL || offR))) {
      // under the island: steer out past the nearer ledge first, then back in once above it
      const cx = (m.x1 + m.x2) / 2, clear = 30 * S, outside = me.x < m.x1 - clear || me.x > m.x2 + clear;
      v |= under && !outside ? (me.x < cx ? IN.L : IN.R) : me.x < cx ? IN.R : IN.L;
      // the recovery move never goes off under the island: it would only hit the underside
      if (me.vy > -200 && even) v |= me.wall || me.jumps > 0 ? IN.J : me.recov || (under && !outside) ? 0 : IN.U | IN.B;
      return v;
    }
    if (foe.st === ST.DEAD) return Math.abs(me.x - 640 * S) > 60 * S ? (me.x < 640 * S ? IN.R : IN.L) : 0;
    // weapons: go and fetch a stuck blade, and throw now and then at a foe across the stage
    if (!me.wpn && me.ws === 2 && Math.abs(me.wx - me.x) > 20 * S) {
      v |= me.wx > me.x ? IN.R : IN.L;
      if (me.ground && me.wy < me.y - 60 * S && even) v |= IN.J;
      return v;
    }
    if (me.wpn && M.ph[i].kit && me.ground && Math.abs(dy) < 60 * S && Math.abs(dx) > 260 * S && even && Math.random() < 0.02 + 0.01 * level) return (dx > 0 ? IN.R : IN.L) | IN.T;
    // finisher: hold a charged side heavy on a foe at the finisher's damage
    if (me.st === ST.ATK && me.mv === 5 && me.chg > 0 && me.chg < FEEL.finCharge + 4) return IN.B;
    if (me.ground && foe.dmg >= FEEL.finDamage && Math.abs(dx) < 110 * S && Math.abs(dy) < 40 * S && foe.st !== ST.DODGE && even && Math.random() < 0.25) return (dx > 0 ? IN.R : IN.L) | IN.B;
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
  // the menu holds four slots; `count` of them play (2 to 4), as `pick`
  const slots = [params.get("p1") || "djinn-warrior", params.get("p2") || "dune-ghoul", params.get("p3") || "stick-saif", params.get("p4") || "stick-vespera"];
  let count = Math.max(2, Math.min(4, +params.get("n") || 2));
  let mode = "menu", pick = slots.slice(0, count);
  let M = null, st = null, defs = [], gfx = [], showBoxes = false;
  const loading = { done: 0, total: 0, t: 0, tip: 0 };
  const cardArt = {};
  const img = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
  async function load() {
    loading.done = 0; loading.total = 0; loading.t = 0; loading.tip = Math.floor(Math.random() * TIPS.length);
    // the versus cards first (one small image each), so the loading screen has its art at once
    await Promise.all(pick.map(async (id) => {
      if (!cardArt[id]) cardArt[id] = FIGHTERS[id].stick ? Stick.still(id, 420, false) : await img(`${ROOT}/assets/fighters/${id}/${FIGHTERS[id].basePose || "source/base-pose.png"}`);
    }));
    // stick fighters move with the stick kit (FEEL.kit in sim.js); painted fighters keep the reference tuning
    defs = await Promise.all(pick.map(async (id) => ({ ...(await (await fetch(`${ROOT}/assets/fighters/${kin(id)}/moves.draft.json`)).json()), kit: FIGHTERS[id].stick ? 1 : 0 })));
    M = Sim.match(defs);
    const progress = { onCount: (n) => (loading.total += n), onSheet: () => loading.done++ };
    gfx = await Promise.all(pick.map((id, i) => FIGHTERS[id].stick ? Stick.create(id, (defs[i].stats || {}).height || 64, M.ph[i])
      : Render.loadFighter(id, ROOT, { art: FIGHTERS[id].art, height: (defs[i].stats || {}).height, basePose: FIGHTERS[id].basePose, victoryHold: FIGHTERS[id].victoryHold, remap: FIGHTERS[id].remap, ...progress })));
    await Promise.all(pick.map((id) => new Promise((ok) => { const im = new Image(); im.onload = () => { portraits[id] = im; ok(); }; im.onerror = ok; im.src = portraitSrc(id); })));
    st = M.create(); fx.reset(); Object.assign(cam, { x: 640, y: 330, z: 0.9 });
  }
  // the versus screen stays up for at least 1.6 s so the cards register, as in the reference
  const holdCards = (t0) => new Promise((ok) => setTimeout(ok, Math.max(0, 1600 - (performance.now() - t0))));
  async function startMatch(m) { if (window.Sfx) { Sfx.init(); Sfx.play("uiConfirm", 0); } pick = slots.slice(0, count); const t0 = performance.now(); mode = "loading"; hideMenu(); await load(); await holdCards(t0); mode = m; }
  function rebuild() { if (defs.length) { M = Sim.match(defs); } }

  // ---------- effects (render only, driven by sim events) ----------
  // Painted effect sprites (assets/vfx) do the heavy lifting; a few embers add motion.
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const vfx = {};
  ["star1", "star2", "star3", "puff1", "puff2", "puff3", "puff4",
   "smear1", "smear2", "smear3", "kick1", "kick2", "kick3", "ko-splash", "ko-cloud"].forEach((n) => { const im = new Image(); im.onload = () => (vfx[n] = im); im.src = `${ROOT}/assets/vfx/${n}.webp`; });
  const fx = {
    sprites: [], parts: [], marks: [], bats: [], petals: [], shake: 0,
    // per fighter state is rebuilt for 2 to 4 fighters by reset()
    reset() {
      const n = Math.max(2, pick.length), per = (v) => Array.from({ length: n }, () => (typeof v === "function" ? v() : v));
      Object.assign(this, { sprites: [], parts: [], shake: 0, lastHf: -1, lastKf: -1, koStamp: per(0), bats: [], petals: [], marks: [], banner: null, won: 0, koHold: 0, chain: 0, chainF: -99,
        grounded: per(1), wasSt: per(0), lastVy: per(0), after: per(() => []), landF: per(-99), landVy: per(0), jumpF: per(-99), turnF: per(-99), lastFace: per(1), lastVx: per(0), walled: per(0),
        stats: per(() => ({ kos: 0, falls: 0, acc: 0, done: 0, taken: 0 })), lastDmg: per(0), hitOn: per(-1e9), lastBy: per(-1), outF: per(-1), ws: per(0), lastCf: -1 });
    },
    // a painted sprite: grows from s0 to s1 in `pop` frames, holds, then fades over the rest of `life` frames
    add(name, x, y, opt) { this.sprites.push({ name, x, y, t: 0, rot: 0, flip: 1, s0: 0.6, s1: 1, pop: 3, life: 18, w: 80, ax: 0.5, ay: 0.5, alpha: 1, ...opt }); },
    // flat white cel effects, as in the reference: puffs stay where they were made
    puff(x, y, w, opt) { this.add(`puff${1 + Math.floor(rnd() * 4)}`, x, y, { w, rot: (rnd() - 0.5) * 0.6, s0: 0.7, s1: 1.15, pop: 6, life: 30, ...opt }); },
    kick(x, y, w, flip) { this.add(`kick${1 + Math.floor(rnd() * 3)}`, x, y, { w, ay: 0.95, flip, s0: 0.6, s1: 1, pop: 3, life: 16 }); },
  };
  fx.reset();
  // sounds (game/audio.js), panned by where they happen on screen
  const sfx = (name, x, o) => {
    if (!window.Sfx || mode === "loading") return;
    const pan = Math.max(-1, Math.min(1, (x - cam.x) / 640)), opt = { fighter: o && o.who !== undefined ? kin(pick[o.who]) : null, ...o };
    if (dbg.soundLog) dbg.soundLog.push({ f: st ? st.f : 0, name, pan, o: opt }); // test hook: recordings render these offline
    Sfx.play(name, pan, opt);
  };
  // music beds (game/audio.js): "battle" under a match, "results" after it, "menu" on the menu, null for
  // silence (loading screens stay silent, as in the reference); logged like sounds so recordings can follow it
  const music = (track) => {
    if (!window.Sfx) return;
    if (dbg.soundLog) dbg.soundLog.push({ f: st ? st.f : 0, name: "music", pan: 0, o: { track } });
    if (track) Sfx.music(track); else Sfx.stopMusic();
  };
  // ---------- per-fighter flair (game/flair.js) ----------
  const style = (i) => Flair.STYLES[kin(pick[i])] || {};
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
  // ---------- swing smears ----------
  // Authored shapes, as in the reference, built from each move's hitbox: a thrust leaves a
  // straight tapered streak along its line, an up or down strike a vertical one, and a spin a
  // crescent that sweeps round the fighter over the active frames. White core, the fighter's
  // colour on the rim, a thin dark edge; it holds a beat after the strike and fades.
  const SMEAR_KIND = ["thrust", "thrust", null, "up", "spin", "thrust", "up", "flat", "down", "down"];
  function drawSmears() {
    if (!st) return;
    for (let i = 0; i < st.p.length; i++) {
      const p = st.p[i], col = style(i).trail;
      if (!col || p.st !== ST.ATK) continue;
      const m = M.mv[i][p.mv], kind = SMEAR_KIND[p.mv], k = p.t - m.su;
      if (!kind || k < 0 || k > m.ac + 5) continue;
      const body = gfx[i] ? gfx[i].h : 64, b = m.box, heavy = p.mv >= 5;
      const grow = Math.min(1, (k + 1) / 2), fade = k <= m.ac ? 1 : 1 - (k - m.ac) / 6;
      const w = body * (heavy ? 0.13 : 0.09);
      g.save(); g.translate(p.x / S, p.y / S); g.scale(p.face, 1); g.lineJoin = "round";
      const layers = [[1.35, "#14060f", 0.45], [1, col, 0.92], [0.42, "#ffffff", 1]];
      if (kind === "spin" || kind === "flat") {
        const cx = (b[0] + b[1]) / 2, cy = (b[2] + b[3]) / 2, rx = (b[1] - b[0]) / 2 * 0.92, ry = kind === "flat" ? rx * 0.28 : (b[3] - b[2]) / 2 * 0.92;
        const head = -Math.PI / 2 + Math.min(1, k / Math.max(1, m.ac)) * Math.PI * 2.1, len = Math.PI * 1.25;
        for (const [wk, c, al] of layers) {
          g.globalAlpha = al * fade; g.fillStyle = c; g.beginPath();
          const N = 28;
          for (let j = 0; j <= N; j++) { const a = head - len * (j / N), r = 1 + (wk * w / rx) * (1 - j / N); g.lineTo(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r); }
          for (let j = N; j >= 0; j--) { const a = head - len * (j / N), r = 1 - (wk * w / rx) * 0.4 * (1 - j / N); g.lineTo(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r); }
          g.closePath(); g.fill();
        }
      } else {
        // a streak from near the body to the hitbox's far edge, thickest just behind the point
        let x0, y0, x1, y1;
        if (kind === "thrust") { const ym = (b[2] + b[3]) / 2; x0 = b[0] * 0.2; x1 = b[1]; y0 = y1 = ym; }
        else if (kind === "up") { const xm = (b[0] + b[1]) / 2; x0 = x1 = xm; y0 = -body * 0.45; y1 = b[2]; }
        else { x0 = x1 = 0; y0 = -body * 0.4; y1 = Math.max(b[3], body * 0.5); }
        const D = Math.hypot(x1 - x0, y1 - y0) || 1, L = D * grow, ux = (x1 - x0) / D, uy = (y1 - y0) / D;
        const tipX = x0 + ux * L, tipY = y0 + uy * L;
        for (const [wk, c, al] of layers) {
          const ww = w * wk * 0.8;
          g.globalAlpha = al * fade; g.fillStyle = c; g.beginPath();
          g.moveTo(x0, y0);
          g.quadraticCurveTo(x0 + ux * L * 0.75 - uy * ww * 1.2, y0 + uy * L * 0.75 + ux * ww * 1.2, tipX, tipY);
          g.quadraticCurveTo(x0 + ux * L * 0.75 + uy * ww * 1.2, y0 + uy * L * 0.75 - ux * ww * 1.2, x0, y0);
          g.fill();
        }
        if (heavy) { g.globalAlpha = 0.7 * fade; g.strokeStyle = "#ffffff"; g.lineWidth = 1.5; g.lineCap = "round"; // two speed lines alongside
          for (const o of [-1, 1]) { g.beginPath(); g.moveTo(x0 + ux * L * 0.2 - uy * w * 1.6 * o, y0 + uy * L * 0.2 + ux * w * 1.6 * o); g.lineTo(x0 + ux * L * 0.7 - uy * w * 1.6 * o, y0 + uy * L * 0.7 + ux * w * 1.6 * o); g.stroke(); } }
      }
      g.restore();
    }
    g.globalAlpha = 1;
  }
  function events(s) {
    if (s.fin > 0) { // finisher cues, keyed to its frames so they replay identically
      const T = finT(s), V = s.p[s.fv], vx = V.x / S, vy = V.y / S - (gfx[s.fv] ? gfx[s.fv].h : 64) * 0.5;
      if (T === 1) { sfx("parry", vx, { who: s.fa }); for (let k = 0; k < 16; k++) flairApi.bat(vx, vy, rnd() * 6.28, 8 + rnd() * 8, 1.2); fx.shake = 6; }
      if (T >= FIN.open && (T - FIN.open) % FIN.slash === 0 && (T - FIN.open) / FIN.slash < FIN.count) {
        sfx("hitHeavy", vx, { who: s.fa, k: 40 }); fx.shake = 7;
        fx.add(`star${1 + Math.floor(rnd() * 3)}`, vx + (rnd() - 0.5) * 20, vy + (rnd() - 0.5) * 20, { w: 46, rot: rnd() * 6.28, s0: 1, s1: 0.7, pop: 1, life: 8 });
        if (style(s.fa).hit) style(s.fa).hit(flairApi, s.fa, vx, vy, rnd() < 0.5 ? 1 : -1, true, 5);
      }
      if (T === FEEL.finFrames - 3) sfx("swingHeavy", vx, { who: s.fa, mv: 5 });
    }
    // countdown and match end cues
    const cd = FEEL.countdown - s.f;
    if (cd === 125) music("battle"); // the match bed starts with the countdown (rematches too)
    if (cd === 125 || cd === 84 || cd === 42) sfx("count", cam.x, { n: Math.ceil(cd / 42) }); // the first event runs one frame in
    if (cd === 0) sfx("go", cam.x);
    if (s.over && s.overT === 1) { sfx("game", cam.x); music(null); } // the announcer calls "Game!" over silence
    if (s.over && s.overT === 110) { sfx("winner", cam.x); music("results"); } // the results screen: its louder theme and a winner call
    if (s.hf !== fx.lastHf && s.hf >= 0) {
      fx.lastHf = s.hf;
      const x = s.hx / S, y = s.hy / S, k = s.hk / 100, heavy = k > 18;
      if (s.ha === 2) { // parry: a bright ring and a hard shake, no damage spark
        fx.add("star2", x, y, { w: 70, rot: rnd() * 6.28, s0: 0.3, s1: 1.4, pop: 3, life: 14 });
        fx.shake = Math.max(fx.shake, 6);
        if (style(s.hv).parried) style(s.hv).parried(flairApi, s.hv, x, y);
        sfx("parry", x);
      } else {
        fx.hitOn[s.hv] = s.f; fx.lastBy[s.hv] = s.hp; // a fall soon after is this hitter's KO
        const cmb = s.p[s.hp].cmb, vb = gfx[s.hv] ? gfx[s.hv].h : 64;
        if (cmb === 1) fx.marks.push({ t: 0, kind: "text", x, y: y - vb * 0.7, text: "x2", size: 22, life: 34 });
        if (cmb === 3) { // the combo finisher lands: a shockwave bubble, a callout, a harder shake
          fx.marks.push({ t: 0, kind: "text", x, y: y - vb * 0.8, text: "FINISH!", size: 30, life: 46 });
          fx.marks.push({ t: 0, kind: "bubble", x, y, r: vb * 1.3, life: 18 });
          fx.shake = Math.max(fx.shake, 10);
        } else if (heavy && gfx[s.hp].stick) fx.marks.push({ t: 0, kind: "bubble", x, y, r: vb * 0.9, life: 14 });
        if (style(s.hp).hit) style(s.hp).hit(flairApi, s.hp, x, y, s.p[s.hp].face, heavy, s.p[s.hp].mv);
        fx.chain = s.f - fx.chainF < 12 ? fx.chain + 1 : 0; fx.chainF = s.f; // strings of hits rise in pitch
        sfx(heavy ? "hitHeavy" : "hit", x, { k, who: s.hp, mv: s.p[s.hp].mv, chain: fx.chain });
        const atk = s.p[s.hp], dir = atk ? atk.face : 1, body = gfx[s.hv] ? gfx[s.hv].h : 64;
        fx.shake = Math.max(fx.shake, heavy ? 6 : 3); // the reference camera barely moves: 0.05 to 0.1 bodies
        // a small flat white starburst at the contact point; colour comes from the victim flash
        fx.add(`star${1 + Math.floor(rnd() * 3)}`, x, y, { w: body * (heavy ? 0.62 : 0.45), rot: rnd() * 6.28, s0: 1, s1: 0.7, pop: 1, life: heavy ? 10 : 7 });
        fx.marks.push({ t: 0, kind: "burst", x, y, dir, r: body * (heavy ? 0.85 : 0.55), n: heavy ? 8 : 5, life: heavy ? 9 : 6, rot: rnd() * 6.28 });
        if (heavy) fx.marks.push({ t: 0, kind: "ring", x, y, color: "#ffffff", life: 12, r0: 0.3, r1: 1.5 });
        for (let j = 0; j < 3; j++) {
          const a = (dir > 0 ? 0 : Math.PI) + (rnd() - 0.5) * 1.6, sp = 2 + rnd() * 3;
          fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 0.4, size: 1.5 + rnd(), c: "#ffffff", g: 0.1 });
        }
      }
    }
    if (s.kf !== fx.lastKf && s.kf >= 0) {
      fx.lastKf = s.kf; fx.shake = 8; fx.koStamp[s.kp] = 70; fx.koHold = 70;
      // stats for the results screen: a fall within 5 s of being hit is the hitter's KO, else an accident
      const killer = s.f - fx.hitOn[s.kp] < 300 ? fx.lastBy[s.kp] : -1;
      if (s.p[s.kp].stocks <= 0) fx.outF[s.kp] = s.f; // out of the match: ranks the results
      fx.stats[s.kp].falls++; if (killer >= 0) fx.stats[killer].kos++; else fx.stats[s.kp].acc++;
      fx.banner = { killer, victim: s.kp, t: 0 };
      sfx("ko", s.kx / S, { scorer: killer >= 0 ? kin(pick[killer]) : null });
      // the reference KOs at the screen edge: a white ink splash and a cloud bank burst inward
      // from where the fighter left the view, with speed lines in the attacker's team colour
      const z = Math.min(W / 1280, H / 720) * cam.z, hw = W / 2 / z, hh = H / 2 / z;
      const kx = s.kx / S, ky = s.ky / S, ang = Math.atan2(cam.y - ky, cam.x - kx);
      const t = Math.min(hw / Math.max(1e-6, Math.abs(Math.cos(ang))), hh / Math.max(1e-6, Math.abs(Math.sin(ang))));
      const x = cam.x - Math.cos(ang) * t, y = cam.y - Math.sin(ang) * t, scr = (H / z);
      fx.add("ko-cloud", x, y, { w: scr * 0.55, ax: 0, ay: 0.5, rot: ang, s0: 0.4, s1: 1.05, pop: 10, life: 70 });
      fx.add("ko-splash", x, y, { w: scr * 0.6, ax: 0, ay: 0.5, rot: ang, s0: 0.5, s1: 1.1, pop: 4, life: 34 });
      const team = killer >= 0 ? style(killer).ko || TEAM[killer] : "#ffffff";
      if (killer >= 0 && style(killer).scoredKO) style(killer).scoredKO(flairApi, killer, x, y, ang, scr);
      for (let j = 0; j < 18; j++) {
        const a = ang + (rnd() - 0.5) * 1.2, sp = 10 + rnd() * 16;
        fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.8 + rnd() * 0.4, size: 2 + rnd() * 3, c: rnd() < 0.6 ? team : "#ffffff", g: 0 });
      }
    }
    if (s.cf !== fx.lastCf && s.cf >= 0) { // blades meeting: a big white spark, rings, a clang and a callout
      fx.lastCf = s.cf;
      const x = s.cx / S, y = s.cy / S;
      fx.add("star2", x, y, { w: 90, rot: rnd() * 6.28, s0: 0.4, s1: 1.5, pop: 2, life: 12 });
      fx.marks.push({ t: 0, kind: "burst", x, y, dir: 1, r: 70, n: 12, life: 12, rot: rnd() * 6.28 });
      fx.marks.push({ t: 0, kind: "ring", x, y, color: "#fff2b0", life: 14, r0: 0.2, r1: 2.2 });
      fx.marks.push({ t: 0, kind: "text", x, y: y - 46, text: "CLASH!", size: 24, life: 34 });
      for (let j = 0; j < 14; j++) { const a = rnd() * 6.28, sp = 3 + rnd() * 6; fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 0.6, size: 1.2 + rnd(), c: rnd() < 0.5 ? "#ffe9a0" : "#ffffff", g: 0.2 }); }
      fx.shake = Math.max(fx.shake, 7);
      sfx("clash", x);
    }
    s.p.forEach((p, i) => { // thrown weapons: let go, stuck in, picked up
      const was = fx.ws[i];
      if (p.ws !== was) {
        const x = p.wx / S, y = p.wy / S;
        if (p.ws === 1) sfx("throw", p.x / S, { who: i });
        if (p.ws === 2) { sfx("stick", x); fx.puff(x, y - 4, 22, { s0: 0.5, s1: 1.2, life: 20, alpha: 0.7 }); for (let j = 0; j < 5; j++) fx.parts.push({ x, y, vx: (rnd() - 0.5) * 4, vy: -1 - rnd() * 3, life: 0.5, size: 1.2, c: "#2a1a14", g: 0.25 }); }
        if (p.ws === 0 && was) { sfx("pickup", p.x / S); fx.marks.push({ t: 0, kind: "ring", x: p.x / S, y: p.y / S - (gfx[i] ? gfx[i].h : 64) * 0.55, color: TEAM[i], life: 14, r0: 0.6, r1: 1.3 }); }
        fx.ws[i] = p.ws;
      }
    });
    s.p.forEach((p, i) => { // damage dealt and taken, for the results screen
      const d = p.dmg - fx.lastDmg[i];
      if (d > 0) { fx.stats[i].taken += d; if (fx.lastBy[i] >= 0) fx.stats[fx.lastBy[i]].done += d; }
      fx.lastDmg[i] = p.dmg;
    });
    if (s.over && !fx.won) { fx.won = 1; const w = s.p[s.over - 1]; if (style(s.over - 1).won) style(s.over - 1).won(flairApi, s.over - 1, w.x / S, w.y / S); }
    s.p.forEach((p, i) => {
      if (p.st === ST.DEAD) return;
      if (style(i).frame) style(i).frame(flairApi, i, p, s);
      if (p.ground && !fx.grounded[i]) { fx.landF[i] = s.f; fx.landVy[i] = fx.lastVy[i]; }
      if (!p.ground && fx.grounded[i] && p.vy < 0) fx.jumpF[i] = s.f;
      if (p.face !== fx.lastFace[i]) { // a turn at speed skids: a small kick of dust
        if (p.ground && Math.abs(p.vx) > 500) { fx.turnF[i] = s.f; fx.kick(p.x / S, p.y / S, (gfx[i] ? gfx[i].h : 64) * 0.5, -p.face); }
        fx.lastFace[i] = p.face;
      }
      // running feet kick up small puffs, as in the reference
      if (p.ground && p.st === ST.IDLE && Math.abs(p.vx) > 700 && s.f % 9 === 0) fx.puff(p.x / S - Math.sign(p.vx) * 10, p.y / S - 3, (gfx[i] ? gfx[i].h : 64) * 0.13, { s0: 0.6, s1: 1.2, pop: 4, life: 16, alpha: 0.6 });
      const x = p.x / S, y = p.y / S;
      const body = gfx[i] ? gfx[i].h : 64;
      if (p.ground && !fx.grounded[i]) {
        fx.puff(x - body * 0.3, y - 6, body * 0.35); fx.puff(x + body * 0.3, y - 6, body * 0.35);
        if (fx.lastVy[i] > 1250 && gfx[i].stick) { // a hard landing on one knee throws a ring of dust
          fx.marks.push({ t: 0, kind: "ring", x, y: y - 2, color: "#f3d9a4", life: 16, r0: 0.4, r1: 2.4, flat: 1 });
          for (const sgn of [-1, 1]) fx.puff(x + sgn * body * 0.65, y - 4, body * 0.3, { s0: 0.5, s1: 1.3, life: 24 });
          fx.shake = Math.max(fx.shake, 4);
        }
        if ((p.st === ST.ATK || fx.wasSt[i] === ST.ATK) && style(i).land) style(i).land(flairApi, i, x, y, p.mv);
        sfx("land", x);
      }
      if (!p.ground && fx.grounded[i] && p.vy < 0) { fx.kick(x, y, body * 0.6, -p.face); sfx("jump", x); }
      if (!p.ground && !fx.grounded[i] && p.vy < -1000 && fx.lastVy[i] >= -1000 && p.st === ST.IDLE) { fx.puff(x, y + 4, body * 0.5, { s0: 0.4, s1: 1.3, life: 22 }); sfx("airJump", x); } // air jump ring
      // a fighter blasted into the stage cracks it, as in stick-fight animation: a crater of cracks, grey smoke and grit
      if (gfx[i].stick && p.st === ST.HIT) {
        const vG = p.ground && !fx.grounded[i] ? fx.lastVy[i] : 0, vW = p.wall && !fx.walled[i] ? Math.abs(fx.lastVx[i]) : 0;
        if (vG > 1100 || vW > 900) slam(i, x, y, body, vW > 900 ? p.wall : 0, Math.max(vG, vW));
      }
      fx.walled[i] = p.wall; fx.lastVx[i] = p.vx;
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
      if (p.st === ST.ATK && p.t === M.mv[i][p.mv].su && p.mv <= 4 && !style(i).trail && !gfx[i].stick) { // a white swing crescent on every light, hit or miss
        const b = M.box(p, M.mv[i][p.mv]).map((v) => v / S);
        const sm = `smear${1 + Math.floor(rnd() * 3)}`;
        fx.add(sm, (b[0] + b[1]) / 2, (b[2] + b[3]) / 2, { w: Math.max(18, (b[1] - b[0]) * 0.55), flip: -p.face, rot: (rnd() - 0.5) * 0.4, s0: 0.85, s1: 1, pop: 1, life: 7, alpha: 0.9, im: style(i).smear && tintedVfx(sm, style(i).smear) });
      }
      if (p.st === ST.ATK && p.t === M.mv[i][p.mv].su && p.mv <= 4) sfx("swing", x, { who: i, mv: p.mv });
      if (p.st === ST.ATK && p.t === M.mv[i][p.mv].su && p.mv > 4 && p.mv !== 9) sfx("swingHeavy", x, { who: i, mv: p.mv });
      fx.wasSt[i] = p.st;
    });
  }
  function slam(i, x, y, body, wall, v) {
    const k = Math.min(1, (v - 900) / 2600), cx = x + wall * body * 0.28, cy = wall ? y - body * 0.5 : y, out = wall ? (wall > 0 ? Math.PI : 0) : -Math.PI / 2;
    fx.marks.push({ t: 0, kind: "crack", x: cx, y: cy, ang: out + Math.PI, r: body * (0.7 + 0.6 * k), n: 6 + Math.round(4 * k), seed: (st ? st.f : 0) * 7 + i, life: 150 });
    for (let j = 0; j < 4; j++) { // smoke billows sideways along the hit surface, behind the body
      const side = j % 2 ? 1 : -1, d = body * (0.3 + 0.25 * (j >> 1)), tx = -Math.sin(out), ty = Math.cos(out);
      fx.puff(cx + tx * side * d + Math.cos(out) * body * 0.1, cy + ty * side * d + Math.sin(out) * body * 0.1, body * (0.28 + 0.2 * k), { s0: 0.6, s1: 1.6, pop: 5, life: 40 + j * 8, alpha: 0.55, under: 1, im: tintedVfx(`puff${1 + Math.floor(rnd() * 4)}`, "#8f8a86") });
    }
    for (let j = 0; j < 8 + 6 * k; j++) { // grit: dark specks thrown off the surface
      const a = out + (rnd() - 0.5) * 2.6, sp = 2 + rnd() * 5;
      fx.parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.32, life: 1, size: 1.2 + rnd() * 1.8, c: "#2a1a14" });
    }
    fx.shake = Math.max(fx.shake, 5 + 4 * k);
    sfx("slam", x);
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
    if (s.fin > 0) { // a finisher pushes in tight on the victim
      const v = s.p[s.fv], tx = v.x / S, ty = v.y / S - (gfx[s.fv] ? gfx[s.fv].h : 64) * 0.6;
      cam.x += (tx - cam.x) * 0.2; cam.y += (ty - cam.y) * 0.2; cam.z += (2.3 - cam.z) * 0.15;
      return;
    }
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
  const mixHex = (a, b, k) => { // blend two "#rrggbb" colours
    const p = (h) => [1, 3, 5].map((j) => parseInt(h.slice(j, j + 2), 16)), x = p(a), y = p(b);
    return `rgb(${x.map((v, j) => Math.round(v + (y[j] - v) * k)).join(",")})`;
  };
  function drawSprite(i, p, f, alpha, tint, halo, tintColor = "#fff") {
    const win = p.winPose !== undefined ? p.winPose : st && st.over === i + 1 && st.overT > 20 ? st.overT - 20 : -1;
    const F = gfx[i], x = p.x / S, y = p.y / S;
    if (F.stick) { // a stick fighter: a skeleton posed from the sim state, drawn with brush strokes
      const m = M.mv[i][p.mv], atk = p.st === ST.ATK;
      // Bat Swarm: she is a cloud of bats while it rises, and reforms at the end
      if (atk && F.style.batForm === p.mv && p.t >= m.su && p.t < m.su + m.ac) return;
      // after a hard landing she holds a one-knee pose for a beat
      const since = st ? st.f - fx.landF[i] : 99, hero = p.ground && fx.landVy[i] > 1250 && since < 16 ? 1 - since / 16 : 0;
      const pp = hero ? { ...p, hero } : p;
      // speed: colour-split ghosts trail anything fast, cyan then violet, as in stick-fight animation
      const sp = Math.hypot(p.vx, p.vy);
      if (alpha === 1 && (sp > 1000 || p.st === ST.DASH || (p.st === ST.DODGE && !p.ground))) {
        const q = Stick.pose(F, pp, f, M.mv[i], Sim, win), k = Math.min(1, sp / 1800);
        for (const [back, c, al] of [[2.6, "#b45cff", 0.32], [1.3, "#36e6ff", 0.45]]) {
          g.save(); g.translate(Math.round(x - (p.vx / S) * back), Math.round(y - (p.vy / S) * back)); g.scale(p.face, 1);
          g.globalAlpha = al * (0.5 + 0.5 * k); Stick.draw(g, F, q, { tint: 1, tintColor: c, f, noProp: !p.wpn }); g.restore();
        }
      }
      // a body moving very fast becomes a streak: lines in its own colour drawn back along the flight
      if (alpha === 1 && sp > 1600 && (p.st === ST.HIT || p.st === ST.DODGE || p.st === ST.DASH)) {
        const ux = p.vx / sp, uy = p.vy / sp, L = Math.min(3.4, sp / 1000) * F.h * 0.55, col = F.style.color;
        g.save(); g.lineCap = "round";
        for (const [h, w, l, al] of [[0.85, 3, 1, 0.55], [0.5, 4.5, 1.25, 0.65], [0.2, 2.5, 0.8, 0.45], [0.65, 1.5, 1.5, 0.35]]) {
          const ox = x - ux * F.h * 0.1, oy = y - F.h * h, ex = ox - ux * L * l, ey = oy - uy * L * l;
          const gr = g.createLinearGradient(ox, oy, ex, ey);
          gr.addColorStop(0, col); gr.addColorStop(1, "rgba(255,255,255,0)");
          g.globalAlpha = al; g.strokeStyle = gr; g.lineWidth = w; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ex, ey); g.stroke();
        }
        g.restore();
      }
      g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(p.face, 1);
      if (p.juice) { g.rotate(p.juice.rot); g.scale(p.juice.sx, p.juice.sy); }
      // the blade's path: a ribbon swept through where the steel was over the last frames, bright at the edge
      if (atk && alpha === 1 && p.wpn && p.t >= m.su - 1 && p.t < m.su + m.ac + 3) {
        const path = [];
        for (let back = 0; back <= 4; back++) {
          const t = p.t - back;
          if (t < m.su - 1) break;
          const b = Stick.blade(F, Stick.pose(F, { ...pp, t }, f, M.mv[i], Sim, win));
          if (b) path.push(b);
        }
        if (path.length > 1) {
          const n = path[0].length - 1, at = (bl, u) => bl[Math.round(u * n)];
          for (let k = path.length - 2; k >= 0; k--) {
            const a0 = path[k], a1 = path[k + 1], fade = 1 - k / (path.length - 1);
            g.globalAlpha = 0.55 * fade + 0.15;
            g.fillStyle = k === 0 ? "#ffffff" : mixHex(F.style.color, "#ffffff", 0.55);
            g.beginPath(); g.moveTo(...at(a0, 1)); g.lineTo(...at(a1, 1)); g.lineTo(...at(a1, 0.7)); g.lineTo(...at(a0, 0.7)); g.closePath(); g.fill();
          }
          g.globalAlpha = 0.9; g.strokeStyle = "#ffffff"; g.lineWidth = 2; g.lineCap = "round";
          g.beginPath(); g.moveTo(...at(path[0], 1)); for (const bl of path.slice(1)) g.lineTo(...at(bl, 1)); g.stroke(); // the edge of the swing
        }
      }
      g.globalAlpha = alpha;
      Stick.draw(g, F, Stick.pose(F, pp, f, M.mv[i], Sim, win), { tint, tintColor, vx: p.vx * p.face, vy: p.vy, f, noProp: !p.wpn });
      g.restore();
      return;
    }
    const ps = Render.pose(F, p, f, M.mv[i], Sim, win);
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
    if (p.juice) { g.rotate(p.juice.rot); g.scale(p.juice.sx, p.juice.sy); } // squash, stretch and lean about the feet
    if (rot) { g.translate(0, -F.h / 2); g.rotate(rot); g.translate(0, F.h / 2); } // remapped sheet, turned about the body centre
    if (p.st === ST.HIT && p.launch > 2600 && !F.sheets.tumble) { g.translate(0, -F.h / 2); g.rotate((f % 24) / 24 * Math.PI * 2 * -1); g.translate(0, F.h / 2); }
    if (halo) { g.shadowColor = halo; g.shadowBlur = 3 * dpr; }
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(src, sx, 0, cell, cell, -sh.pivot[0] * sc, (-sh.pivot[1] + sh.dy[k]) * sc, sh.size * sc, sh.size * sc);
    g.restore();
  }
  // Squash, stretch and lean, render only: the clips are smooth generated motion, so the snap the
  // reference gets from drawn key poses comes from here. Landing squashes, take-off stretches,
  // running and drifting lean into the motion, a dash leans hard, a strike stretches toward its
  // target after a short anticipation squash, and a skid pinches for a few frames.
  function juice(s, i, p, m) {
    let sx = 1, sy = 1, rot = 0;
    const land = s.f - fx.landF[i], take = s.f - fx.jumpF[i], turn = s.f - fx.turnF[i];
    if (p.ground && land < 7) { const k = 1 - land / 7; sy -= 0.16 * k; sx += 0.12 * k; }
    if (!p.ground && take < 6) { const k = 1 - take / 6; sy += 0.14 * k; sx -= 0.1 * k; }
    if (turn < 4) sx *= 0.86 + 0.035 * turn;
    const fwd = p.vx * p.face;
    if (p.st === ST.DASH) { rot += 0.16; sx *= 1.06; sy *= 0.97; }
    else if (p.st === ST.IDLE && p.ground && fwd > 300) rot += 0.07 * Math.min(1, fwd / 900);
    else if (!p.ground && p.st !== ST.HIT) { rot += Math.max(-0.08, Math.min(0.08, fwd / 9500)); if (p.vy > 1400) { sy *= 1.06; sx *= 0.96; } }
    if (p.st === ST.ATK && m) {
      const up = p.mv === 3 || p.mv === 6, down = p.mv === 8 || p.mv === 9;
      if (p.t >= m.su - 3 && p.t < m.su) { sx *= 0.94; sy *= 1.05; }                        // anticipation
      else if (p.t >= m.su && p.t < m.su + 2) { if (up || down) { sy *= 1.1; sx *= 0.94; } else { sx *= 1.1; sy *= 0.95; } } // the strike
    }
    return { sx, sy, rot };
  }
  // speed lines: thin streaks trailing anything moving very fast (dashes, dodges, launches, dives)
  function speedLines(s, i, p) {
    const v = Math.hypot(p.vx, p.vy);
    if (v < 1300) return;
    const ux = p.vx / v, uy = p.vy / v, body = gfx[i].h, cx = p.x / S, cy = p.y / S - body * 0.5, k = Math.min(1, (v - 1300) / 1500);
    g.save(); g.strokeStyle = "rgba(255,250,240,0.7)"; g.lineCap = "round";
    for (let j = 0; j < 5; j++) {
      const off = ((j * 37 + s.f * 13) % 100) / 100 - 0.5, len = body * (0.6 + 0.8 * k) * (0.6 + ((j * 53) % 40) / 100);
      const ox = -uy * off * body * 1.1, oy = ux * off * body * 1.1, st0 = body * (0.45 + ((j * 29) % 30) / 100);
      g.globalAlpha = 0.35 + 0.4 * k; g.lineWidth = 1.2 + (j % 2);
      g.beginPath(); g.moveTo(cx + ox - ux * st0, cy + oy - uy * st0); g.lineTo(cx + ox - ux * (st0 + len), cy + oy - uy * (st0 + len)); g.stroke();
    }
    g.restore();
  }
  function drawFighter(s, i) {
    const p = s.p[i];
    if (p.st === ST.DEAD) return;
    speedLines(s, i, p);
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
    if (p.st === ST.HIT && s.hv === i && s.ha === 0 && age < (launched ? 24 : 9)) { tint = age < (launched ? 18 : 6) ? 1 : 0.55; tintColor = dmgColor(Math.max(45, p.dmg)); } // never white: yellow from the first hit
    if (p.st === ST.HIT && launched && age < 16 && (p.vx || p.vy)) { // launch smear: two copies trail back along the flight line
      const v = Math.hypot(p.vx, p.vy), ux = p.vx / v, uy = p.vy / v, len = Math.min(1.4, p.launch / 3000) * gfx[i].h;
      for (const [k, al] of [[0.6, 0.45], [1, 0.22]]) drawSprite(i, { ...p, x: p.x - ux * len * k * S, y: p.y - uy * len * k * S }, s.f, al, 1, null, dmgColor(Math.max(45, p.dmg)));
    }
    if (p.st === ST.ATK && m.su >= 8 && p.t >= m.su && p.t < m.su + m.ac + 2) // heavy attacker: white streak behind the strike
      drawSprite(i, { ...p, x: p.x - p.face * 14 * S }, s.f, 0.4, 1, null, "#fff");
    if (p.st === ST.ATK && p.chg > 0 && p.t === m.su - 1) tint = 0.25 + 0.25 * Math.sin(s.f * 0.8); // a held heavy pulses while it charges
    if (s.ha === 1 && s.hv === i && s.f - s.hf < 6) tint = 0.45;                         // armor took the hit
    const blink = p.inv > 0 && Math.floor(s.f / 6) % 2 === 0;
    const jitter = p.st === ST.HIT && s.freeze > 0 ? (rnd() - 0.5) * 4 : 0;
    g.save(); g.translate(jitter, 0);
    const evading = p.st === ST.DODGE || p.st === ST.DASH;
    if (evading && !gfx[i].stick) { // afterimages trail behind a dodge or dash so it reads as movement, not a fade
      const trail = fx.after[i];
      for (let k = trail.length - 1; k >= 0; k--) drawSprite(i, { ...p, x: trail[k].x, y: trail[k].y }, s.f, 0.32 - k * 0.07, 1, null, style(i).after || TEAM[i]);
      if (p.st === ST.DODGE && !tint) { tint = 0.18 + 0.14 * Math.sin(s.f * 1.3); tintColor = "#ffffff"; } // invulnerable shimmer
    }
    drawSprite(i, { ...p, juice: juice(s, i, p, m) }, s.f, blink ? 0.55 : 1, tint, "rgba(8,3,18,0.7)", tintColor);
    g.restore();
    if (showBoxes) {
      g.strokeStyle = "rgba(80,200,255,.9)"; g.lineWidth = 1;
      g.strokeRect(x - M.ph[i].hw / S, y - M.ph[i].h / S, (M.ph[i].hw * 2) / S, M.ph[i].h / S);
      if (p.st === ST.ATK && p.t >= m.su && p.t < m.su + m.ac) {
        const b = M.box(p, m).map((v) => v / S);
        g.fillStyle = "rgba(255,60,60,.35)"; g.fillRect(b[0], b[2], b[1] - b[0], b[3] - b[2]);
      }
    }
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
    if (under) { drawCracks(); return; }
    for (const q of fx.parts) { g.globalAlpha = Math.min(1, q.life * 1.5); g.fillStyle = q.c; g.beginPath(); g.arc(q.x, q.y, q.size * 0.7, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    drawMarks();
    for (const q of fx.petals) { g.globalAlpha = Math.min(1, q.life * 2); Flair.petal(g, q.x, q.y, q.size, q.rot, q.c, "rgba(190,60,110,0.45)"); }
    for (const b of fx.bats) { g.globalAlpha = Math.min(1, b.life * 2.2); Flair.bat(g, b.x, b.y, b.size, b.ph, Math.atan2(b.vy, Math.abs(b.vx) + 0.01) * 0.35, "#1a0a14", "#ff3d64"); }
    g.globalAlpha = 1;
  }
  // marks: pierce glints, rings, the parry canopy and ward, KO crests
  // stage cracks from a slam: jagged lines fanned into the surface, dark under a pale edge
  function drawCracks() {
    for (const m of fx.marks) {
      if (m.kind !== "crack") continue;
      let r = m.seed; const rr = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
      const grow = Math.min(1, m.t / 4), fade = m.t > m.life - 40 ? (m.life - m.t) / 40 : 1;
      g.save(); g.translate(m.x, m.y); g.rotate(m.ang); g.globalAlpha = fade; g.lineCap = "round"; g.lineJoin = "round";
      for (let j = 0; j < m.n; j++) {
        const a0 = (j / (m.n - 1) - 0.5) * 2.3 + (rr() - 0.5) * 0.25, len = m.r * (0.55 + 0.6 * rr()) * grow;
        const pts = [[0, 0]]; let ax = 0, ay = 0;
        for (let q = 1; q <= 4; q++) { const a = a0 + (rr() - 0.5) * 0.7; ax += Math.cos(a) * len / 4; ay += Math.sin(a) * len / 4; pts.push([ax, ay]); }
        for (const [w, c] of [[5, "rgba(255,235,200,0.3)"], [3, "#140906"]]) {
          g.lineWidth = w * (j % 2 ? 0.65 : 1); g.strokeStyle = c; g.beginPath(); g.moveTo(0, 0);
          for (const [px, py] of pts) g.lineTo(px, py);
          g.stroke();
        }
        if (rr() < 0.6) { const [bx, by] = pts[2], a = a0 + (rr() < 0.5 ? 0.7 : -0.7); g.lineWidth = 2; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a) * len * 0.3, by + Math.sin(a) * len * 0.3); g.stroke(); }
      }
      g.fillStyle = "#140906"; g.beginPath(); g.ellipse(0, 0, m.r * 0.08, m.r * 0.22, 0, 0, 7); g.fill(); // the dent
      g.restore();
    }
  }
  function drawMarks() {
    for (const m of fx.marks) {
      const k = m.t / m.life, fade = 1 - k;
      g.save();
      if (m.kind === "bubble") { // a translucent shockwave sphere with a flat ring through it
        const r = m.r * (0.3 + 0.9 * (1 - (1 - k) * (1 - k)));
        g.globalAlpha = fade * 0.75;
        const rg = g.createRadialGradient(m.x, m.y, r * 0.2, m.x, m.y, r);
        rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(0.75, "rgba(255,240,245,0.25)"); rg.addColorStop(1, "rgba(255,255,255,0.7)");
        g.fillStyle = rg; g.beginPath(); g.arc(m.x, m.y, r, 0, 7); g.fill();
        g.lineWidth = 2; g.strokeStyle = "rgba(40,20,40,0.5)"; g.stroke();
        g.lineWidth = 3 * fade + 1; g.strokeStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(m.x, m.y, r * 1.6, r * 0.22, 0, 0, 7); g.stroke();
      } else if (m.kind === "text") { // a comic callout that pops, rises and fades
        const pop = m.t < 5 ? 0.6 + m.t * 0.12 : 1.2 - Math.min(0.2, (m.t - 5) * 0.02);
        g.translate(m.x, m.y - m.t * 0.6); g.rotate(-0.08); g.scale(pop, pop); g.globalAlpha = Math.min(1, fade * 2);
        g.font = `italic 900 ${m.size}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
        g.lineWidth = m.size * 0.22; g.strokeStyle = "#14060f"; g.strokeText(m.text, 0, 0);
        g.fillStyle = m.text === "FINISH!" ? "#ffd36b" : "#ffffff"; g.fillText(m.text, 0, 0);
      } else if (m.kind === "burst") { // impact lines: thin white wedges thrown out from the contact point
        g.translate(m.x, m.y); g.rotate(m.rot); g.globalAlpha = fade; g.fillStyle = "#ffffff"; g.strokeStyle = "#14060f"; g.lineWidth = 1.2;
        for (let j = 0; j < m.n; j++) {
          const a = (j / m.n) * Math.PI * 2 + (j % 2) * 0.3, r0 = m.r * (0.25 + 0.5 * k), r1 = m.r * (0.75 + 0.45 * k) * (j % 2 ? 0.7 : 1), w = m.r * 0.07 * fade;
          g.beginPath(); g.moveTo(Math.cos(a) * r0 - Math.sin(a) * w, Math.sin(a) * r0 + Math.cos(a) * w); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
          g.lineTo(Math.cos(a) * r0 + Math.sin(a) * w, Math.sin(a) * r0 - Math.cos(a) * w); g.closePath(); g.fill(); g.stroke();
        }
      } else if (m.kind === "pierce") { // a long thin glint straight through the target
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
        } else if (gfx[m.i].stick) { // a stick fighter parries with the blade: a bright arc swept across the guard
          g.globalAlpha = Math.min(1, fade * 1.6); g.lineCap = "round"; const r = body * (0.45 + 0.15 * Math.min(1, m.t / 4));
          g.lineWidth = 7; g.strokeStyle = "#14060f"; g.beginPath(); g.arc(-body * 0.1, 0, r, -1.2, 1.2); g.stroke();
          g.lineWidth = 4; g.strokeStyle = "#ffffff"; g.stroke(); g.lineWidth = 2; g.strokeStyle = gfx[m.i].style.color; g.beginPath(); g.arc(-body * 0.1, 0, r - 4, -1.1, 1.1); g.stroke();
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
    const hit = s.hf >= 0 && s.f - s.hf < 8 && s.p[s.hv] === p, jig = hit ? (rnd() - 0.5) * r * 0.25 : 0;
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
    const right = W - 26 * u, n = s.p.length;
    const cxOf = (i) => right - r - (n - 1 - i) * r * 2.85, cx1 = cxOf(0);
    // match timer: 8 minutes from the end of the countdown
    const left = Math.max(0, 8 * 60 - Math.max(0, s.f - FEEL.countdown) / 60);
    const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(Math.floor(left % 60)).padStart(2, "0");
    italic(`${mm}:${ss}`, cx1 - r * 1.55, top + r * 0.45, 17 * u, "#ffffff", "right");
    s.p.forEach((p, i) => portrait(i, p, cxOf(i), top + r * 0.15, r, s));

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
    // the winner first, then whoever lasted longest (fewest damage breaks a tie)
    const n = s.p.length, order = [wi, ...s.p.map((_, i) => i).filter((i) => i !== wi).sort((a, b) => (fx.outF[b] < 0 ? 1e9 : fx.outF[b]) - (fx.outF[a] < 0 ? 1e9 : fx.outF[a]) || s.p[a].dmg - s.p[b].dmg)];
    const gap = n === 2 ? Math.min(W * 0.22, 210 * u) * 2 : Math.min((W - 40 * u) / n, 230 * u), cu = n === 2 ? u : Math.min(u, gap / (230 * u) * u);
    order.forEach((i, rank) => {
      const cx = W / 2 + (rank - (n - 1) / 2) * gap, top = H * (rank === 0 ? 0.5 : 0.57) + (1 - k) * 80 * u;
      pillar(cx, top, 200 * cu, i);
      const p = s.p[i], sc = 2.2 * cu;
      g.save(); g.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * cx, dpr * (top - 6 * u));
      drawSprite(i, { ...p, x: 0, y: 0, st: ST.IDLE, ground: 1, vx: 0, vy: 0, face: rank === 0 ? 1 : -1, inv: 0 }, s.f, 1, 0, "rgba(8,3,18,0.7)");
      g.restore();
      statsCard(cx, top + 70 * u, 210 * cu, i, rank, cu);
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
    g.fillText(["1st", "2nd", "3rd", "4th"][rank], cx, y - 6 * u);
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

  // thrown weapons: point first in flight with a streak behind, tumbling when knocked loose, and a
  // pulsing glint while stuck so its owner can find it
  function drawBlades(s) {
    s.p.forEach((p, i) => {
      if (!gfx[i] || !gfx[i].stick || !p.ws) return;
      const x = p.wx / S, y = p.wy / S, sp = Math.hypot(p.wvx, p.wvy) || 1;
      g.save();
      if (p.ws === 1) {
        const ux = p.wvx / sp, uy = p.wvy / sp, L = gfx[i].h * 1.6, gr = g.createLinearGradient(x, y, x - ux * L, y - uy * L);
        gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.strokeStyle = gr; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x - ux * L, y - uy * L); g.stroke();
      }
      Stick.drawThrown(g, gfx[i], x, y, p.wvx, p.wvy, p.ws === 3 ? (s.f * 31 + i * 47) % 360 : 0);
      if (p.ws === 2) {
        const k = (s.f + i * 13) % 50, a = k < 12 ? Math.sin((k / 12) * Math.PI) : 0, deg = Math.atan2(p.wvx, p.wvy), L = Stick.WEAPONS[gfx[i].style.prop].len * gfx[i].h;
        const gx = x - Math.sin(deg) * L * 0.55, gy = y - Math.cos(deg) * L * 0.55; // the glint runs along the blade
        g.save(); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.translate(gx, gy); g.rotate(s.f * 0.1);
        g.beginPath(); for (let j = 0; j < 8; j++) { const r = j % 2 ? 2 : 9; g.lineTo(Math.cos((j * Math.PI) / 4) * r, Math.sin((j * Math.PI) / 4) * r); } g.closePath(); g.fill();
        g.restore();
        g.globalAlpha = 0.85; g.strokeStyle = TEAM[i]; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y + 2, 14, 3.5, 0, 0, 7); g.stroke(); // the owner's colour where it bit in
      }
      g.restore();
    });
  }
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
    const age = s.f - s.hf, hitNow = p.st === ST.HIT && s.hv === i && age < 24;
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
    if (!st.fin) drawFx(true); // dust under the fighters would only read as a grey lump in the darkened finisher
    if (st.fin > 0) finisherWorld(st);
    else { drawBlades(st); for (let t = 0; t < st.p.length; t++) drawFighter(st, t); drawSmears(); }
    drawFx();
    for (let t = 0; t < st.p.length; t++) bubble(st, t, z);
    g.restore();
    drawAtmosphere();
    hud(st);
    if (st.fin > 0) finisherOverlay(st);
  }
  // ---------- finishers ----------
  // A charged side heavy on a fighter at 150%+ holds the game for FEEL.finFrames while this plays:
  // the world darkens, she bursts into bats and strikes six times from six angles, each pass a
  // white streak through the victim, then lands behind them, back turned; the sim launches them.
  const FIN_NAME = { "stick-vespera": "NIGHTFALL WALTZ", "stick-saif": "STORM OF THE SASH", "vampire-countess": "NIGHTFALL WALTZ", "djinn-warrior": "STORM OF THE SASH",
    "stick-marjana": "FORTY CUTS", "stick-dana": "TIDE OF FANS", "stick-nawaf": "STOOPING FALCON" };
  const FIN = { open: 14, slash: 9, count: 6 };
  function finT(s) { return FEEL.finFrames - s.fin; }
  // where the attacker strikes from on pass k: alternating sides, always from above the ground
  const FIN_ANG = [-0.12, -0.88, -0.38, -0.62, -0.02, -0.98].map((t) => t * Math.PI);
  function finSpot(s, k) {
    const v = s.p[s.fv], body = gfx[s.fv].h, a = FIN_ANG[k % FIN_ANG.length];
    return { x: v.x / S + Math.cos(a) * body * 1.1, y: v.y / S + Math.sin(a) * body * 0.9 + body * 0.15 };
  }
  function finisherWorld(s) {
    const T = finT(s), a = s.fa, vi = s.fv, A = s.p[a], V = s.p[vi], mvA = M.mv[a][5];
    const k = Math.floor((T - FIN.open) / FIN.slash), local = (T - FIN.open) % FIN.slash, slashing = T >= FIN.open && k < FIN.count;
    // the world behind the two fighters falls into shadow
    g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = `rgba(12,4,20,${Math.min(0.62, T / 10 * 0.62)})`; g.fillRect(0, 0, W, H); g.restore();
    // the victim: held in a hurt pose, jolting and flashing on every pass
    const jolt = slashing && local < 3;
    drawSprite(vi, { ...V, st: ST.HIT, launch: 0, t: 20, vx: 0, vy: 0, x: V.x + (jolt ? (k % 2 ? 5 : -5) * S : 0) }, s.f, 1, jolt ? 1 : 0, null, "#ffffff");
    if (T < FIN.open) { // the wind-up: the parasol opens beside the victim she just hit
      drawSprite(a, { ...A, x: V.x - A.face * 55 * S, face: A.face, st: ST.IDLE, ground: 1, vx: 0, vy: 0, winPose: T * 3 }, s.f, 1, 0, null);
    } else if (slashing) {
      const p0 = k ? finSpot(s, k - 1) : { x: V.x / S - A.face * 55, y: V.y / S }, p1 = finSpot(s, k);
      if (local < 5) { // the pass: a white streak from where she was, through the victim, to where she is
        const fade = 1 - local / 5;
        g.save(); g.lineCap = "round";
        for (const [w, c] of [[9, "rgba(20,4,12,0.5)"], [6, style(a).trail || "#ffffff"], [2.5, "#ffffff"]]) {
          g.globalAlpha = fade; g.strokeStyle = c; g.lineWidth = w * fade + 1;
          g.beginPath(); g.moveTo(p0.x, p0.y - 30); g.quadraticCurveTo(V.x / S, V.y / S - 40, p1.x, p1.y - 30); g.stroke();
        }
        g.restore();
      }
      const face = p1.x < V.x / S ? 1 : -1;
      drawSprite(a, { ...A, x: p1.x * S, y: p1.y * S, face, st: ST.ATK, mv: 5, t: mvA.su + Math.min(2, local), ground: 0, chg: 0, vx: 0, vy: 0 }, s.f, 1, local < 2 ? 0.4 : 0, null, "#ffffff");
    } else { // behind the victim, back turned, the parasol furling
      drawSprite(a, { ...A, st: ST.IDLE, ground: 1, vx: 0, vy: 0 }, s.f, 1, 0, null);
    }
    drawFx();
  }
  function finisherOverlay(s) {
    const T = finT(s), u = Math.min(W / 1280, H / 720), bar = Math.min(1, T / 8) * H * 0.11;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#08030f"; g.fillRect(0, 0, W, bar); g.fillRect(0, H - bar, W, bar); // letterbox
    if (T > 4 && T < FEEL.finFrames - 6) {
      const pop = T < 10 ? 1.5 - (T - 4) / 12 : 1;
      g.save(); g.translate(W / 2, H * 0.2); g.scale(pop, pop);
      display("FINISHER", 0, 0, 74 * u, { ghost: T < 7, alpha: T < 7 ? 0.5 : 1 });
      g.restore();
      g.font = `${22 * u}px "Lilita One", "Arial Black", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffd36b";
      g.fillText(FIN_NAME[pick[s.fa]] || "FINISHER", W / 2, H * 0.2 + 52 * u);
    }
    if (T >= FEEL.finFrames - 4) { g.fillStyle = `rgba(255,255,255,${(T - FEEL.finFrames + 4) / 4 * 0.8})`; g.fillRect(0, 0, W, H); } // the release flash
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
    // every fighter's input: the humans' keys and pads, bots for the rest (players 3 and 4 are
    // humans in local play when a gamepad is plugged in for them)
    const ins = st.p.map((_, i) => {
      if (mode === "demo" || !isHuman(i)) return bot(st, i, mode === "demo" ? 2 : 1);
      if (mode === "bot") return read(SOLO) | pad(0);
      return (i === 0 ? read(P1) : i === 1 ? read(P2) : 0) | pad(i);
    });
    // rematch: a human presses jump or light (the bots' own presses never restart the match)
    const human = ins.reduce((v, x, i) => (mode !== "demo" && isHuman(i) ? v | x : v), 0);
    if (st.over && st.overT > 60 && (human & (IN.J | IN.A) || (mode === "demo" && st.overT > 420))) { st = M.create(); fx.reset(); return; } // watch mode shows the results first
    M.step(st, ins);
    events(st); stepFx(); updateCam(st);
  }
  // who plays which slot in local modes: vs bot is one human; local play is two on the keyboard
  // plus anyone with a gamepad in slots 3 and 4
  function isHuman(i) {
    if (mode === "bot") return i === 0;
    if (mode === "local") return i < 2 || !!(navigator.getGamepads && navigator.getGamepads()[i]);
    return false;
  }
  const dbg = { paused: false }; // test hook: freezes the sim for screenshots
  // test hook: advance exactly n frames with fixed inputs while paused, for frame-exact captures
  dbg.su = (i) => M.mv[i][st.p[i].mv].su;
  dbg.tick = (n = 1) => { for (let k = 0; k < n; k++) tick(); }; // the real loop step (bots, rematch) while paused
  dbg.step = (n, ...ins) => { for (let k = 0; k < n; k++) { M.step(st, st.p.map((_, i) => ins[i] || 0)); events(st); stepFx(); updateCam(st); } };
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
    "Slide down a wall and jump off it to get back to the stage.",
    "Land a hit, then dodge: a chase dodge ignores the cooldown, and an attack cancels it.",
    "Dodge in place and attack at once: you get your air attack on the ground.",
    "Air dodges recharge slowly. Land a while after one to get it back sooner.",
    "Missing an attack leaves you open: your dodge is locked for a moment.",
    "Foe at 150% or more? Hold heavy to charge a side heavy: if it lands, it is a finisher.",
    "Throw your weapon with I or V. Walk over it to pick it up; until then, fists hit softer.",
    "Swing into a swing and the blades clash: both of you are thrown back."];
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
    const n = pick.length, cw = n === 2 ? Math.min(280 * u, W * 0.36) : Math.min(260 * u, (W - 40 * u) / n - 14 * u), ch = cw * 1.55, gap = n === 2 ? Math.min(150 * u, W * 0.1) : 14 * u;
    pick.forEach((id, i) => {
      const slide = Math.max(0, 1 - t / 16), ease = slide * slide, side = i < n / 2 ? -1 : 1;
      const cx = n === 2 ? W / 2 + (i ? 1 : -1) * (gap / 2 + cw / 2) + (i ? 1 : -1) * ease * W * 0.6 : W / 2 + (i - (n - 1) / 2) * (cw + gap) + side * ease * W * 0.6, cy = H * 0.52;
      card(id, i, cx, cy, cw, ch, cw / 280);
    });
    g.save(); g.translate(W / 2, n === 2 ? H * 0.52 : H * 0.14); display(n === 2 ? "VS" : "FREE FOR ALL", 0, 0, (n === 2 ? 90 : 52) * u, { alpha: Math.min(1, Math.max(0, (t - 10) / 8)) }); g.restore();
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

  // ---------- online: rollback over WebRTC data channels (game/net.js), 2 to 4 players ----------
  // PeerJS's free public server only introduces the browsers; the match itself runs peer to peer.
  // A room is a 5 letter code. The host is a hub: each guest connects to the host only, and the
  // host relays every guest's input packets to the others. The host plays slot 0 and starts the
  // match once at least one friend is in the lobby. Add TURN servers in game/net-config.js if
  // friends on strict networks (mobile hotspots, some ISPs) cannot connect.
  const ROOM = "dune-brawl-v1-", MAX_PLAYERS = 4;
  const ICE = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun.cloudflare.com:3478" }].concat(window.DUNE_TURN || []);
  // every player must run the same rules: a mismatch would desync, so it refuses to start instead
  const VERSION = (() => { let h = 5381; for (const c of JSON.stringify([FEEL, Object.keys(FIGHTERS)])) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h.toString(36); })();
  // host: guests[] = { c, slot, pick, live }; guest: host = the connection to the host
  const net = { peer: null, host: null, guests: [], me: 0, picks: null, session: null, queue: [], rtt: 0, started: false, loading: false, timer: 0, code: "" };
  const say = (t) => { document.getElementById("netStatus").textContent = t; };
  const lobbyEl = () => document.getElementById("netLobby"), startBtn = () => document.getElementById("bStart");
  function newCode() {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let c = "";
    for (let k = 0; k < 5; k++) c += a[Math.floor(Math.random() * a.length)];
    return c;
  }
  function leaveOnline(why) {
    clearInterval(net.timer);
    const peer = net.peer, conns = net.guests.map((q) => q.c).concat(net.host ? [net.host] : []);
    for (const c of conns) { try { if (c.open) c.send({ t: "bye" }); c.close(); } catch (e) { /* already gone */ } }
    Object.assign(net, { peer: null, host: null, guests: [], session: null, queue: [], picks: null, started: false, loading: false, code: "" });
    if (peer) peer.destroy();
    showLobby(null);
    if (why) say(why);
  }
  // the lobby list under the online buttons: who is in, in slot order
  function showLobby(picks) {
    const el = lobbyEl();
    if (!picks) { el.hidden = true; startBtn().hidden = true; return; }
    el.hidden = false;
    el.innerHTML = picks.map((id, i) => `<li style="--c:${TEAM[i]}"><b>P${i + 1}</b> ${FIGHTERS[id] ? FIGHTERS[id].name : "?"}${i === net.me ? " (you)" : i === 0 ? " (host)" : ""}</li>`).join("");
    startBtn().hidden = net.me !== 0;
    startBtn().disabled = picks.length < 2;
  }
  const lobbyPicks = () => [slots[0], ...net.guests.map((q) => q.pick)];
  function broadcast(msg, except) { for (const q of net.guests) if (q.c !== except && q.c.open) q.c.send(msg); }
  function hostRoom() {
    if (!window.Peer) return say("The online library did not load. Check your connection and refresh.");
    leaveOnline();
    const code = newCode();
    net.code = code; net.me = 0;
    net.peer = new Peer(ROOM + code, { config: { iceServers: ICE } });
    say("Opening a room...");
    net.peer.on("open", () => {
      const link = `${location.origin}${location.pathname}?join=${code}`;
      document.getElementById("netLink").hidden = false;
      document.getElementById("netLinkText").value = link;
      say(`Room ${code} is open for up to ${MAX_PLAYERS} players. Send friends the link, then press Start.`);
      showLobby(lobbyPicks());
      // keep the lobby fresh on every guest: the channel may drop messages
      net.timer = setInterval(() => {
        const picks = lobbyPicks();
        for (const q of net.guests) if (q.c.open) {
          q.c.send(net.started || net.loading ? { t: "start", picks: net.picks, you: q.slot, ver: VERSION } : { t: "lobby", picks, you: q.slot, ver: VERSION });
          q.c.send({ t: "ping", ts: performance.now() });
        }
      }, 250);
    });
    net.peer.on("connection", (c) => {
      if (net.guests.length >= MAX_PLAYERS - 1 || net.started || net.loading) { c.on("open", () => { c.send({ t: "full" }); setTimeout(() => c.close(), 500); }); return; }
      const q = { c, slot: -1, pick: null };
      c.on("data", (m) => hostData(q, m));
      c.on("close", () => guestGone(q));
      c.on("error", () => guestGone(q));
    });
    net.peer.on("error", (e) => (e.type === "unavailable-id" ? hostRoom() : say(`Online error: ${e.type}. Try again.`)));
  }
  function hostData(q, m) {
    const c = q.c;
    if (m.t === "ping") return c.send({ t: "pong", ts: m.ts });
    if (m.t === "pong") { net.rtt = net.rtt ? net.rtt * 0.8 + (performance.now() - m.ts) * 0.2 : performance.now() - m.ts; return; }
    if (m.t === "bye") return guestGone(q);
    if (m.t === "hello") {
      if (m.ver !== VERSION) { c.send({ t: "old" }); return; }
      if (q.slot < 0 && FIGHTERS[m.pick] && !net.started && !net.loading) {
        q.pick = m.pick; net.guests.push(q); q.slot = net.guests.length;
        showLobby(lobbyPicks());
        say(`${net.guests.length + 1} of ${MAX_PLAYERS} players in room ${net.code}. Press Start when everyone is in.`);
      }
      return;
    }
    if (m.t === "i" || m.t === "h") { // a guest's input or hash: use it, and pass it on to the other guests
      broadcast(m, c);
      if (net.session) net.session.receive(m); else net.queue.push(m);
    }
  }
  function guestGone(q) {
    if (!net.guests.includes(q)) return;
    if (net.started || net.loading) { // a player left mid-match: the match cannot go on without their inputs
      broadcast({ t: "end", why: `Player ${q.slot + 1} left the match.` });
      leaveOnline(`Player ${q.slot + 1} left the match.`); showMenu(); return;
    }
    net.guests = net.guests.filter((x) => x !== q);
    net.guests.forEach((x, k) => (x.slot = k + 1)); // close the gap in the lobby
    showLobby(lobbyPicks());
    say(`${net.guests.length + 1} of ${MAX_PLAYERS} players in room ${net.code}.`);
  }
  function hostStart() {
    if (net.me !== 0 || !net.peer || net.guests.length < 1 || net.loading || net.started) return;
    net.picks = lobbyPicks(); net.loading = true;
    broadcast({ t: "start", picks: net.picks, ver: VERSION });
    startOnline();
  }
  function joinRoom(raw) {
    const code = raw.trim().toUpperCase();
    if (!window.Peer) return say("The online library did not load. Check your connection and refresh.");
    if (code.length !== 5) return say("Type the 5 letter room code first.");
    leaveOnline();
    net.code = code;
    net.peer = new Peer({ config: { iceServers: ICE } });
    say(`Joining room ${code}...`);
    net.peer.on("open", () => {
      const c = net.peer.connect(ROOM + code, { reliable: false, serialization: "json" });
      net.host = c;
      c.on("open", () => {
        say("Connected. Waiting for the host to start...");
        net.timer = setInterval(() => {
          if (!c.open) return;
          if (!net.started) c.send({ t: "hello", pick: slots[0], ver: VERSION }); // repeated: the channel may drop it
          c.send({ t: "ping", ts: performance.now() });
        }, 250);
      });
      c.on("data", (m) => {
        if (m.t === "ping") return c.send({ t: "pong", ts: m.ts });
        if (m.t === "pong") { net.rtt = net.rtt ? net.rtt * 0.8 + (performance.now() - m.ts) * 0.2 : performance.now() - m.ts; return; }
        if (m.t === "full") return say(`Room ${code} is full or already playing.`);
        if (m.t === "old") return say("The host has a different version of the game. Both of you refresh the page.");
        if (m.t === "end" || m.t === "bye") { leaveOnline(m.why || "The host closed the room."); showMenu(); return; }
        if (m.t === "lobby") {
          if (m.ver !== VERSION) return say("The host has a different version of the game. Both of you refresh the page.");
          net.me = m.you; showLobby(m.picks);
          return say(`In room ${code} as player ${m.you + 1} of ${m.picks.length}. Waiting for the host to start...`);
        }
        if (m.t === "start") {
          if (net.loading || net.started || m.ver !== VERSION) return;
          if (m.you !== undefined) net.me = m.you;
          if (!(net.me > 0)) return; // the slot comes with the lobby; wait for it
          net.picks = m.picks; net.loading = true; startOnline();
          return;
        }
        if (m.t === "i" || m.t === "h") { net.started = true; if (net.session) net.session.receive(m); else net.queue.push(m); }
      });
      c.on("close", () => { if (net.host === c) { leaveOnline("The host left the match."); showMenu(); } });
      c.on("error", () => { if (net.host === c) { leaveOnline("The connection failed. Try again, or add a TURN server (see game/net-config.js)."); showMenu(); } });
    });
    net.peer.on("error", (e) => say(e.type === "peer-unavailable" ? `No room ${code}. Check the code with your friend.` : `Online error: ${e.type}. Try again.`));
  }
  async function startOnline() {
    if (window.Sfx) Sfx.init();
    pick = net.picks.slice();
    const t0 = performance.now(); mode = "loading"; hideMenu();
    await load(); await holdCards(t0);
    if (!net.peer) return showMenu();
    // the host sends to every guest; a guest sends to the host, which passes it on
    const send = net.me === 0 ? (msg) => broadcast(msg) : (msg) => { if (net.host && net.host.open) net.host.send(msg); };
    net.session = new Net.Session(M, net.me, send, Net.makeStep(Sim, M), pick.length);
    st = net.session.state;
    for (const m of net.queue) net.session.receive(m);
    net.queue = []; net.started = true; net.loading = false;
    mode = "online";
  }

  // ---------- menu ----------
  const menu = document.getElementById("menu");
  function showMenu() { mode = "menu"; menu.hidden = false; music("menu"); } // the menu theme (starts after the first click or key)
  function hideMenu() { menu.hidden = true; music(null); } // leaving the menu goes to loading, which is silent
  function buildPickers() {
    [0, 1, 2, 3].forEach((i) => {
      const row = document.getElementById("pick" + i);
      row.innerHTML = "";
      row.parentElement.hidden = i >= count;
      for (const id in FIGHTERS) {
        if (!FIGHTERS[id].ready) continue;
        const b = document.createElement("button");
        b.className = "chip" + (slots[i] === id ? " on" : ""); b.setAttribute("aria-pressed", slots[i] === id);
        b.innerHTML = `<i class="disc"><img alt="" src="${portraitSrc(id)}"></i><span>${FIGHTERS[id].name}${FIGHTERS[id].stick ? "<small> stick</small>" : ""}</span>`;
        b.onclick = () => { slots[i] = id; buildPickers(); if (window.Sfx) Sfx.play("uiMove", 0); };
        row.appendChild(b);
      }
    });
    document.querySelectorAll("#count button").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.n === count));
  }
  document.querySelectorAll("#count button").forEach((b) => (b.onclick = () => { count = +b.dataset.n; buildPickers(); if (window.Sfx) Sfx.play("uiMove", 0); }));
  document.getElementById("bBot").onclick = () => startMatch("bot");
  document.getElementById("bLocal").onclick = () => startMatch("local");
  document.getElementById("bDemo").onclick = () => startMatch("demo");
  document.getElementById("bOnline").onclick = () => { const o = document.getElementById("online"); o.hidden = !o.hidden; };
  document.getElementById("bHost").onclick = hostRoom;
  document.getElementById("bJoin").onclick = () => joinRoom(document.getElementById("joinCode").value);
  document.getElementById("bStart").onclick = hostStart;
  document.getElementById("bCopy").onclick = () => { const t = document.getElementById("netLinkText"); t.select(); navigator.clipboard && navigator.clipboard.writeText(t.value); say("Link copied. Send it to your friends."); };

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
