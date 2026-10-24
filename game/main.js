// Dune Brawl test build: local play (vs bot, 2 players, bot vs bot), sprites, stage, effects.
(() => {
  "use strict";
  const { S, IN, ST, STAGE, FEEL } = Sim;
  const ROOT = "..";
  // ready: shown on the select screen. art and portrait point at the v2 rework once it lands.
  const FIGHTERS = {
    "djinn-warrior": { name: "Saif", color: "#3d4fd6", glow: "#36e2d4", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "dune-ghoul": { name: "Abu Sarab", color: "#7fbf3a", glow: "#c6ff3d", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "falcon-rider": { name: "Nawaf", color: "#e9dcc0", glow: "#ffcf5a", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "sea-siren": { name: "Dana", color: "#1fb5a6", glow: "#8ff5ea", ready: 1, art: "anim-v2", portrait: "source/portrait-v2.png", basePose: "source/base-pose-v2.png" },
    "dagger-dancer": { name: "Marjana", color: "#d6337a", glow: "#ffd0e4", ready: 1 },
    "vampire-countess": { name: "Vespera", color: "#b3123a", glow: "#ff5c7a", art: "anim-v2", ready: 1 },
    "gorilla-lumberjack": { name: "Timber", color: "#c8302c", glow: "#ffb15c", art: "anim-v2" },
    "fennec-host": { name: "Finjan", color: "#f2b632", glow: "#fff0a0", art: "anim-v2" },
    "clockwork-elephant": { name: "Tiktak", color: "#c9973a", glow: "#5ff0d8", art: "anim-v2" },
    "melting-yeti": { name: "Brrr", color: "#9fd8ff", glow: "#e8fbff", art: "anim-v2", ready: 1 },
    "baby-roc": { name: "Rukhayy", color: "#2443b8", glow: "#ffd25a", art: "anim-v2" },
    "chameleon-slinger": { name: "Hirba", color: "#7ccf2a", glow: "#ff5ad0", art: "anim-v2" },
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
  async function load() {
    defs = await Promise.all(pick.map(async (id) => (await fetch(`${ROOT}/assets/fighters/${id}/moves.draft.json`)).json()));
    gfx = await Promise.all(pick.map((id, i) => Render.loadFighter(id, ROOT, { art: FIGHTERS[id].art, height: (defs[i].stats || {}).height, basePose: FIGHTERS[id].basePose })));
    await Promise.all(pick.map((id) => new Promise((ok) => { const im = new Image(); im.onload = () => { portraits[id] = im; ok(); }; im.onerror = ok; im.src = portraitSrc(id); })));
    M = Sim.match(defs[0], defs[1]); st = M.create(); fx.reset();
  }
  async function startMatch(m) { mode = "loading"; hideMenu(); await load(); mode = m; }
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
    reset() { Object.assign(this, { sprites: [], parts: [], shake: 0, lastHf: -1, lastKf: -1, koStamp: [0, 0] }); },
    // a painted sprite: grows from s0 to s1 in `pop` frames, holds, then fades over the rest of `life` frames
    add(name, x, y, opt) { this.sprites.push({ name, x, y, t: 0, rot: 0, flip: 1, s0: 0.6, s1: 1, pop: 3, life: 18, w: 80, ax: 0.5, ay: 0.5, alpha: 1, ...opt }); },
    // flat white cel effects, as in the reference: puffs stay where they were made
    puff(x, y, w, opt) { this.add(`puff${1 + Math.floor(rnd() * 4)}`, x, y, { w, rot: (rnd() - 0.5) * 0.6, s0: 0.7, s1: 1.15, pop: 6, life: 30, ...opt }); },
    kick(x, y, w, flip) { this.add(`kick${1 + Math.floor(rnd() * 3)}`, x, y, { w, ay: 0.95, flip, s0: 0.6, s1: 1, pop: 3, life: 16 }); },
  };
  function events(s) {
    if (s.hf !== fx.lastHf && s.hf >= 0) {
      fx.lastHf = s.hf;
      const x = s.hx / S, y = s.hy / S, k = s.hk / 100, heavy = k > 18;
      if (s.ha === 2) { // parry: a bright ring and a hard shake, no damage spark
        fx.add("star2", x, y, { w: 70, rot: rnd() * 6.28, s0: 0.3, s1: 1.4, pop: 3, life: 14 });
        fx.shake = Math.max(fx.shake, 6);
      } else {
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
      fx.lastKf = s.kf; fx.shake = 8; fx.koStamp[s.kp] = 70;
      // the reference KOs at the screen edge: a white ink splash and a cloud bank burst inward
      // from where the fighter left the view, with speed lines in the attacker's team colour
      const z = Math.min(W / 1280, H / 720) * cam.z, hw = W / 2 / z, hh = H / 2 / z;
      const kx = s.kx / S, ky = s.ky / S, ang = Math.atan2(cam.y - ky, cam.x - kx);
      const t = Math.min(hw / Math.max(1e-6, Math.abs(Math.cos(ang))), hh / Math.max(1e-6, Math.abs(Math.sin(ang))));
      const x = cam.x - Math.cos(ang) * t, y = cam.y - Math.sin(ang) * t, scr = (H / z);
      fx.add("ko-cloud", x, y, { w: scr * 0.55, ax: 0, ay: 0.5, rot: ang, s0: 0.4, s1: 1.05, pop: 10, life: 70 });
      fx.add("ko-splash", x, y, { w: scr * 0.6, ax: 0, ay: 0.5, rot: ang, s0: 0.5, s1: 1.1, pop: 4, life: 34 });
      const team = TEAM[1 - s.kp];
      for (let j = 0; j < 18; j++) {
        const a = ang + (rnd() - 0.5) * 1.2, sp = 10 + rnd() * 16;
        fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.8 + rnd() * 0.4, size: 2 + rnd() * 3, c: rnd() < 0.6 ? team : "#ffffff", g: 0 });
      }
    }
    s.p.forEach((p, i) => {
      if (p.st === ST.DEAD) return;
      const x = p.x / S, y = p.y / S;
      const body = gfx[i] ? gfx[i].h : 64;
      if (p.ground && !fx.grounded[i]) { fx.puff(x - body * 0.3, y - 6, body * 0.35); fx.puff(x + body * 0.3, y - 6, body * 0.35); }
      if (!p.ground && fx.grounded[i] && p.vy < 0) fx.kick(x, y, body * 0.6, -p.face);
      if (!p.ground && !fx.grounded[i] && p.vy < -1000 && fx.lastVy[i] >= -1000 && p.st === ST.IDLE) fx.puff(x, y + 4, body * 0.5, { s0: 0.4, s1: 1.3, life: 22 }); // air jump ring
      fx.lastVy[i] = p.vy;
      if (p.st === ST.DODGE || p.st === ST.DASH) { if (s.f % 2 === 0) { fx.after[i].unshift({ x: p.x, y: p.y }); fx.after[i].length = Math.min(fx.after[i].length, 4); } }
      else fx.after[i].length = 0;
      fx.grounded[i] = p.ground;
      if ((p.st === ST.DODGE || p.st === ST.DASH) && fx.wasSt[i] !== p.st) {
        const back = p.vx ? -Math.sign(p.vx) : -p.face;
        if (p.ground) fx.kick(x, y, body * 0.7, back); else fx.puff(x, y - body / 2, body * 0.5, { s0: 0.5, s1: 1.3, life: 18 });
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
        fx.add(`smear${1 + Math.floor(rnd() * 3)}`, (b[0] + b[1]) / 2, (b[2] + b[3]) / 2, { w: Math.max(18, (b[1] - b[0]) * 0.55), flip: -p.face, rot: (rnd() - 0.5) * 0.4, s0: 0.85, s1: 1, pop: 1, life: 7, alpha: 0.9 });
      }
      fx.wasSt[i] = p.st;
    });
  }
  function stepFx() {
    for (const q of fx.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.vx *= 0.93; q.life -= 0.035; }
    fx.parts = fx.parts.filter((q) => q.life > 0);
    for (const e of fx.sprites) e.t++;
    fx.sprites = fx.sprites.filter((e) => e.t < e.life);
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
    const live = s.over ? [s.p[s.over - 1]] : s.p.filter((p) => p.st !== ST.DEAD);
    if (!live.length) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of live) { const x = p.x / S, y = p.y / S; x0 = Math.min(x0, x - 110); x1 = Math.max(x1, x + 110); y0 = Math.min(y0, y - 150); y1 = Math.max(y1, y + 70); }
    // match over: push in on the winner so the victory animation reads
    const w = Math.max(s.over ? 420 : 640, x1 - x0), h = Math.max(s.over ? 240 : 340, y1 - y0);
    const z = Math.max(0.62, Math.min(s.over ? 1.7 : 1.28, Math.min(1280 / (w + 160), 720 / (h + 120))));
    const tx = ((x0 + x1) / 2) * 0.85 + 640 * 0.15, ty = ((y0 + y1) / 2) * 0.8 + 400 * 0.2;
    cam.x += (tx - cam.x) * 0.12; cam.y += (ty - cam.y) * 0.12; cam.z += (z - cam.z) * 0.09;
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
    const { sh, k } = ps, sc = sh.scale;
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
      for (let k = trail.length - 1; k >= 0; k--) drawSprite(i, { ...p, x: trail[k].x, y: trail[k].y }, s.f, 0.32 - k * 0.07, 1, null, TEAM[i]);
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
      const im = vfx[e.name];
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

    if (s.f < FEEL.countdown + 30 && !s.over) {
      const n = Math.ceil((FEEL.countdown - s.f) / 30), go = s.f >= FEEL.countdown, ph = (s.f % 30) / 30;
      // pop in, hold, then scale up and vanish quickly (never a slow fade through the outline)
      g.save(); g.globalAlpha = go && ph > 0.7 ? Math.max(0, 1 - (ph - 0.7) / 0.3) : 1;
      const pop = ph < 0.12 ? 1.25 - ph * 2 : 1;
      const size = (go ? 120 : 96) * u * pop * (go && ph > 0.7 ? 1 + (ph - 0.7) : 1);
      italic(go ? "FIGHT!" : String(n), W / 2, H * 0.44, size, go ? "#ffd36b" : "#ffffff", "center");
      g.restore();
    }
    if (s.over && s.overT < 100) { // GAME! slams in on the last KO, before the winner banner
      const pop = s.overT < 8 ? 1.6 - s.overT * 0.075 : 1;
      italic("GAME!", W / 2, H * 0.42, 110 * u * pop, "#ffd36b", "center");
    } else if (s.over) {
      const wi = s.over - 1;
      g.fillStyle = "rgba(8,6,20,.45)"; g.fillRect(0, H * 0.08, W, H * 0.2);
      italic(`${FIGHTERS[pick[wi]].name.toUpperCase()} WINS`, W / 2, H * 0.2, 64 * u, "#ffffff", "center");
      if (s.overT > 60) italic("SPACE OR J: REMATCH     ESC: MENU", W / 2, H * 0.25, 16 * u, "#ffd36b", "center");
    }
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
  let acc = 0, last = performance.now();
  function frame(now) {
    acc += Math.min(250, now - last); last = now;
    let n = 0;
    while (acc >= 1000 / 60 && n < 6) { if (mode !== "menu" && mode !== "loading" && !dbg.paused) tick(); acc -= 1000 / 60; n++; }
    if (n === 6) acc = 0;
    draw();
    requestAnimationFrame(frame);
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
    mode = "loading"; hideMenu();
    await load();
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
