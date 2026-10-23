// Dune Brawl test build: local play (vs bot, 2 players, bot vs bot), sprites, stage, effects.
(() => {
  "use strict";
  const { S, IN, ST, STAGE, FEEL } = Sim;
  const ROOT = "..";
  const FIGHTERS = {
    "djinn-warrior": { name: "Saif", color: "#3d4fd6", glow: "#36e2d4" },
    "dune-ghoul": { name: "Abu Sarab", color: "#7fbf3a", glow: "#c6ff3d" },
    "falcon-rider": { name: "Nawaf", color: "#e9dcc0", glow: "#ffcf5a" },
    "sea-siren": { name: "Dana", color: "#1fb5a6", glow: "#8ff5ea" },
    "dagger-dancer": { name: "Marjana", color: "#d6337a", glow: "#ffd0e4" },
  };
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
    if (e.code === "F2") togglePanel();
    if (e.code === "F3") showBoxes = !showBoxes;
    if (e.code === "Escape") showMenu();
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
  let botTick = 0;
  function bot(s, i, level) {
    const me = s.p[i], foe = s.p[1 - i], m = STAGE.main;
    botTick++;
    if (me.st === ST.DEAD || s.f < FEEL.countdown) return 0;
    const even = botTick % 2 === 0, dx = foe.x - me.x, dy = foe.y - me.y;
    let v = 0;
    const offL = me.x < m.x1 + 10 * S, offR = me.x > m.x2 - 10 * S;
    if (((me.x < m.x1 - 4 * S || me.x > m.x2 + 4 * S) && !me.ground) || (!me.ground && me.y > m.y - 10 * S && (offL || offR))) {
      v |= me.x < 640 * S ? IN.R : IN.L;
      if (me.vy > -200 && even) v |= me.jumps > 0 ? IN.J : me.recov ? 0 : IN.U | IN.B;
      return v;
    }
    if (foe.st === ST.DEAD) return Math.abs(me.x - 640 * S) > 60 * S ? (me.x < 640 * S ? IN.R : IN.L) : 0;
    const close = Math.abs(dx) < 95 * S && Math.abs(dy) < 90 * S;
    if (!close) v |= dx > 0 ? IN.R : IN.L;
    if (dy < -110 * S && me.ground && even && Math.random() < 0.08) v |= IN.J;
    if (foe.st === ST.ATK && close && even && Math.random() < 0.04 + 0.04 * level) return v | IN.X;
    if (close && even && Math.random() < 0.12 + 0.08 * level) {
      if (dx) v |= dx > 0 ? IN.R : IN.L;
      const r = Math.random();
      if (dy < -50 * S) v |= IN.U | IN.A;
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
    [stageArt.bg, stageArt.island, stageArt.plat] = await Promise.all([load("background.jpg"), load("island.webp"), load("platform.webp")]);
  }

  // ---------- match ----------
  let mode = "menu", pick = [params.get("p1") || "djinn-warrior", params.get("p2") || "dune-ghoul"];
  let M = null, st = null, defs = [], gfx = [], showBoxes = false;
  async function startMatch(m) {
    mode = "loading"; hideMenu();
    defs = await Promise.all(pick.map(async (id) => (await fetch(`${ROOT}/assets/fighters/${id}/moves.draft.json`)).json()));
    gfx = await Promise.all(pick.map((id) => Render.loadFighter(id, ROOT)));
    M = Sim.match(defs[0], defs[1]); st = M.create(); fx.reset(); mode = m;
  }
  function rebuild() { if (defs.length) { M = Sim.match(defs[0], defs[1]); } }

  // ---------- effects (render only, driven by sim events) ----------
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const fx = {
    parts: [], rings: [], bursts: [], trails: [], ghosts: [], text: [], shake: 0, flash: 0, lastHf: -1, lastKf: -1, zoomKick: 0,
    land: [0, 0], grounded: [1, 1], wasSt: [0, 0],
    reset() { Object.assign(this, { parts: [], rings: [], bursts: [], trails: [], ghosts: [], text: [], shake: 0, flash: 0, lastHf: -1, lastKf: -1, zoomKick: 0 }); },
    dust(x, y, n, spread) {
      for (let k = 0; k < n; k++) {
        const a = Math.PI + rnd() * Math.PI;
        this.parts.push({ x: x + (rnd() - 0.5) * spread, y, vx: Math.cos(a) * (1 + rnd() * 2), vy: Math.sin(a) * (0.6 + rnd()), life: 0.6 + rnd() * 0.3, size: 3 + rnd() * 4, c: "#e9c27b", g: 0.02, soft: 1 });
      }
    },
  };
  function events(s) {
    if (s.hf !== fx.lastHf && s.hf >= 0) {
      fx.lastHf = s.hf;
      const x = s.hx / S, y = s.hy / S, k = s.hk / 100, heavy = k > 18;
      const atk = s.p[s.hp], dir = atk ? atk.face : 1;
      fx.shake = Math.max(fx.shake, Math.min(14, 1.5 + k * 0.35));
      fx.rings.push({ x, y, r: 6, life: 1, w: 3 + k * 0.15, c: heavy ? "255,214,120" : "255,255,255" });
      fx.bursts.push({ x, y, life: 1, size: 18 + k * 1.4, dir, spikes: heavy ? 9 : 7, heavy });
      const n = 8 + Math.min(18, k | 0);
      for (let j = 0; j < n; j++) {
        const a = (dir > 0 ? 0 : Math.PI) + (rnd() - 0.5) * 2.2, sp = 3 + rnd() * (3 + k * 0.25);
        fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.5 + rnd() * 0.3, size: 2 + rnd() * 3, c: rnd() < 0.5 ? "#fff4d6" : heavy ? "#ffb347" : "#ffffff", g: 0.12, streak: 1 });
      }
      if (heavy) fx.zoomKick = Math.min(0.08, k * 0.002);
      fx.text.push({ x, y: y - 26, v: atk ? M.mv[s.hp][atk.mv].dmg : 0, life: 1 });
    }
    if (s.kf !== fx.lastKf && s.kf >= 0) {
      fx.lastKf = s.kf; fx.shake = 22; fx.flash = 1;
      const x = s.kx / S, y = s.ky / S, ang = Math.atan2(360 - y, 640 - x), col = TEAM[s.kp];
      fx.bursts.push({ x, y, life: 1.6, size: 140, dir: 1, spikes: 14, heavy: true, ko: true, ang, col });
      for (let j = 0; j < 70; j++) {
        const a = ang + (rnd() - 0.5) * 1.3, sp = 6 + rnd() * 18;
        fx.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.2 + rnd() * 0.5, size: 3 + rnd() * 6, c: rnd() < 0.4 ? "#ffffff" : col, g: 0 });
      }
    }
    s.p.forEach((p, i) => {
      if (p.st === ST.DEAD) return;
      const x = p.x / S, y = p.y / S;
      if (p.ground && !fx.grounded[i]) fx.dust(x, y, 8, 20);
      if (!p.ground && fx.grounded[i] && p.vy < 0) fx.dust(x, y, 5, 12);
      fx.grounded[i] = p.ground;
      if (p.st === ST.DODGE && s.f % 3 === 0) fx.ghosts.push({ i, x: p.x, y: p.y, f: s.f, face: p.face, life: 0.5, p: { ...p } });
      if (p.st === ST.DODGE && fx.wasSt[i] !== ST.DODGE) fx.dust(x, y, 6, 10);
      if (p.st === ST.HIT && p.launch > 1800 && s.f % 2 === 0) fx.trails.push({ x, y: y - 32, life: 1, w: Math.min(16, p.launch / 260), c: TEAM[i] });
      if (p.ground && Math.abs(p.vx) > 700 && s.f % 9 === 0) fx.dust(x - Math.sign(p.vx) * 8, y, 2, 6);
      fx.wasSt[i] = p.st;
    });
  }
  function stepFx() {
    for (const q of fx.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.vx *= 0.94; q.life -= 0.03; }
    fx.parts = fx.parts.filter((q) => q.life > 0);
    for (const r of fx.rings) { r.r += 5; r.life -= 0.08; }
    fx.rings = fx.rings.filter((r) => r.life > 0);
    for (const b of fx.bursts) b.life -= b.ko ? 0.04 : 0.11;
    fx.bursts = fx.bursts.filter((b) => b.life > 0);
    for (const t of fx.trails) t.life -= 0.05;
    fx.trails = fx.trails.filter((t) => t.life > 0);
    for (const gh of fx.ghosts) gh.life -= 0.06;
    fx.ghosts = fx.ghosts.filter((gh) => gh.life > 0);
    for (const t of fx.text) { t.y -= 0.6; t.life -= 0.03; }
    fx.text = fx.text.filter((t) => t.life > 0);
    fx.shake *= 0.85; fx.flash *= 0.88; fx.zoomKick *= 0.88;
  }

  // ---------- camera ----------
  const cam = { x: 640, y: 380, z: 1 };
  function updateCam(s) {
    const live = s.p.filter((p) => p.st !== ST.DEAD);
    let x0 = 420, x1 = 860, y0 = 300, y1 = 520;
    for (const p of live) { const x = p.x / S, y = p.y / S; x0 = Math.min(x0, x - 140); x1 = Math.max(x1, x + 140); y0 = Math.min(y0, y - 200); y1 = Math.max(y1, y + 90); }
    const z = Math.max(0.7, Math.min(1.35, Math.min(1280 / (x1 - x0 + 220), 720 / (y1 - y0 + 180)))) + fx.zoomKick;
    const tx = ((x0 + x1) / 2) * 0.75 + 160, ty = ((y0 + y1) / 2) * 0.75 + 95;
    cam.x += (tx - cam.x) * 0.1; cam.y += (ty - cam.y) * 0.1; cam.z += (z - cam.z) * 0.08;
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
  }
  function drawStage() {
    const m = STAGE.main, x1 = m.x1 / S, x2 = m.x2 / S, y = m.y / S;
    if (stageArt.island) {
      const im = stageArt.island, w = (x2 - x1) * 1.06, h = (im.height / im.width) * w;
      g.drawImage(im, x1 - (w - (x2 - x1)) / 2, y - h * 0.035, w, h);
    } else {
      g.fillStyle = "#7b4a3a"; g.fillRect(x1, y, x2 - x1, m.yb / S - y);
    }
    g.fillStyle = "rgba(255,226,170,0.9)"; g.fillRect(x1 + 6, y - 1, x2 - x1 - 12, 2); // brightest line: the stage edge
    for (const pl of STAGE.plats) {
      const a = pl.x1 / S, b = pl.x2 / S, py = pl.y / S;
      if (stageArt.plat) { const im = stageArt.plat, w = (b - a) * 1.08, h = (im.height / im.width) * w; g.drawImage(im, a - (w - (b - a)) / 2, py - h * 0.2, w, h); }
      else { g.fillStyle = "#c98a5b"; g.fillRect(a, py - 2, b - a, 12); }
      g.fillStyle = "rgba(255,226,170,0.75)"; g.fillRect(a + 6, py - 1, b - a - 12, 2);
    }
  }
  function drawSprite(i, p, f, alpha, tint) {
    const F = gfx[i], ps = Render.pose(F, p, f, M.mv[i], Sim);
    const x = p.x / S, y = p.y / S;
    if (!ps) { g.fillStyle = FIGHTERS[pick[i]].color; g.fillRect(x - 14, y - 64, 28, 64); return; }
    const { sh, k } = ps, sc = sh.scale;
    g.save(); g.globalAlpha = alpha; g.translate(Math.round(x), Math.round(y)); g.scale(p.face, 1);
    if (p.st === ST.HIT && p.launch > 2600 && !gfx[i].sheets.tumble) { g.translate(0, -32); g.rotate((f % 24) / 24 * Math.PI * 2 * -1); g.translate(0, 32); }
    g.drawImage(sh.im, k * sh.size, 0, sh.size, sh.size, -sh.pivot[0] * sc, (-sh.pivot[1] + sh.dy[k]) * sc, sh.size * sc, sh.size * sc);
    if (tint) {
      g.globalCompositeOperation = "source-atop"; g.globalAlpha = tint;
      g.fillStyle = "#ffffff"; g.fillRect(-sh.pivot[0] * sc, -sh.pivot[1] * sc, sh.size * sc, sh.size * sc);
    }
    g.restore();
  }
  function drawFighter(s, i) {
    const p = s.p[i];
    if (p.st === ST.DEAD) return;
    const x = p.x / S, y = p.y / S, m = M.mv[i][p.mv];
    if (p.ground) { g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(x, y + 1, 20, 4.5, 0, 0, 7); g.fill(); }
    g.strokeStyle = TEAM[i]; g.lineWidth = 2.5; g.globalAlpha = 0.9; g.beginPath(); g.ellipse(x, y + 1, 17, 4, 0, 0, 7); g.stroke(); g.globalAlpha = 1;
    for (const gh of fx.ghosts.filter((q) => q.i === i)) drawSprite(i, gh.p, gh.f, gh.life * 0.5, 0.6);
    let tint = 0;
    if (p.st === ST.ATK && m.su - p.t > 0 && m.su - p.t <= 2 && m.su >= 8) tint = 0.55; // heavy startup flash
    if (p.st === ST.HIT && s.freeze > 0) tint = 0.7;                                      // hit flash during hitstop
    const blink = p.inv > 0 && Math.floor(s.f / 6) % 2 === 0;
    const jitter = p.st === ST.HIT && s.freeze > 0 ? (rnd() - 0.5) * 4 : 0;
    g.save(); g.translate(jitter, 0);
    drawSprite(i, p, s.f, p.st === ST.DODGE ? 0.55 : blink ? 0.55 : 1, tint);
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
    g.font = "700 12px system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = TEAM[i];
    g.fillText(label, x, y - 82); g.beginPath(); g.moveTo(x - 5, y - 77); g.lineTo(x + 5, y - 77); g.lineTo(x, y - 72); g.fill();
  }
  function drawFx() {
    for (const t of fx.trails) { g.fillStyle = t.c; g.globalAlpha = t.life * 0.45; g.beginPath(); g.arc(t.x, t.y, t.w * t.life, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    for (const b of fx.bursts) {
      const k = b.ko ? 1 : Math.min(1, (1 - b.life) * 4), r = b.size * (0.55 + 0.45 * k);
      g.save(); g.translate(b.x, b.y); g.globalAlpha = Math.min(1, b.life * 1.6);
      if (b.ko) {
        g.rotate(b.ang); const gr = g.createLinearGradient(0, 0, 900, 0);
        gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(0.3, b.col); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, -40 * b.life); g.lineTo(900, -160 * b.life); g.lineTo(900, 160 * b.life); g.lineTo(0, 40 * b.life); g.fill();
      } else {
        g.rotate(b.dir > 0 ? -0.2 : Math.PI + 0.2);
        g.fillStyle = b.heavy ? "#ffb347" : "#ffe9a8"; star(r, b.spikes, 0.45);
        g.fillStyle = "#ffffff"; star(r * 0.62, b.spikes, 0.4);
      }
      g.restore();
    }
    g.globalAlpha = 1;
    for (const r of fx.rings) { g.strokeStyle = `rgba(${r.c},${r.life})`; g.lineWidth = r.w * r.life; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 7); g.stroke(); }
    for (const q of fx.parts) {
      g.globalAlpha = Math.min(1, q.life * (q.soft ? 0.8 : 1.4)); g.fillStyle = q.c;
      if (q.streak) { g.save(); g.translate(q.x, q.y); g.rotate(Math.atan2(q.vy, q.vx)); g.fillRect(-q.size * 2, -q.size / 3, q.size * 4, q.size * 0.66); g.restore(); }
      else { g.beginPath(); g.arc(q.x, q.y, q.size * (q.soft ? 1 : 0.6), 0, 7); g.fill(); }
    }
    g.globalAlpha = 1;
    g.font = "900 16px system-ui, sans-serif"; g.textAlign = "center";
    for (const t of fx.text) { g.globalAlpha = t.life; g.fillStyle = "#fff"; g.strokeStyle = "#1a1426"; g.lineWidth = 4; g.strokeText(t.v + "%", t.x, t.y); g.fillText(t.v + "%", t.x, t.y); }
    g.globalAlpha = 1;
  }
  function star(r, n, inner) {
    g.beginPath();
    for (let k = 0; k < n * 2; k++) { const a = (k / (n * 2)) * Math.PI * 2, rr = k % 2 ? r * inner : r * (k % 4 === 0 ? 1 : 0.78); g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    g.closePath(); g.fill();
  }
  function hud(s) {
    const sc = Math.max(0.75, Math.min(1.2, W / 1280));
    g.save(); g.scale(sc, sc);
    const w = W / sc;
    s.p.forEach((p, i) => {
      const x = i === 0 ? 24 : w - 24 - 210, info = FIGHTERS[pick[i]];
      g.fillStyle = "rgba(12,8,26,.72)"; rr(x, 18, 210, 78, 14); g.fill();
      g.fillStyle = TEAM[i]; rr(x, 18, 8, 78, 4); g.fill();
      g.font = "700 13px system-ui, sans-serif"; g.textAlign = "left"; g.fillStyle = "#d9cfe6";
      g.fillText(info.name, x + 22, 40);
      const d = p.st === ST.DEAD ? 0 : p.dmg, e = Math.min(1, d / 160);
      const shake = s.hf >= 0 && s.f - s.hf < 10 && s.p[1 - s.hp] === p ? (rnd() - 0.5) * 6 : 0;
      g.font = "900 38px system-ui, sans-serif";
      g.fillStyle = p.st === ST.DEAD ? "#6c6080" : `rgb(255,${Math.round(255 - 200 * e)},${Math.round(255 - 235 * Math.min(1, e * 1.6))})`;
      g.fillText(d + "%", x + 22 + shake, 82 + shake * 0.5);
      for (let k = 0; k < FEEL.stocks; k++) { g.fillStyle = k < p.stocks ? TEAM[i] : "rgba(255,255,255,.15)"; g.beginPath(); g.arc(x + 210 - 22 - 20 * k, 40, 7, 0, 7); g.fill(); }
    });
    g.restore();
    g.textAlign = "center";
    if (s.f < FEEL.countdown + 30) {
      const n = Math.ceil((FEEL.countdown - s.f) / 30), t = s.f >= FEEL.countdown ? "FIGHT" : String(n), ph = (s.f % 30) / 30;
      g.globalAlpha = 1 - ph * 0.6; g.font = `900 ${Math.round(100 + 30 * ph)}px system-ui, sans-serif`;
      g.fillStyle = s.f >= FEEL.countdown ? "#ffcf8a" : "#fff"; g.fillText(t, W / 2, H * 0.42); g.globalAlpha = 1;
    }
    if (s.over) {
      const wi = s.over - 1;
      g.fillStyle = "rgba(10,6,20,.5)"; g.fillRect(0, H * 0.3, W, H * 0.26);
      g.font = "900 72px system-ui, sans-serif"; g.fillStyle = TEAM[wi];
      g.fillText(`${FIGHTERS[pick[wi]].name.toUpperCase()} WINS`, W / 2, H * 0.44);
      if (s.overT > 60) { g.font = "600 18px system-ui, sans-serif"; g.fillStyle = "#f6efe6"; g.fillText("Space or J: rematch   Esc: menu", W / 2, H * 0.51); }
    }
  }
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawBackground();
    if (!st) return;
    const z = Math.min(W / 1280, H / 720) * cam.z;
    g.save();
    g.translate(W / 2 + (rnd() - 0.5) * fx.shake, H / 2 + (rnd() - 0.5) * fx.shake); g.scale(z, z); g.translate(-cam.x, -cam.y);
    drawStage();
    for (const t of [0, 1]) drawFighter(st, t);
    drawFx();
    g.restore();
    if (fx.flash > 0.02) { g.fillStyle = `rgba(255,240,220,${0.3 * fx.flash})`; g.fillRect(0, 0, W, H); }
    hud(st);
  }

  // ---------- loop ----------
  function tick() {
    if (!st) return;
    let a = 0, b = 0;
    if (mode === "bot") { a = read(SOLO) | pad(0); b = bot(st, 1, 1); }
    else if (mode === "local") { a = read(P1) | pad(0); b = read(P2) | pad(1); }
    else if (mode === "demo") { a = bot(st, 0, 2); b = bot(st, 1, 2); }
    if (st.over && st.overT > 60 && ((a | b) & (IN.J | IN.A) || mode === "demo")) { st = M.create(); fx.reset(); return; }
    M.step(st, [a, b]);
    events(st); stepFx(); updateCam(st);
  }
  let acc = 0, last = performance.now();
  function frame(now) {
    acc += Math.min(250, now - last); last = now;
    let n = 0;
    while (acc >= 1000 / 60 && n < 6) { if (mode !== "menu" && mode !== "loading") tick(); acc -= 1000 / 60; n++; }
    if (n === 6) acc = 0;
    draw();
    requestAnimationFrame(frame);
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
        const b = document.createElement("button");
        b.className = "chip" + (pick[i] === id ? " on" : ""); b.textContent = FIGHTERS[id].name;
        b.onclick = () => { pick[i] = id; buildPickers(); };
        row.appendChild(b);
      }
    });
  }
  document.getElementById("bBot").onclick = () => startMatch("bot");
  document.getElementById("bLocal").onclick = () => startMatch("local");
  document.getElementById("bDemo").onclick = () => startMatch("demo");

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
  if (params.get("mode")) startMatch(params.get("mode")); else showMenu();
  requestAnimationFrame(frame);
  window.__db = { get state() { return st; }, get mode() { return mode; }, fx, cam };
})();
