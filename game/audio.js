// Dune Brawl sound: every effect is synthesized with the Web Audio API (oscillators, filtered
// noise and envelopes), so there are no audio files to download and nothing is copied from the
// reference. The palette follows the reference's layering (see docs/design/REFERENCE-SFX.md): a
// hit is a low body thump plus a short noise crack, bigger hits add weight and length, a KO is a
// long boom with a falling noise tail. A fighter can add its own layer on top (FLAVOR).
// Sound is render-only: it never changes the sim, so rollback and replays are unaffected.
(function (root) {
  "use strict";
  let ctx = null, master = null, noise = null, muted = false;
  try { muted = localStorage.getItem("dune-brawl-muted") === "1"; } catch (e) { /* private mode */ }

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); // glue overlapping hits without clipping
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.8;
    master.connect(comp); comp.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
  }
  // browsers only start audio after a user gesture
  for (const ev of ["keydown", "pointerdown", "touchstart"]) root.addEventListener(ev, init, { passive: true });

  // ---------- building blocks ----------
  const jit = (v, j) => v * (1 + (Math.random() * 2 - 1) * j);
  function out(pan, gain) {
    const g = ctx.createGain(); g.gain.value = gain;
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan * 0.6; g.connect(p); p.connect(master); }
    else g.connect(master);
    return g;
  }
  // envelope: instant attack (a), exponential decay over d seconds
  function env(param, t, peak, a, d) {
    param.setValueAtTime(0.0001, t); param.exponentialRampToValueAtTime(peak, t + a); param.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(dest, t, type, f0, f1, peak, a, d) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + a + d);
    env(g.gain, t, peak, a, d); o.connect(g); g.connect(dest); o.start(t); o.stop(t + a + d + 0.05);
  }
  function hiss(dest, t, type, f0, f1, q, peak, a, d) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; s.loop = true; f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + a + d);
    env(g.gain, t, peak, a, d); s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + a + d + 0.05);
  }
  // a flutter: noise chopped at wing-beat rate, for bats
  function flutter(dest, t, rate, len, peak) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), depth = ctx.createGain();
    s.buffer = noise; s.loop = true; f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.9;
    lfo.type = "square"; lfo.frequency.value = rate; depth.gain.value = peak * 0.5;
    g.gain.setValueAtTime(peak * 0.5, t); g.gain.linearRampToValueAtTime(0, t + len);
    lfo.connect(depth); depth.connect(g.gain); s.connect(f); f.connect(g); g.connect(dest);
    s.start(t); lfo.start(t); s.stop(t + len + 0.05); lfo.stop(t + len + 0.05);
  }

  // ---------- the palette ----------
  const SOUNDS = {
    hit(d, t, o) {        // light hit: short thump + bright crack
      const k = Math.min(1, (o.k || 10) / 30);
      tone(d, t, "sine", jit(150, 0.08), 55, 0.9, 0.002, 0.09 + k * 0.05);
      hiss(d, t, "bandpass", jit(2600, 0.15), 1500, 0.9, 0.55, 0.001, 0.05);
      hiss(d, t, "highpass", 5000, 5000, 0.7, 0.18, 0.001, 0.025);
    },
    hitHeavy(d, t, o) {   // strong hit: deeper, longer body, a lower crunch and a tail
      tone(d, t, "sine", jit(120, 0.06), 38, 1.0, 0.002, 0.24);
      tone(d, t, "triangle", jit(240, 0.06), 70, 0.35, 0.002, 0.12);
      hiss(d, t, "bandpass", jit(1800, 0.1), 600, 0.8, 0.75, 0.001, 0.12);
      hiss(d, t, "lowpass", 900, 200, 0.7, 0.45, 0.005, 0.32);
    },
    ko(d, t) {            // KO: a long boom, a falling roar and a bright blast on top
      tone(d, t, "sine", 90, 28, 1.0, 0.004, 1.1);
      tone(d, t, "triangle", 180, 50, 0.4, 0.004, 0.5);
      hiss(d, t, "lowpass", 4000, 160, 0.6, 0.9, 0.006, 1.3);
      hiss(d, t, "bandpass", 3000, 900, 1.2, 0.5, 0.002, 0.25);
    },
    swing(d, t) { hiss(d, t, "bandpass", jit(900, 0.15), 3400, 1.6, 0.22, 0.03, 0.08); },
    swingHeavy(d, t) { hiss(d, t, "bandpass", jit(500, 0.1), 2400, 1.3, 0.32, 0.06, 0.16); },
    jump(d, t) { hiss(d, t, "highpass", 1400, 2600, 0.7, 0.16, 0.005, 0.07); tone(d, t, "sine", 260, 420, 0.08, 0.004, 0.06); },
    airJump(d, t) { hiss(d, t, "bandpass", 1200, 3200, 1.0, 0.2, 0.01, 0.12); },
    land(d, t) { hiss(d, t, "lowpass", 700, 250, 0.8, 0.3, 0.002, 0.08); tone(d, t, "sine", 110, 60, 0.25, 0.002, 0.06); },
    dodge(d, t) { hiss(d, t, "bandpass", 3200, 700, 1.4, 0.28, 0.01, 0.17); },
    dash(d, t) { hiss(d, t, "bandpass", 2400, 600, 1.1, 0.3, 0.005, 0.2); hiss(d, t, "lowpass", 600, 300, 0.7, 0.18, 0.005, 0.12); },
    parry(d, t) {         // a metallic clang: inharmonic partials and a click
      for (const [r, a] of [[1, 0.5], [2.76, 0.32], [5.4, 0.2], [8.9, 0.1]]) tone(d, t, "triangle", 620 * r, 620 * r, a, 0.001, 0.45 / Math.sqrt(r));
      hiss(d, t, "highpass", 3000, 3000, 0.7, 0.5, 0.001, 0.03);
    },
    count(d, t) { tone(d, t, "square", 440, 440, 0.12, 0.004, 0.14); tone(d, t, "sine", 880, 880, 0.1, 0.004, 0.2); },
    go(d, t) {            // a bright brass stab under the go word
      for (const f of [392, 494, 587, 784]) { tone(d, t, "sawtooth", f, f, 0.07, 0.01, 0.55); }
      tone(d, t, "sine", 98, 60, 0.6, 0.005, 0.4); hiss(d, t, "highpass", 4000, 4000, 0.7, 0.2, 0.002, 0.08);
    },
    game(d, t) { tone(d, t, "sine", 70, 30, 0.9, 0.004, 1.0); for (const f of [262, 330, 392, 523]) tone(d, t, "sawtooth", f, f, 0.06, 0.01, 1.0); },
  };

  // a fighter's own layer on top of the shared sound
  const FLAVOR = {
    "vampire-countess": {
      hit(d, t) { tone(d, t + 0.005, "sine", jit(2350, 0.04), 2300, 0.12, 0.001, 0.28); tone(d, t + 0.005, "sine", 3520, 3500, 0.06, 0.001, 0.2); }, // rapier ting
      hitHeavy(d, t) { tone(d, t + 0.005, "sine", 1760, 1740, 0.16, 0.001, 0.45); tone(d, t + 0.005, "sine", 2640, 2600, 0.08, 0.001, 0.35); },
      swing(d, t) { hiss(d, t, "highpass", 5200, 5200, 0.8, 0.12, 0.01, 0.06); },        // a thin blade swish
      dodge(d, t) { flutter(d, t, 17, 0.28, 0.35); },                                   // a burst of bats
      dash(d, t) { flutter(d, t, 19, 0.22, 0.3); },
      swingHeavy(d, t, o) { if (o.mv === 6) flutter(d, t, 15, 0.5, 0.4); },             // Bat Swarm
      ko(d, t) {            // her KO ends on a short minor organ chord
        for (const f of [220, 261.6, 329.6, 440]) { tone(d, t + 0.12, "sawtooth", f, f, 0.05, 0.03, 0.9); tone(d, t + 0.12, "square", f / 2, f / 2, 0.025, 0.03, 0.9); }
      },
    },
  };

  // name: one of SOUNDS, pan: -1 left to 1 right, o: { fighter, k, mv } for flavour and size
  function play(name, pan, o = {}) {
    if (!ctx || muted || ctx.state !== "running") return;
    const fn = SOUNDS[name];
    if (!fn) return;
    const t = ctx.currentTime + 0.005, gain = { hit: 0.55, hitHeavy: 0.7, ko: 0.85, game: 0.7, go: 0.6 }[name] || 0.45;
    const d = out(pan || 0, gain);
    fn(d, t, o);
    const fl = o.scorer ? FLAVOR[o.scorer] : o.fighter && FLAVOR[o.fighter];
    if (fl && fl[name]) fl[name](d, t, o);
  }
  function toggle() {
    muted = !muted;
    try { localStorage.setItem("dune-brawl-muted", muted ? "1" : "0"); } catch (e) { /* private mode */ }
    if (master) master.gain.value = muted ? 0 : 0.8;
    return muted;
  }

  root.Sfx = { play, toggle, init, get muted() { return muted; } };
})(this);
