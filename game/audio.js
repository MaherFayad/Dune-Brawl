// Dune Brawl sound: recorded, freely licensed samples (assets/audio, sources and licenses in
// assets/audio/CREDITS.md), played through the Web Audio API. Levels, envelopes and spectra follow
// docs/design/REFERENCE-SFX.md and are baked into the files: hits stay at nearly one loudness and show
// strength through sub weight and crack; the KO is the only long tail; swings sit about 6 dB under
// hits, jumps about 13, landings about 20; the announcer about 8; the music bed 15 to 20 dB under
// hits, the results theme 6 to 9 dB louder than that. Everything is near mono. Each sound has 2 to 4
// recorded variants, picked at random with a +-5% pitch jitter, so repeats never sound identical.
// A fighter can add or swap layers (FLAVOR). Sound is render-only: it never touches the sim.
(function (root) {
  "use strict";
  const DIR = "../assets/audio/";
  let ctx = null, master = null, sfxBus = null, musicBus = null, muted = false, musicVol = 1;
  let voices = [], last = {}, song = null, wanted = null;
  try { muted = localStorage.getItem("dune-brawl-muted") === "1"; } catch (e) { /* private mode */ }
  try { const v = parseFloat(localStorage.getItem("dune-brawl-music")); if (v >= 0 && v <= 1) musicVol = v; } catch (e) { /* private mode */ }

  // ---------- the sample banks: name -> files (without .mp3) ----------
  const range = (stem, n) => Array.from({ length: n }, (_, k) => stem + (k + 1));
  const FILES = {
    hit: range("sfx/hit", 4), heavy: range("sfx/heavy", 4), ko: range("sfx/ko", 2),
    swing: range("sfx/swing", 4), swingHeavy: range("sfx/swingHeavy", 2), dodge: range("sfx/dodge", 3), dash: range("sfx/dash", 2),
    jump: range("sfx/jump", 4), land: range("sfx/land", 4), parry: range("sfx/parry", 2),
    uiMove: ["sfx/uiMove"], uiConfirm: ["sfx/uiConfirm"],
    vEdge: range("sfx/v_edge", 3), vSwing: range("sfx/v_swing", 3), vFlutter: range("sfx/v_flutter", 3), vParasol: ["sfx/v_parasol"],
    three: ["voice/vo_three"], two: ["voice/vo_two"], one: ["voice/vo_one"], fight: ["voice/vo_fight"],
    koCall: ["voice/vo_ko"], gameCall: ["voice/vo_game"], winner: ["voice/vo_winner"],
  };
  const MUSIC = { battle: "music/battle", results: "music/results", menu: "music/menu" };
  // music gain per track (dB), from the files' -16 LUFS: measured in a render, the battle bed plays at
  // -28 LUFS, about 18 dB under a hit (the reference: -26 to -30 LUFS); the results theme 8 dB louder
  // (the reference: 6 to 9); the menu between the two
  const MUSIC_DB = { battle: -11, results: -3.5, menu: -6 };

  // fetch and decode once; AudioBuffers play in any context, so the same buffers serve the live
  // game and the offline renders. Decoding uses its own OfflineAudioContext, so it needs no gesture.
  const bufs = {}, decoded = {}; // path -> promise of an AudioBuffer; path -> AudioBuffer once decoded
  const decoder = () => new (root.OfflineAudioContext || root.webkitOfflineAudioContext)(1, 1, 44100);
  async function fetchBuf(path) {
    if (!(path in bufs)) {
      bufs[path] = fetch(DIR + path + ".mp3").then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((ab) => decoder().decodeAudioData(ab)).then((b) => (decoded[path] = b))
        .catch(() => null); // a missing file only drops that variant
    }
    return bufs[path];
  }
  let sfxReady = null;
  function loadSfx() { return (sfxReady = sfxReady || Promise.all(Object.values(FILES).flat().map(fetchBuf))); }
  if (root.fetch && (root.OfflineAudioContext || root.webkitOfflineAudioContext)) loadSfx();
  const get = (path) => decoded[path];

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return;
    setup(new AC());
    if (wanted) music(wanted); // a track asked for before the first gesture starts now
  }
  // sfx + music -> master (mute) -> soft limiter -> out. The relative levels are baked into the files,
  // so there is no compressor: nothing ducks the music (the reference has no ducking) and no lookahead
  // delays a hit off its contact frame. The limiter is a waveshaper, linear up to -3 dBFS and bending
  // smoothly towards 0 dBFS above it, so only stacked peaks are touched.
  const LIMIT = (() => {
    const n = 4096, c = new Float32Array(n), k = 0.708; // -3 dBFS
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x); c[i] = a <= k ? x : Math.sign(x) * (k + (1 - k) * Math.tanh((a - k) / (1 - k))); }
    return c;
  })();
  function setup(c) {
    ctx = c; voices = []; last = {}; song = null;
    const lim = ctx.createWaveShaper(); lim.curve = LIMIT; lim.oversample = "none";
    master = ctx.createGain(); master.gain.value = muted ? 0 : 1;
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.93; // a light hit peaks near -5 dBFS, as measured in the reference
    musicBus = ctx.createGain(); musicBus.gain.value = musicVol;
    sfxBus.connect(master); musicBus.connect(master); master.connect(lim); lim.connect(ctx.destination);
  }
  // browsers only start audio after a user gesture
  for (const ev of ["keydown", "pointerdown", "touchstart"]) root.addEventListener(ev, init, { passive: true });

  // ---------- the palette: each sound is a list of layers { b: bank, g: dB, d: delay s, r: rate } ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const SOUNDS = {
    hit: [{ b: "hit" }],
    hitHeavy: [{ b: "heavy" }],
    ko: [{ b: "ko" }, { b: "koCall", d: 0.3, voice: 1 }], // the announcer calls it once the boom has opened
    swing: [{ b: "swing" }],
    swingHeavy: [{ b: "swingHeavy" }],
    jump: [{ b: "jump" }],
    airJump: [{ b: "jump", r: 1.08 }], // the same puff, lifted a little
    land: [{ b: "land" }],
    dodge: [{ b: "dodge" }],
    dash: [{ b: "dash" }],
    parry: [{ b: "parry" }],
    count: [{ b: "count", voice: 1 }], // o.n: 3, 2 or 1
    go: [{ b: "fight", voice: 1 }],
    game: [{ b: "gameCall", voice: 1 }],
    winner: [{ b: "winner", voice: 1 }],
    uiMove: [{ b: "uiMove" }],
    uiConfirm: [{ b: "uiConfirm" }],
  };
  // A fighter's own touches: `swap` replaces a shared sound, `add` layers over it. Kept light: the
  // added layers sit about 12 dB under the shared one, as the reference has no extra loud layers.
  const FLAVOR = {
    "vampire-countess": { // Vespera: a rapier inside a parasol, and bats
      add: {
        hit: [{ b: "vEdge" }],               // a faint metallic edge on her hits
        hitHeavy: [{ b: "vEdge", g: 2 }],
        parry: [{ b: "vParasol", g: -2 }],   // the parasol canopy opens under the clang
      },
      swap: {
        swing: [{ b: "vSwing" }],            // a thinner blade swish with a faint shing
        dodge: [{ b: "vFlutter" }],          // a soft bat-wing flutter
        dash: [{ b: "vFlutter" }],
        swingHeavy: (o) => (o.mv === 6 ? [{ b: "vFlutter", g: 2 }] : null), // Bat Swarm, her recovery
      },
    },
  };
  const LONG = { ko: 2.2, game: 1, winner: 1, count: 0.7, go: 0.7 }; // voices that are never stolen, with their length
  const COUNT = { 3: "three", 2: "two", 1: "one" };
  const lastPick = {};
  function pick(bank) { // a random variant, never the same one twice in a row
    const files = (FILES[bank] || []).filter(get);
    if (!files.length) return null;
    let k = Math.floor(Math.random() * files.length);
    if (files.length > 1 && files[k] === lastPick[bank]) k = (k + 1) % files.length;
    return get((lastPick[bank] = files[k]));
  }

  // name: one of SOUNDS; pan: -1 to 1 (kept within 0.3: the reference is mono); o: { fighter, scorer, k, mv, n, chain }
  function play(name, pan, o = {}, when) {
    if (!ctx || muted || (when === undefined && ctx.state !== "running")) return;
    let layers = SOUNDS[name];
    if (!layers) return;
    const t = when === undefined ? ctx.currentTime + 0.005 : when;
    // a 25 ms cooldown per sound so strings do not stack identical transients
    if (last[name] !== undefined && t - last[name] < 0.025 && t >= last[name]) return;
    last[name] = t;
    const fl = (o.scorer && FLAVOR[o.scorer]) || (o.fighter && FLAVOR[o.fighter]) || {};
    const sw = fl.swap && fl.swap[name], swapped = typeof sw === "function" ? sw(o) : sw;
    layers = (swapped || layers).concat((fl.add && fl.add[name]) || []);
    // at most 12 voices: steal the oldest that is not a KO tail or an announcer line
    voices = voices.filter((v) => v.end > t);
    while (voices.length >= 12) { const v = voices.find((v) => !v.keep); if (!v) break; v.g.gain.setTargetAtTime(0, t, 0.01); voices.splice(voices.indexOf(v), 1); }
    const out = ctx.createGain();
    out.gain.value = Math.pow(10, rnd(-1, 1) / 20); // about +-1 dB
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-0.3, Math.min(0.3, (pan || 0) * 0.3)); out.connect(p); p.connect(sfxBus); }
    else out.connect(sfxBus);
    // strings rise 3% per hit; bigger knockback lands a touch deeper and up to +2 dB, never louder than that
    const kn = Math.max(0, Math.min(1, ((o.k || 20) - 18) / 30));
    const bend = (name === "hit" ? 1 + 0.03 * Math.min(4, o.chain || 0) : 1) * (name === "hitHeavy" ? 1 - 0.05 * kn : 1);
    if (name === "hitHeavy") out.gain.value *= Math.pow(10, 2 * kn / 20);
    let end = t;
    for (const L of layers) {
      const buf = pick(L.b === "count" ? COUNT[o.n] || "three" : L.b);
      if (!buf) continue;
      const s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = buf; s.playbackRate.value = (L.r || 1) * (L.voice ? 1 : bend * rnd(0.95, 1.05)); // +-5% pitch jitter, not on the voice
      g.gain.value = Math.pow(10, (L.g || 0) / 20);
      s.connect(g); g.connect(out); s.start(t + (L.d || 0));
      end = Math.max(end, t + (L.d || 0) + buf.duration / s.playbackRate.value);
    }
    voices.push({ g: out, end: Math.max(end, t + (LONG[name] || 0)), keep: name in LONG });
  }

  // ---------- music: one looping bed at a time, crossfaded; loading screens stay silent ----------
  // c and bus are captured before the fetch, so a render that swaps the context meanwhile cannot steal the song
  async function startSong(c, bus, name, t, fadeIn) {
    const buf = await fetchBuf(MUSIC[name]);
    if (!buf || !c) return null;
    const s = c.createBufferSource(), g = c.createGain();
    s.buffer = buf; s.loop = true;
    const lvl = Math.pow(10, MUSIC_DB[name] / 20);
    g.gain.setValueAtTime(fadeIn ? 0.0001 : lvl, t); if (fadeIn) g.gain.exponentialRampToValueAtTime(lvl, t + fadeIn);
    s.connect(g); g.connect(bus); s.start(t);
    return { name, s, g, c };
  }
  function fadeOut(sg, len) { if (!sg) return; const t = sg.c.currentTime; sg.g.gain.setTargetAtTime(0, t, len / 4); sg.s.stop(t + len + 0.05); }
  // name: "battle", "results" or "menu"; asking for the track already playing does nothing
  async function music(name) {
    if (!MUSIC[name]) return;
    wanted = name;
    if (!ctx || (song && song.name === name)) return;
    const old = song; song = { name, pending: true };
    const sg = await startSong(ctx, musicBus, name, ctx.currentTime + 0.05, 0.6);
    if (wanted !== name) { fadeOut(sg, 0.2); return; } // a later request won the race
    fadeOut(old && old.s ? old : null, 0.5);
    song = sg || null;
  }
  function stopMusic() {
    wanted = null;
    if (song && song.s) fadeOut(song, 0.4);
    song = null;
  }
  function musicVolume(v) {
    if (v === undefined) return musicVol;
    musicVol = Math.max(0, Math.min(1, v));
    try { localStorage.setItem("dune-brawl-music", String(musicVol)); } catch (e) { /* private mode */ }
    if (musicBus) musicBus.gain.value = musicVol;
    return musicVol;
  }

  function toggle() {
    muted = !muted;
    try { localStorage.setItem("dune-brawl-muted", muted ? "1" : "0"); } catch (e) { /* private mode */ }
    if (master) master.gain.value = muted ? 0 : 1;
    return muted;
  }
  // Render a list of { t (seconds), name, pan, o } offline, for recordings: returns [left, right].
  // opts.music: a track name to run under the whole render from t = 0, or true to follow
  // { name: "music", o: { track } } events in the list (track null stops it). Off by default.
  async function render(events, seconds, rate = 44100, opts = {}) {
    await loadSfx();
    const live = { ctx, master, sfxBus, musicBus, muted, voices, last, song, wanted };
    muted = false;
    setup(new OfflineAudioContext(2, Math.ceil(seconds * rate), rate));
    const sorted = [...events].sort((a, b) => a.t - b.t);
    const cues = typeof opts.music === "string" ? [{ t: 0, track: opts.music }]
      : opts.music === true ? sorted.filter((e) => e.name === "music").map((e) => ({ t: e.t, track: (e.o || {}).track })) : [];
    const c0 = ctx, bus = musicBus; let cur = null;
    for (const c of cues) {
      if (cur && cur.name === c.track) continue;
      if (cur) { cur.g.gain.setTargetAtTime(0, c.t, 0.12); cur.s.stop(c.t + 0.6); cur = null; }
      if (c.track && MUSIC[c.track]) cur = await startSong(c0, bus, c.track, c.t, c.t > 0 ? 0.6 : 0);
    }
    for (const e of sorted) if (e.name !== "music") play(e.name, e.pan, e.o || {}, e.t);
    const buf = await ctx.startRendering();
    ({ ctx, master, sfxBus, musicBus, muted, voices, last, song, wanted } = live);
    return [buf.getChannelData(0), buf.getChannelData(1)];
  }

  root.Sfx = { play, toggle, init, render, music, stopMusic, musicVolume, ready: loadSfx, get muted() { return muted; } };
})(this);
