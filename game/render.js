// Dune Brawl test renderer: Canvas 2D, reads sim state, never writes it.
// The sprite shown is a pure function of the fighter's state (st, mv, t, vy, ground) plus the
// global frame counter for loops, so rollback re-renders the right pose for free.
(function (root) {
  "use strict";

  const SLOT_SHEETS = ["jab", "side_light", "down_light", "up_light", "nair", "side_heavy",
    "recovery", "down_heavy", "dair", "dair"];
  // which way a slot's strike reaches, used to find its strike frame automatically
  const SLOT_AXIS = ["fwd", "fwd", "wide", "up", "wide", "fwd", "up", "wide", "down", "down"];
  const SHEETS = ["idle", "run", "jump", "fall", "land", "hurt", "tumble", "victory", // taunt: not used in play yet
    "jab", "side_light", "down_light", "up_light", "nair", "side_heavy", "recovery", "down_heavy", "dair"];
  const ALIGN_CENTER = new Set(["nair", "dair"]);      // aerials: keep the body centered on the fighter
  const ALIGN_FEET = new Set(["jump", "fall", "recovery"]); // the sim moves the body, not the clip
  const BODY_PX = 64;                                   // fighter height in world px

  // ---------- loading ----------
  function loadImage(src) {
    // decode() unpacks the image off the main thread, so the first draw does not stall
    return new Promise((ok) => { const im = new Image(); im.onload = () => im.decode().then(() => ok(im), () => ok(im)); im.onerror = () => ok(null); im.src = src; });
  }

  async function loadSheet(base, name) {
    let meta = {};
    try { meta = await (await fetch(`${base}/${name}.json`)).json(); } catch (e) { /* defaults */ }
    // the in-game copy (tools/sheet-webp.py): WebP with the colour grade baked in
    const im = await loadImage(`${base}/${meta.file || name + ".png"}`);
    if (!im) return null;
    const size = meta.frameSize || im.height;
    const n = Math.max(1, Math.floor(im.width / size));
    const pivot = meta.pivot || [Math.round(size * 5 / 16), size - 6];
    // per-frame alpha bounds, used for aerial alignment and strike detection. Sheets carry them
    // precomputed (tools/sheet-bounds.py); the pixel scan is only a fallback because reading a
    // whole sheet back froze the page for about a second per match.
    const bounds = meta.bounds && meta.bounds.length === n ? meta.bounds : scanBounds(im, size, n);
    return finishSheet(im, name, size, n, pivot, meta, bounds);
  }

  function scanBounds(im, size, n) {
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
    return bounds;
  }

  async function finishSheet(im, name, size, n, pivot, meta, bounds) {
    const body = meta.bodyHeight || 128;
    const dy = bounds.map((b) => {
      if (!b) return 0;
      if (ALIGN_FEET.has(name)) return pivot[1] - b[3];
      if (ALIGN_CENTER.has(name)) return pivot[1] - body / 2 - (b[1] + b[3]) / 2;
      return 0;
    });
    return { mips: await mips(im, meta.inked), size, n, pivot, scale: BODY_PX / body, body, bounds, dy };
  }

  // The fighter look (a little more colour) plus smaller copies, so sprites stay crisp at 60 to
  // 120 px tall. Sheets from tools/sheet-webp.py arrive with the colour already baked in. Each
  // copy halves the one before on a canvas: createImageBitmap with resizeQuality "high" from
  // the full sheet measured three times slower and blocked the page longer.
  async function mips(im, inked) {
    let base = im;
    if (!inked) {
      base = document.createElement("canvas"); base.width = im.width; base.height = im.height;
      const o = base.getContext("2d");
      o.filter = "saturate(1.15) contrast(1.05)"; o.drawImage(im, 0, 0); o.filter = "none";
    }
    const out = [base];
    for (let c = base, w = base.width, h = base.height; h >= 64; ) {
      w = Math.round(w / 2); h = Math.round(h / 2);
      const lvl = document.createElement("canvas"); lvl.width = w; lvl.height = h;
      const g = lvl.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(c, 0, 0, w, h); out.push(lvl); c = lvl;
    }
    return out;
  }

  // A still sprite from the base pose, used when a fighter has no idle sheet yet.
  async function stillSheet(src) {
    const im = await loadImage(src);
    if (!im) return null;
    const size = Math.max(im.width, im.height) + 16;
    const c = document.createElement("canvas"); c.width = size; c.height = size;
    c.getContext("2d").drawImage(im, (size - im.width) / 2, size - 6 - im.height);
    const body = im.height;
    return { mips: await mips(c, false), size, n: 1, pivot: [size / 2, size - 6], scale: BODY_PX / body, body, bounds: [[0, size - 6 - body, size, size - 6]], dy: [0] };
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

  // Generated clips often freeze on a pose for many frames (a held extension, a held wind-up).
  // Attacks play a sequence that keeps at most 2 frames of any held pose, so the time the move
  // data gives a phase is spent on motion, and the hold reads as a crisp beat, not a stall.
  function unhold(bounds) {
    const same = (a, b) => a && b && a.every((v, j) => Math.abs(v - b[j]) <= 2);
    const seq = [0]; let run = 0;
    for (let k = 1; k < bounds.length; k++) {
      if (same(bounds[k], bounds[seq[seq.length - 1]])) { if (++run <= 1) seq.push(k); } else { run = 0; seq.push(k); }
    }
    return seq;
  }

  // A sheet that is not made yet borrows the closest one, so a fighter with only the core set
  // (idle, run, jump, hurt, jab, side_light, side_heavy, nair) still animates every move.
  const STAND_IN = { side_heavy: "side_light", side_light: "jab", jab: "side_light", nair: "jab", hurt: "idle",
    up_light: "jab", down_light: "side_light", dair: "nair", recovery: "jump", down_heavy: "side_heavy" };

  // opts.art: sheet folder (anim-test or anim-v2), opts.height: standing height in world px,
  // opts.basePose: fallback still when there is no idle sheet, opts.victoryHold: the victory frame
  // to hold (for clips that settle back to the ready stance at the end)
  async function loadFighter(id, root, opts = {}) {
    const dir = `${root}/assets/fighters/${id}`, base = `${dir}/${opts.art || "anim-test"}`;
    let names = SHEETS;
    try { names = (await (await fetch(`${base}/index.json`)).json()).sheets || SHEETS; } catch (e) { /* probe every sheet */ }
    const sheets = {};
    const todo = names.filter((n) => SHEETS.includes(n));
    if (opts.onCount) opts.onCount(todo.length);
    await Promise.all(todo.map(async (n) => { sheets[n] = await loadSheet(base, n); if (opts.onSheet) opts.onSheet(); }));
    if (!sheets.idle) sheets.idle = await stillSheet(`${dir}/${opts.basePose || "source/base-pose.png"}`);
    for (let pass = 0; pass < 3; pass++) for (const n in STAND_IN) if (!sheets[n] && sheets[STAND_IN[n]]) sheets[n] = sheets[STAND_IN[n]];
    // opts.remap: play another sheet for a move, turned by `rot` radians (a lunge turned into a dive)
    for (const n in opts.remap || {}) {
      const r = opts.remap[n], src = sheets[r.sheet];
      if (src) sheets[n] = { ...src, rot: r.rot || 0, axis: r.axis, sized: src.sized };
    }
    const h = opts.height || BODY_PX;
    for (const n in sheets) if (sheets[n] && !sheets[n].sized) { sheets[n].scale *= h / BODY_PX; sheets[n].sized = 1; }
    for (const n of SLOT_SHEETS) if (sheets[n] && !sheets[n].seq) sheets[n].seq = unhold(sheets[n].bounds);
    // the strike frame, as an index into the attack's frame sequence
    const strike = SLOT_SHEETS.map((n, i) => {
      if (!sheets[n]) return 0;
      const sf = strikeFrame(sheets[n], sheets[n].axis || SLOT_AXIS[i]), seq = sheets[n].seq;
      let j = 0; while (j + 1 < seq.length && seq[j + 1] <= sf) j++;
      return j;
    });
    return { id, sheets, strike, h, victoryHold: opts.victoryHold === undefined ? -1 : opts.victoryHold };
  }

  // ---------- pose selection (pure) ----------
  // `win`: frames since this fighter won the match, or -1
  function pose(F, p, f, moves, Sim, win = -1) {
    const S = F.sheets, ST = Sim.ST;
    const pick = (name, k) => (S[name] ? { sh: S[name], k: Math.max(0, Math.min(S[name].n - 1, k | 0)), rot: S[name].rot || 0 } : null);
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
    if (win >= 0 && p.ground && S.victory) return pick("victory", Math.min(F.victoryHold >= 0 ? F.victoryHold : S.victory.n - 1, Math.floor(win / 3))); // plays once, holds the pose
    if (p.st === ST.ATK) {
      const m = moves[p.mv], name = SLOT_SHEETS[p.mv], sh = S[name];
      if (!sh) return air();
      const seq = sh.seq || [...Array(sh.n).keys()], sf = F.strike[p.mv], n = seq.length;
      const at = (k) => pick(name, seq[Math.max(0, Math.min(n - 1, Math.round(k)))]);
      if (p.mv === 9 && p.t >= m.su) return at(sf); // ground pound holds the down air strike pose
      // Key poses over in-betweens, like drawn animation: the wind-up pose arrives early and
      // settles (ease out), the strike pose snaps in and holds through the active frames, and
      // the recovery holds it a beat before easing back to ready.
      const eo = (u) => 1 - (1 - u) ** 3, eio = (u) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
      let k;
      if (p.t < m.su) k = eo(p.t / m.su) * Math.max(0, sf - 1);
      else if (p.t < m.su + m.ac) k = sf + Math.min(1, (p.t - m.su) / Math.max(1, m.ac)) * Math.min(1, n - 1 - sf);
      else { const u = (p.t - m.su - m.ac) / Math.max(1, m.re), a = Math.min(n - 1, sf + 1); k = u < 0.3 ? a : a + eio((u - 0.3) / 0.7) * (n - 1 - a); }
      return at(k);
    }
    if (p.st === ST.HIT) {
      if (S.tumble && p.launch > 2600) return loop("tumble", 3);
      return S.hurt ? pick("hurt", Math.min(S.hurt.n - 1, Math.floor(f / 3) % S.hurt.n)) : loop("idle", 5);
    }
    if (p.st === ST.DODGE) return p.ground ? loop("idle", 5) : air();
    if (p.st === ST.DASH) return S.run ? pick("run", Math.floor(f / 1.5) % S.run.n) : loop("idle", 5);
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
