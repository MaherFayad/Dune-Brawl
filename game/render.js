// Dune Brawl test renderer: Canvas 2D, reads sim state, never writes it.
// The sprite shown is a pure function of the fighter's state (st, mv, t, vy, ground) plus the
// global frame counter for loops, so rollback re-renders the right pose for free.
(function (root) {
  "use strict";

  const SLOT_SHEETS = ["jab", "side_light", "down_light", "up_light", "nair", "side_heavy",
    "recovery", "down_heavy", "dair", "dair"];
  // which way a slot's strike reaches, used to find its strike frame automatically
  const SLOT_AXIS = ["fwd", "fwd", "wide", "up", "wide", "fwd", "up", "wide", "down", "down"];
  const SHEETS = ["idle", "run", "jump", "fall", "land", "hurt", "tumble", "victory", "taunt",
    "jab", "side_light", "down_light", "up_light", "nair", "side_heavy", "recovery", "down_heavy", "dair"];
  const ALIGN_CENTER = new Set(["nair", "dair"]);      // aerials: keep the body centered on the fighter
  const ALIGN_FEET = new Set(["jump", "fall", "recovery"]); // the sim moves the body, not the clip
  const BODY_PX = 64;                                   // fighter height in world px

  // ---------- loading ----------
  function loadImage(src) {
    return new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
  }

  async function loadSheet(base, name) {
    const im = await loadImage(`${base}/${name}.png`);
    if (!im) return null;
    let meta = {};
    try { meta = await (await fetch(`${base}/${name}.json`)).json(); } catch (e) { /* defaults */ }
    const size = meta.frameSize || im.height;
    const n = Math.max(1, Math.floor(im.width / size));
    const pivot = meta.pivot || [Math.round(size * 5 / 16), size - 6];
    const body = meta.bodyHeight || 128;
    // per-frame alpha bounds, used for aerial alignment and strike detection
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0);
    const data = g.getImageData(0, 0, im.width, im.height).data;
    const bounds = [];
    for (let k = 0; k < n; k++) {
      let x0 = size, y0 = size, x1 = -1, y1 = -1;
      for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
          if (data[(y * im.width + k * size + x) * 4 + 3] > 96) {
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      bounds.push(x1 < 0 ? null : [x0, y0, x1, y1]);
    }
    const dy = bounds.map((b) => {
      if (!b) return 0;
      if (ALIGN_FEET.has(name)) return pivot[1] - b[3];
      if (ALIGN_CENTER.has(name)) return pivot[1] - body / 2 - (b[1] + b[3]) / 2;
      return 0;
    });
    return { mips: ink(im), size, n, pivot, scale: BODY_PX / body, body, bounds, dy };
  }

  // Bake the fighter look into the sheet once: a little more color, plus smaller copies made
  // with high quality resampling, so sprites stay crisp when drawn at 60 to 120 px tall.
  function ink(im) {
    const out = document.createElement("canvas"); out.width = im.width; out.height = im.height;
    const o = out.getContext("2d");
    o.filter = "saturate(1.15) contrast(1.05)"; o.drawImage(im, 0, 0); o.filter = "none";
    const mips = [out];
    for (let c = out; c.height >= 64; ) {
      const h = document.createElement("canvas"); h.width = Math.round(c.width / 2); h.height = Math.round(c.height / 2);
      const hg = h.getContext("2d"); hg.imageSmoothingEnabled = true; hg.imageSmoothingQuality = "high";
      hg.drawImage(c, 0, 0, h.width, h.height); mips.push(h); c = h;
    }
    return mips;
  }

  // A still sprite from the base pose, used when a fighter has no idle sheet yet.
  async function stillSheet(src) {
    const im = await loadImage(src);
    if (!im) return null;
    const size = Math.max(im.width, im.height) + 16;
    const c = document.createElement("canvas"); c.width = size; c.height = size;
    c.getContext("2d").drawImage(im, (size - im.width) / 2, size - 6 - im.height);
    const body = im.height;
    return { mips: ink(c), size, n: 1, pivot: [size / 2, size - 6], scale: BODY_PX / body, body, bounds: [[0, size - 6 - body, size, size - 6]], dy: [0] };
  }

  function strikeFrame(sheet, axis) {
    let best = 0, score = -1e9;
    sheet.bounds.forEach((b, k) => {
      if (!b) return;
      const v = axis === "fwd" ? b[2] : axis === "up" ? -b[1] : axis === "down" ? b[3] : b[2] - b[0];
      if (v > score) { score = v; best = k; }
    });
    return best;
  }

  async function loadFighter(id, root) {
    const base = `${root}/assets/fighters/${id}/anim-test`;
    const sheets = {};
    await Promise.all(SHEETS.map(async (n) => { sheets[n] = await loadSheet(base, n); }));
    if (!sheets.idle) sheets.idle = await stillSheet(`${root}/assets/fighters/${id}/source/base-pose.png`);
    const strike = SLOT_SHEETS.map((n, i) => (sheets[n] ? strikeFrame(sheets[n], SLOT_AXIS[i]) : 0));
    return { id, sheets, strike };
  }

  // ---------- pose selection (pure) ----------
  function pose(F, p, f, moves, Sim) {
    const S = F.sheets, ST = Sim.ST;
    const pick = (name, k) => (S[name] ? { sh: S[name], k: Math.max(0, Math.min(S[name].n - 1, k | 0)) } : null);
    const loop = (name, rate) => (S[name] ? pick(name, Math.floor(f / rate) % S[name].n) : null);
    const air = () => {
      const sh = S.fall && p.vy > 0 ? "fall" : "jump";
      if (!S[sh]) return loop("idle", 5);
      const n = S[sh].n;
      if (sh === "fall") return pick("fall", Math.floor(f / 4) % n);
      // rising uses 25 to 45 percent of the jump clip, falling 45 to 65 percent
      const r = Math.max(0, Math.min(1, (p.vy + 1500) / 2800));
      return pick("jump", n * (0.25 + 0.4 * r));
    };
    if (p.st === ST.ATK) {
      const m = moves[p.mv], name = SLOT_SHEETS[p.mv], sh = S[name];
      if (!sh) return air();
      const sf = F.strike[p.mv], n = sh.n;
      if (p.mv === 9 && p.t >= m.su) return pick(name, sf); // ground pound holds the down air strike pose
      let k;
      if (p.t < m.su) k = (p.t / m.su) * sf;
      else if (p.t < m.su + m.ac) k = sf + ((p.t - m.su) / m.ac) * Math.min(2, n - 1 - sf);
      else k = sf + 2 + ((p.t - m.su - m.ac) / Math.max(1, m.re)) * (n - 1 - sf - 2);
      return pick(name, k);
    }
    if (p.st === ST.HIT) {
      if (S.tumble && p.launch > 2600) return loop("tumble", 3);
      return S.hurt ? pick("hurt", Math.min(S.hurt.n - 1, Math.floor(f / 3) % S.hurt.n)) : loop("idle", 5);
    }
    if (p.st === ST.DODGE) return p.ground ? loop("idle", 5) : air();
    if (!p.ground) return air();
    if (p.land > 0 && S.land) return pick("land", ((6 - p.land) / 6) * S.land.n * 0.5);
    if (Math.abs(p.vx) > 150 && S.run) return pick("run", Math.floor(f / 2) % S.run.n);
    return loop("idle", 5);
  }

  // pick the smallest copy that is still at least as big as the body on screen
  function mip(sh, screenBody) {
    let lvl = 0;
    while (lvl + 1 < sh.mips.length && sh.body / 2 ** (lvl + 1) >= screenBody) lvl++;
    return { im: sh.mips[lvl], f: 2 ** lvl };
  }

  root.Render = { loadFighter, pose, mip, SLOT_SHEETS, BODY_PX };
})(this);
