// Dune Brawl sound: every effect is synthesized with the Web Audio API (oscillators, filtered
// noise and envelopes), so there are no audio files to download and nothing is copied from the
// reference. Levels, envelopes and spectra follow the measurements in
// docs/design/REFERENCE-SFX.md: hits stay at nearly one loudness and show strength through sub
// weight, crack and length; the KO is the only long tail (a low swell peaking at about +240 ms);
// movement sits 6 to 13 dB under hits; landings are near silent; everything is near mono.
// A fighter can add or swap layers (FLAVOR). Sound is render-only: it never touches the sim.
(function (root) {
  "use strict";
  let ctx = null, master = null, sfxBus = null, noise = null, muted = false;
  let voices = [], last = {};
  try { muted = localStorage.getItem("dune-brawl-muted") === "1"; } catch (e) { /* private mode */ }

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    setup(new AC());
  }
  // sfx bus -> master -> compressor -> limiter, as measured: no ducking, a bus limiter holds peaks
  function setup(c) {
    ctx = c; voices = []; last = {};
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 6; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -2; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9;
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.5; // about 6 dB of headroom for overlaps
    sfxBus.connect(master); master.connect(comp); comp.connect(lim); lim.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
  }
  // browsers only start audio after a user gesture
  for (const ev of ["keydown", "pointerdown", "touchstart"]) root.addEventListener(ev, init, { passive: true });

  // ---------- building blocks (times in ms after t, as in the recipes) ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const S = (ms) => ms / 1000;
  // a gain stage with an attack ramp and an exponential decay; dec is the time to -40 dB, so the
  // -6, -12 and -20 dB points land at 15, 30 and 50 percent of it, as the reference measures them
  function amp(dest, t, peak, atk, dec, delay = 0) {
    const g = ctx.createGain(), t0 = t + S(delay);
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(peak, t0 + S(atk)); g.gain.setTargetAtTime(0.0001, t0 + S(atk), S(dec) / 4.6);
    g.connect(dest); return g;
  }
  function osc(dest, t, type, f0, f1, sweep, peak, atk, dec, delay = 0) {
    const o = ctx.createOscillator(), t0 = t + S(delay);
    o.type = type; o.frequency.setValueAtTime(f0, t0); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + S(sweep));
    o.connect(amp(dest, t, peak, atk, dec, delay)); o.start(t0); o.stop(t0 + S(atk + dec * 1.6) + 0.05);
    return o;
  }
  // noise through a chain of filters: each [type, f0, f1, sweepMs, Q]
  function hiss(dest, t, filters, peak, atk, dec, delay = 0) {
    const s = ctx.createBufferSource(), t0 = t + S(delay);
    s.buffer = noise; s.playbackRate.value = rnd(0.9, 1.1);
    let node = s;
    for (const [type, f0, f1, sweep, q] of filters) {
      const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q === undefined ? 0.7 : q;
      f.frequency.setValueAtTime(f0, t0); if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t0 + S(sweep)); // f1 0: no sweep
      node.connect(f); node = f;
    }
    const g = amp(dest, t, peak, atk, dec, delay); node.connect(g);
    s.start(t0, Math.random() * 0.4); s.stop(t0 + S(atk + dec * 1.6) + 0.05);
    return g;
  }
  // noise gated at wing-beat rate: bats
  function flutter(dest, t, rate, len, peak, f0, f1) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain();
    s.buffer = noise; s.loop = true; f.type = "bandpass"; f.Q.value = 1.5;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + S(len));
    lfo.type = "square"; lfo.frequency.value = rate; depth.gain.value = peak * 0.5;
    g.gain.setValueAtTime(peak * 0.5, t); g.gain.linearRampToValueAtTime(0, t + S(len));
    lfo.connect(depth); depth.connect(g.gain); s.connect(f); f.connect(g); g.connect(dest);
    s.start(t); lfo.start(t); s.stop(t + S(len) + 0.05); lfo.stop(t + S(len) + 0.05);
  }

  // ---------- the palette ----------
  const SOUNDS = {
    hit(d, t, o) { // light: a long low punch, a fast mid smack and a little snap (-20 dB near 360 ms)
      const p = rnd(0.92, 1.08) * (1 + 0.03 * Math.min(4, o.chain || 0)), punch = o.punch || 1;
      osc(d, t, "sine", 160 * p, 70 * p, 60, 0.55 * punch, 2, rnd(620, 780));
      osc(d, t, "triangle", 340 * p, 210 * p, 40, 1.1 * punch, 1, 150);
      hiss(d, t, [["bandpass", rnd(1400, 2400), 0, 0, 0.9], ["highpass", 600]], 1.8, 1, 80);
    },
    hitHeavy(d, t, o) { // heavy: a crack at 0, the sub body peaking near +60 ms, a late mid crunch
      const p = rnd(0.94, 1.06), k = Math.min(1, (o.k || 20) / 40), punch = o.punch || 1, len = rnd(0.9, 1.15);
      osc(d, t, "sine", 120 * p, (55 - 15 * k) * p, 130, 0.65 * punch, 30, (560 + 240 * k) * len);
      hiss(d, t, [["bandpass", rnd(2000, 3500), 0, 0, 0.6], ["peaking", 5000, 0, 0, 1]], 10, 0.5, 80);
      hiss(d, t, [["lowpass", 4000, 400, 150, 1.2]], (0.6 + 0.4 * k), 3, 420 * len, rnd(3, 15));
    },
    ko(d, t) { // a crack, a low boom that swells for 230 ms, a falling sub, debris rumble, air, sand
      const len = rnd(0.9, 1.1);
      hiss(d, t, [["bandpass", 1800, 0, 0, 0.5]], 8, 0.5, 140);
      const boom = ctx.createGain(), bs = ctx.createBufferSource(), l1 = ctx.createBiquadFilter(), l2 = ctx.createBiquadFilter();
      bs.buffer = noise; bs.loop = true; l1.type = l2.type = "lowpass"; l1.frequency.value = rnd(150, 220); l2.frequency.value = 250; l1.Q.value = 0.7;
      boom.gain.setValueAtTime(0.0001, t); boom.gain.linearRampToValueAtTime(0.75, t + 0.23); boom.gain.setTargetAtTime(0.0001, t + 0.23, 1.3 * len);
      bs.connect(l1); l1.connect(l2); l2.connect(boom); boom.connect(d); bs.start(t); bs.stop(t + 3 * len);
      const sub = ctx.createOscillator(), sg = ctx.createGain();
      sub.type = "sine"; sub.frequency.setValueAtTime(rnd(60, 75), t); sub.frequency.exponentialRampToValueAtTime(34, t + 1.2 * len);
      sg.gain.setValueAtTime(0.0001, t); sg.gain.linearRampToValueAtTime(0.42, t + 0.03); sg.gain.setTargetAtTime(0.0001, t + 0.03, 0.8 * len);
      sub.connect(sg); sg.connect(d); sub.start(t); sub.stop(t + 2.6 * len);
      flutter(d, t + 0.06, rnd(9, 14), 1500 * len, 0.8, 420, 380);
      hiss(d, t, [["bandpass", 7000, 0, 0, 0.8]], 0.5, 20, 600);
      hiss(d, t, [["bandpass", 3000, 1000, 900, 2]], 0.6, 40, 1400); // desert touch: an outgoing sand-blast hiss
    },
    swing(d, t, o) { // the miss whoosh: about 6 dB under hits, a band sweeping down
      const c = o.long ? 0.75 : 1, len = o.long ? 160 : 110;
      hiss(d, t, [["bandpass", rnd(2200, 3000) * c, rnd(700, 900) * c, len, rnd(1.2, 2)]], 1, 30, o.long ? 320 : 240);
    },
    swingHeavy(d, t) { SOUNDS.swing(d, t, { long: 1 }); },
    jump(d, t) { hiss(d, t, [["highpass", 3000], ["bandpass", rnd(5000, 8000), 0, 0, 0.7]], 1, 10, 280); },
    airJump(d, t) { // the same puff with a lift and a second flap
      hiss(d, t, [["highpass", 3000], ["bandpass", 4000, 7000, 80, 0.9]], 1, 10, 260);
      hiss(d, t, [["highpass", 3000], ["bandpass", 5000, 7500, 80, 0.9]], 0.7, 10, 220, 14);
    },
    land(d, t) { // near silent in the reference: a soft thud and a light sand scuff
      osc(d, t, "sine", 90, 55, 40, 0.3, 2, 180);
      hiss(d, t, [["bandpass", 3500, 0, 0, 1.5]], 0.3, 4, 160);
    },
    dodge(d, t) { // sweeps UP, unlike the swing, with a faint shimmer
      hiss(d, t, [["bandpass", 600, 2500, 80, 1.5]], 1, 15, 260);
      const o = osc(d, t, "sine", 1800, 1800, 0, 0.06, 5, 240), v = ctx.createOscillator(), vg = ctx.createGain();
      v.frequency.value = 30; vg.gain.value = 40; v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t + 0.2);
    },
    dash(d, t) { SOUNDS.dodge(d, t); hiss(d, t, [["bandpass", 3500, 0, 0, 1.5]], 0.4, 6, 160); },
    parry(d, t) { // a plate-like clang: lower partials ring longer, a click and a small thump
      const b = rnd(0.95, 1.05);
      [[520, 0.3, 1400], [1170, 0.22, 1000], [1930, 0.15, 700], [2810, 0.1, 500], [4100, 0.06, 350]].forEach(([f, m, dec]) => osc(d, t, "sine", f * b, f * b, 0, m * rnd(0.8, 1.2), 1, dec));
      hiss(d, t, [["highpass", 3000]], 0.6, 1, 40);
      osc(d, t, "sine", 180, 120, 60, 0.4, 2, 200);
    },
    count(d, t, o) { // pitched stinger in place of the reference's announcer: D5, E5, F#5
      const f = [740, 659, 587][Math.max(0, Math.min(2, (o.n || 3) - 1))];
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2500; lp.connect(d);
      const sq = osc(lp, t, "square", f, f * 1.003, 380, 0.28, 5, 900);
      osc(d, t, "triangle", f / 2, f / 2, 0, 0.12, 5, 900);
      return sq;
    },
    go(d, t) { // A major chord opening up, with a noise swell
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(1500, t); lp.frequency.exponentialRampToValueAtTime(6000, t + 0.2); lp.connect(d);
      for (const f of [880, 1109, 1319]) osc(lp, t, "sawtooth", f, f, 0, 0.12, 8, 1400);
      osc(d, t, "triangle", 440, 440, 0, 0.18, 8, 1400);
      hiss(d, t, [["highpass", 2000]], 0.5, 150, 600);
    },
    game(d, t) { // a short KO-style boom, then a falling arpeggio A5 E5 C5 A4
      osc(d, t, "sine", 70, 34, 700, 0.9, 20, 1600);
      hiss(d, t, [["lowpass", 220]], 0.8, 200, 1200);
      [880, 659, 523, 440].forEach((f, k) => osc(d, t, "triangle", f, f, 0, 0.3, 3, k === 3 ? 1400 : 220, 300 + k * 100));
    },
    uiMove(d, t) { osc(d, t, "sine", 1800 * rnd(0.98, 1.02), 1800, 0, 0.3, 1, 80); },
    uiConfirm(d, t) { osc(d, t, "triangle", 660, 660, 0, 0.4, 2, 160); osc(d, t, "triangle", 880, 880, 0, 0.4, 2, 160, 60); },
  };

  // A fighter's own layers. `swap` replaces the shared sound; `punch` softens the shared hit body.
  const FLAVOR = {
    "vampire-countess": {
      punch: 0.7, // her hits read as precise, not blunt
      hit(d, t) { const b = rnd(0.97, 1.03); // a thin rapier ring
        [[2400, 0.2, 700], [3610, 0.13, 480], [5230, 0.08, 320]].forEach(([f, m, dec]) => osc(d, t, "sine", f * b, f * b, 0, m, 1, dec));
        hiss(d, t, [["highpass", 4000]], 0.4, 0.5, 12); },
      hitHeavy(d, t) { const b = rnd(0.97, 1.03);
        [[1800, 0.24, 1200], [2710, 0.15, 850], [3920, 0.09, 550]].forEach(([f, m, dec]) => osc(d, t, "sine", f * b, f * b, 0, m, 1, dec)); },
      swap: { swing(d, t) { hiss(d, t, [["bandpass", 3500, 1500, 80, 3]], 1.4, 20, 220); } }, // a thinner blade swish
      dodge(d, t) { flutter(d, t, rnd(14, 18), 380, 0.2 * 2.5, 600, 950); },          // a burst of bats
      dash(d, t) { flutter(d, t, rnd(14, 18), 300, 0.2 * 2.5, 600, 950); },
      swingHeavy(d, t, o) { if (o.mv === 6) flutter(d, t, rnd(14, 18), 450, 0.25 * 2.5, 600, 950); }, // Bat Swarm
      parry(d, t) { hiss(d, t, [["lowpass", 900, 300, 120, 0.8]], 0.7, 4, 360); },   // the canopy snapping open
      ko(d, t) { // the KO she scores ends on a short minor organ chord
        for (const f of [220, 261.6, 329.6, 440]) { osc(d, t, "sawtooth", f, f, 0, 0.05, 30, 2200, 120); osc(d, t, "square", f / 2, f / 2, 0, 0.025, 30, 2200, 120); }
      },
    },
  };

  const GAIN = { hit: 1, hitHeavy: 1, ko: 1, parry: 1, game: 0.9, go: 0.7, count: 0.67, swing: 1.35, swingHeavy: 1.35, dodge: 1.6, dash: 1.4, jump: 0.32, airJump: 0.3, land: 0.27, uiMove: 0.6, uiConfirm: 0.6 };
  const LONG = { ko: 2.2, game: 1.6, go: 0.9, parry: 0.8 };
  // name: one of SOUNDS; pan: -1 to 1 (kept within 0.3: the reference is mono); o: { fighter, scorer, k, mv, n }
  function play(name, pan, o = {}, when) {
    if (!ctx || muted || (when === undefined && ctx.state !== "running")) return;
    const fn = SOUNDS[name];
    if (!fn) return;
    const t = when === undefined ? ctx.currentTime + 0.005 : when;
    // a 25 ms cooldown per sound so strings do not stack identical transients
    if (last[name] !== undefined && t - last[name] < 0.025 && t >= last[name]) return;
    last[name] = t;
    // at most 12 voices: steal the oldest that is not a KO tail
    voices = voices.filter((v) => v.end > t);
    if (voices.length >= 12) { const v = voices.find((v) => v.name !== "ko"); if (v) { v.g.gain.setTargetAtTime(0, t, 0.01); voices.splice(voices.indexOf(v), 1); } }
    const fl = (o.scorer && FLAVOR[o.scorer]) || (o.fighter && FLAVOR[o.fighter]) || {};
    const g = ctx.createGain(); g.gain.value = (GAIN[name] || 0.6) * rnd(0.84, 1.18); // about +-1.5 dB
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-0.3, Math.min(0.3, (pan || 0) * 0.3)); g.connect(p); p.connect(sfxBus); }
    else g.connect(sfxBus);
    const opt = { ...o, punch: fl.punch };
    (fl.swap && fl.swap[name] ? fl.swap[name] : fn)(g, t, opt);
    if (fl[name]) fl[name](g, t, opt);
    voices.push({ name, g, end: t + (LONG[name] || 0.5) });
  }
  function toggle() {
    muted = !muted;
    try { localStorage.setItem("dune-brawl-muted", muted ? "1" : "0"); } catch (e) { /* private mode */ }
    if (master) master.gain.value = muted ? 0 : 0.9;
    return muted;
  }
  // Render a list of { t (seconds), name, pan, o } offline, for recordings: returns [left, right]
  async function render(events, seconds, rate = 44100) {
    const live = { ctx, master, sfxBus, noise, muted, voices, last };
    muted = false;
    setup(new OfflineAudioContext(2, Math.ceil(seconds * rate), rate));
    for (const e of [...events].sort((a, b) => a.t - b.t)) play(e.name, e.pan, e.o || {}, e.t);
    const buf = await ctx.startRendering();
    ({ ctx, master, sfxBus, noise, muted, voices, last } = live);
    return [buf.getChannelData(0), buf.getChannelData(1)];
  }

  root.Sfx = { play, toggle, init, render, get muted() { return muted; } };
})(this);
