// Dune Brawl stick fighters: a procedural skeleton drawn with thick brush strokes, in place of
// sprite sheets. Every pose is a pure function of the sim state (like render.js), so rollback,
// replays and the offline recorder need nothing extra. A fighter is a colour, a prop and a set of
// key poses per move; the generic set covers any moveset, and a style can override any move.
//
// Local space: origin at the feet (the fighter's sim position), facing right (+x forward), y down.
// Angles are in degrees from straight down, positive toward the facing side. Elbows and knees add
// to the upper bone: forearm = arm + elbow, shin = thigh + knee.
(function (root) {
  "use strict";

  // bone lengths in body heights: head top at 1.0 when standing straight
  const B = { headR: 0.105, neck: 0.04, torso: 0.31, uarm: 0.165, farm: 0.165, thigh: 0.225, shin: 0.225 };
  // pose fields; a pose is a plain object, key poses are written as arrays in this order
  const F = ["lean", "head", "a1", "e1", "a2", "e2", "l1", "k1", "l2", "k2", "prop", "open", "dx", "dy", "rot", "spin"];
  const P = (arr) => { const o = {}; F.forEach((k, j) => (o[k] = arr[j] || 0)); return o; };
  const lerp = (a, b, t) => { const o = {}; for (const k of F) o[k] = a[k] + (b[k] - a[k]) * t; return o; };
  const add = (a, d) => { const o = { ...a }; for (const k in d) o[k] = (o[k] || 0) + d[k]; return o; };
  const eo = (u) => 1 - (1 - u) ** 3, eio = (u) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
  const R = Math.PI / 180;

  //                    lean head  a1   e1   a2    e2   l1   k1    l2   k2  prop open dx    dy   rot spin
  const BASE = {
    stance:  P([   8,  -4,  70,  25, -60,  -60,  25, -30, -25,  -5]),
    crouch:  P([  14,  -4,  65,  30, -55,  -55,  60,-110, -15, -95]),
    jump:    P([  10,   0, 120,  10,-110,   40,  70,-110,  30,-100]),
    fall:    P([   0,   0,  95,  10,-100,   50,  25, -25, -20, -40]),
    dash:    P([  45,   5,  40,  30, -80,   30,  70, -60, -55, -10]),
    back:    P([ -20,  -8,  60,  60, -40,   80,  40, -60, -10, -60,   0,   0, -0.08]),
    hurt:    P([ -35, -25, 150,  30,-140,  -30,  30, -40, -10, -60]),
    wall:    P([ -12,   8, 160, -20, -40,   40,  40, -80, -10, -60]),
    // the hard landing: one knee down, the blade planted beside her, the free arm flung back
    hero:    P([  30,  10,  15,  10, -70,  -40,  85,-150, -60, -95,   0,   0,  0.02]),
    // a fast fall is a dive: legs together, the blade straight down
    dive:    P([   8,  10,  10,   0,-150,   20,   5,   0,  -5,   5]),
    // launching off the ground: stretched long, arms swept up
    launch:  P([   5,  -8, 170, -10,-170,   10,   5,  -5, -15,  -5]),
    // the stick kit's moves
    slide:   P([ -38,  12,  60,  30,-130,   30,  88,  -5,  25,-115,   0,   0,  0.05]),
    tuck:    P([  20,  15, 110,-120,-110,  120,  95,-150,  85,-150]),
    superman:P([   0,   0, 178,   0, 165,   0,   4,   4,  -6,  -4]),
    skid:    P([ -28,  -6, 125,  -5,-125,   25,  55, -10, -35, -45]),
    knocked: P([ -20, -20, 120,  20,  60,   30,  80,-145, -40, -70,   0,   0,  0,  0.02]),
    flung:   P([   0,  15,  20,  10, -20,  -10,   8,  15,  -8,  25]),
    deep:    P([  22,   8,  50,  40, -60,  -60,  75,-140, -10,-120,   0,   0,  0,  0.04]),
  };
  // combos change limbs, as stick fights do: the blade, then a kick, then a flying finisher.
  // `turn` is a pirouette during the wind-up (a spinning kick lands facing forward); `spin` and
  // `flip` whirl over the active frames as before.
  //                                     lean head  a1   e1   a2    e2   l1   k1    l2   k2  prop open dx    dy   rot spin
  const KICKS = { // combo hit 2, by move
    // jab and side light: a spinning back kick, heel out at head height, the blade tucked
    0: { wind: P([ 25, 10,  60, 100, -80,  -40,  80,-140, -10, -20]), strike: P([-38, -5,  45, 110,-150,   30, 100,  -2, -12,  -8,  0, 0, 0.12]), turn: 360 },
    1: { wind: P([ 25, 10,  60, 100, -80,  -40,  80,-140, -10, -20]), strike: P([-38, -5,  45, 110,-150,   30, 100,  -2, -12,  -8,  0, 0, 0.16]), turn: 360 },
    // down light: a spinning leg sweep along the floor, a hand down for balance
    2: { wind: P([ 30,  5,  90,  40, -60,  -60,  75,-150, -10,-120]), strike: P([ 35, 10, 110,   0, -75,  -10,  86,   0, -30,-140,  0, 0, 0.1]), turn: 360 },
    // up light: a backflip kick, the leg sweeping up through the target
    3: { wind: P([ 15,  0,  40,  40, -60,  -60,  70,-120, -15, -95]), strike: P([-25, -10,  20,  60,-130,   20, 175,  -5, -20, -40,  0, 0, 0, -0.2]), spin: -360 },
    // neutral air: an axe kick, the heel brought down from overhead
    4: { wind: P([-15,  0, 120,  20,-120,   20, 175,  -5, -20, -40]), strike: P([ 25, 10,  80,  60, -90,   30,  70,  -5, -15, -60]) },
    // down air: a double stomp, both heels driven down
    8: { wind: P([  0,  0, 140,  30,-140,  -30,  80,-130,  70,-130]), strike: P([  5, 10, 120,  20,-120,  -20,  12,  -3,  -8,  -3]) },
  };
  const FINISH = { // combo hit 3, by move: the finisher, bigger in every way
    // a flying side kick: the whole body laid out flat behind one straight leg, heel first
    0: { wind: P([ 22,  8,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([  0, 20, 150,  30,-165,   10,   4,   0, -55,-110,  0, 0, 0.3, -0.3, -78]) },
    1: { wind: P([ 22,  8,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([  0, 20, 150,  30,-165,   10,   4,   0, -55,-110,  0, 0, 0.4, -0.32, -80]) },
    // a breakdance windmill: two sweeps in one spin
    2: { wind: P([ 30,  5,  90,  40, -60,  -60,  75,-150, -10,-120]), strike: P([ 40, 10, 120,   0, -60,  -10,  86,   0,  70,   0,  0, 0, 0.1]), spin: 720, flip: 1 },
    // a rising flip: the blade carried up through a front flip
    3: { wind: P([ 22,  0,  40,  40, -60,  -60,  75,-140, -10,-120]), strike: P([ -5,-15, 178,   0,-178,    0,   5,  -5,  -5,  -5,  0, 0, 0, -0.28]), spin: 360 },
    // neutral air: a double whirl, legs out like a propeller
    4: { wind: P([ 10,  0, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([  5,  0,  95,   0, -95,    0,  80,   0, -80,   0]), spin: 720 },
    // down air: a corkscrew plunge, straight as a drill, the blade leading
    8: { wind: P([ 10,  0, 160,  20,-140,   20,  70,-120,  60,-120]), strike: P([ 10, 15,  10,   0, -10,    0,   5,   0,  -5,   0,  0, 0, 0, 0.1]), spin: 1080, flip: 1 },
  };
  // more ways to throw each step: the sim's roll (p.vr) picks one, so a string rarely repeats
  //                                     lean head  a1   e1   a2    e2   l1   k1    l2   k2  prop open dx    dy   rot spin
  const KICKS_ALT = {
    0: [{ wind: P([ -5,  0,  60,  80, -60,  -60,  60, -90, -20, -10]), strike: P([-48,-10, 120,  60, 150,  -60, 128,  -5, -12,  -5,  0, 0, 0.08]) }, // a high roundhouse to the head
        { wind: P([ 15,  5,  80,  60, -40,  -90,  40, -60, -20, -10]), strike: P([ 20,  5,  60, 100,  70,  -90,  95,-140, -25, -10,  0, 0, 0.08]) }], // a knee and an elbow
    1: [{ wind: P([ -5,  0,  60,  80, -60,  -60,  60, -90, -20, -10]), strike: P([-48,-10, 120,  60, 150,  -60, 128,  -5, -12,  -5,  0, 0, 0.12]) },
        { wind: P([ 15,  5,  80,  60, -40,  -90,  40, -60, -20, -10]), strike: P([ 20,  5,  60, 100,  70,  -90,  95,-140, -25, -10,  0, 0, 0.12]) }],
    2: [{ wind: P([ 30,  5, -40,  40, -60,  -60,  75,-150, -10,-120]), strike: P([ 35,  5,  95,   0, -70,  -40,  75,-150, -10,-120,  0, 0, 0.1]), turn: 360 }], // a spinning low cut
    3: [{ wind: P([ 10,  0,  40,  40, -60,  -60,  60,-100, -15, -60]), strike: P([-10, -10, 150,  20,-160,   20, 110,-140, -15, -10,  0, 0, 0, -0.12]) }], // a rising knee
    4: [{ wind: P([ 10,  0, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([ -5,  0,  60,  90,-140,   20,  95,   0, -30, -60]), spin: 360, flip: 1 }], // a spinning heel
    8: [{ wind: P([  0,  0, 140,  30,-140,  -30,  80,-130,  70,-130]), strike: P([ 20, 10,  90,  60, -90,   30,  80,-140, -10, -10]) }], // a knee drop
  };
  const FINISH_ALT = {
    0: [{ wind: P([ 22,  8,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([-30, -5,  50, 100,-140,   20,  95,  -5, -40, -90,  0, 0, 0.3, -0.25]), spin: 720, flip: 1 }, // a tornado kick
        { wind: P([ 30,  8, -60,  40, -60,  -60,  75,-150, -10,-120]), strike: P([ -8,-15, 178,   0, -40,  -20,  10, -10, -30, -60,  0, 0, 0.1, -0.3]) }], // a rising dragon slash
    1: [{ wind: P([ 22,  8,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([-30, -5,  50, 100,-140,   20,  95,  -5, -40, -90,  0, 0, 0.36, -0.25]), spin: 720, flip: 1 },
        { wind: P([ 30,  8, -60,  40, -60,  -60,  75,-150, -10,-120]), strike: P([ -8,-15, 178,   0, -40,  -20,  10, -10, -30, -60,  0, 0, 0.15, -0.3]) }],
    2: [{ wind: P([ 35,  5, -50,  30, -60,  -60,  75,-150, -10,-120]), strike: P([ -5,-10, 170,   0, -60,  -20,  20, -20, -20, -40,  0, 0, 0.05, -0.12]) }], // a launcher: blade from the floor to the sky
    3: [{ wind: P([ 22,  0,  40,  40, -60,  -60,  75,-140, -10,-120]), strike: P([  0,  0, 100,   0,-100,    0,  10,   0, -10,   0,  0, 0, 0, -0.3]), spin: 1080, flip: 1 }], // a helicopter
    4: [{ wind: P([ 10,  0, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([ 25, 10,  80,  60, -90,   30,  95,   0, -15, -60]), spin: 0 }], // an axe dive
    8: [{ wind: P([ 10,  0, 160,  20,-140,   20,  70,-120,  60,-120]), strike: P([ 20, 10,  90,  60, -90,   30,  10,   0, -10,   0,  0, 0, 0, 0.15]) }], // a meteor stomp
  };
  // hit 1 of a jab or side light, sometimes: a reverse rising slash instead of the usual cut
  const rising = (k) => ({ wind: add(k.wind, { a1: -150, e1: 30, lean: -10 }), strike: add(k.strike, { a1: 55, e1: -10, lean: 12, head: -8 }) });
  const backhand = (k) => ({ wind: add(k.strike, { a1: 60, lean: -12 }), strike: add(k.strike, { a1: -25, e1: 20, lean: 10 }), spin: 360, flip: 1 });
  const leaping = (k) => ({ wind: add(BASE.deep, { a1: 100, e1: 40 }), strike: add(k.strike, { lean: 22, dx: 0.25, dy: -0.16, k1: -45, k2: -70, l2: -15 }) });
  // the generic moveset: [wind-up, strike], plus spin degrees over the active frames when it whirls
  const GENERIC = [
    { wind: P([  0,  0,  60,  70, -50,  -60,  20, -30, -20, -10]), strike: P([ 20,  0,  95,   0, -70,  -30,  35, -35, -35,  -5,  0, 0, 0.05]) },
    { wind: P([ -5,  0, 160,  30, -40,  -40,  15, -40, -15, -40]), strike: P([ 35,  5,  70, -10,-100,    0,  70, -70, -55,   0,  0, 0, 0.22]) },
    { wind: P([ 10,  0, 120,  20, -50,  -50,  45, -90, -15, -70]), strike: P([ 25,  5,  40,   0, -90,    0,  60,-110, -30, -90]) },
    { wind: P([ 10,  0,  30,  40, -50,  -50,  45, -90, -15, -70]), strike: P([ -5, -15, 180, -20, -40,  -30,  10, -10, -10,   0,  0, 0, 0, -0.05]) },
    { wind: P([ 10,  0, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([  5,  0,  95,   0, -95,    0,  40, -30, -40, -30]), spin: 360 },
    { wind: P([-15,  0, 170,  60,  60,   40,  30, -70, -30, -60]), strike: P([ 45,  5,  80,   0,-110,    0,  85, -85, -70,   0,  0, 0, 0.35]) },
    { wind: P([ 10,  0,  40,  20, -40,   20,  60,-110, -15, -95]), strike: P([ -5,-10, 175,   0,-170,    0,   5, -10,  -5, -10]), spin: 360 },
    { wind: P([ 20,  0,  40,  40, -40,   40,  65,-120, -20,-100]), strike: P([ 15,  0,  95,   0, -95,    0,  60,-110, -30, -90]), spin: 720, flip: 1 },
    { wind: P([ 10,  0, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([ 15,  0,  10,   0,-100,   30,  80,-120,  50,-120]) },
    { wind: P([  0,  0, 160,   0,-160,    0,  20, -30, -20, -30]), strike: P([  0,  0, 165,   0,-165,    0,  10,   0, -10,   0]) },
  ];

  // ---------- styles: colour, prop, accessories, move overrides ----------
  const STYLES = {
    // the countess: a parasol whose tip is a rapier, opened as a shield and for her spin
    "stick-vespera": {
      color: "#d0173f", prop: "rapier", acc: ["bun", "cape"], batForm: 6, moves: {
        0: { wind: P([  0, -4,  60,  60, -60,  -60,  20, -30, -20, -10]), strike: P([ 20, -4,  92,   0, -60,  -60,  35, -35, -35,  -5,  0, 0, 0.05]) },
        1: { wind: P([ -5, -4,  70,  70, -60,  -60,  15, -40, -15, -40]), strike: P([ 40, -4,  92,   0,-100,    0,  75, -75, -60,   0,  0, 0, 0.25]) },
        2: { wind: P([  0, -4,  60,  70, -60,  -60,  45, -90, -15, -70,  0, 0.3]), strike: P([ -8, -8,  88,  -5, -50,  -60,  50, -90, -20, -70,   0, 1]) },
        3: { wind: P([ 10, -4,  30,  40, -60,  -60,  45, -90, -15, -70]), strike: P([ -5,-15, 178,   0, -40,  -30,  10, -10, -10,   0,  0, 0, 0, -0.06]) },
        5: { wind: P([-15, -4,  30, 125,  60,   40,  30, -70, -30, -60]), strike: P([ 50, -4,  95,  -5,-110,    0,  85, -85, -70,   0,  0, 0, 0.4]) },
        7: { wind: P([ 20, -4,  40,  40, -60,  -40,  65,-120, -20,-100,  0, 0.3]), strike: P([  5, -4,  92,   0, -95,    0,  55,-100, -30, -90,   0, 1]), spin: 720, flip: 1 },
        8: { wind: P([ 10, -4, 140,  20,-120,   20,  70,-110,  30,-100]), strike: P([ 10,  0,   0,   0,-100,   30,  80,-120,  50,-120]) },
        9: { wind: P([  0, -4, 150,  20,-120,   20,  70,-110,  30,-100]), strike: P([  0,  0,   0,   0,-160,    0,  10,   0, -10,   0]) },
      },
      victory: P([-10, -10, 150, -40, -20, 100, 10, -10, -5, 0, 150, 1]),
      // her combo finishers: the Rose Lunge (a flying horizontal thrust), the Moon Rise (a
      // rising flip with the blade up) and a double whirl in the air
      finish: {
        0: { wind: P([ 25, -4,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([ 78,-10,  92,   0,-120,    0,  30, -10, -45,   0,  0, 0, 0.35, -0.12]) },
        1: { wind: P([ 25, -4,  70,  80, -60,  -60,  75,-140, -10,-120]), strike: P([ 80,-10,  92,   0,-120,    0,  30, -10, -45,   0,  0, 0, 0.45, -0.14]) },
        3: { wind: P([ 22, -4,  40,  40, -60,  -60,  75,-140, -10,-120]), strike: P([ -5,-15, 178,   0,-178,    0,   5,  -5,  -5,  -5,  0, 0, 0, -0.25]), spin: 360 },
        4: { wind: P([ 10, -4, 130,  20,-120,   20,  70,-110,  30,-100]), strike: P([  5,  0,  95,   0, -95,    0,  40, -30, -40, -30]), spin: 720 },
      },
    },
    // the djinn swordsman: a scimitar and a long scarf
    "stick-saif": { color: "#1f5a43", prop: "shamshir", acc: ["scarf"], moves: {}, victory: P([-5, -10, 175, -10, -60, 90, 20, -20, -15, 0, 0]) },
  };

  // ---------- movement variety: the sim rolls p.jv at each jump, so every jump can look different ----------
  //                    lean head  a1   e1   a2    e2   l1   k1    l2   k2  prop open dx    dy   rot spin
  const VARY = {
    ninja:     P([  30,  10,-120,  20,-140,   10,  85,-125, -35, -50]), // knee up, arms and blade swept back
    split:     P([   0,   0, 150,   0,-150,    0,  85,   0, -85,   0]), // legs flat out like a scissor
    cork:      P([   0,   0,  30, 140, -30, -140,   5,   0,  -5,   0]), // arms crossed, straight as a drill
    layout:    P([   0,   0, 100,   0,-100,    0,  10,   0, -10,   0]), // a straight-bodied backflip
    reach:     P([   5,  -15, 60,  30,-175,    0,  10,  -5, -20, -10]), // one hand up for the ledge
    tuck:      BASE.tuck,
    landReady: P([  15,   5,  60,  40, -60,  -40,  60,-100,  40, -90]),
    landNinja: P([  35,  10,-110,  20,  15,    0,  70,-130, -30, -80,   0,   0,  0,  0.02]),
    throwBack: P([ -18,  -5,-160,  -40,  70,   10,  45, -30, -35, -15]), // the blade cocked back over the shoulder, the free hand aiming
    throwOut:  P([  30,   5,  85,    0, -80,  -20,  60, -60, -45,  -5]), // the arm whipped through, open hand forward
    clash:     P([ -22, -10, 150,  -40, -60,   60,  40, -40, -30, -20]), // driven back, the blade up between them
  };
  const FALLS = [BASE.fall, P([20, 10, -100, 30, -130, 20, 70, -110, -20, -60]), P([0, 0, 110, -10, -110, 10, 30, -30, -20, -20]), P([20, 10, -100, 30, -130, 20, 70, -110, -20, -60])];
  FALLS[9] = VARY.landReady;
  // a jump's look by variant, u: 0 at takeoff, 1 at the top of the rise
  function airVariant(air, jv, u, f) {
    const e = eio(u);
    if (jv === 9) { // the vault: reach up for the platform, then tuck and flip over onto it, feet ready
      if (u < 0.35) return lerp(BASE.launch, VARY.reach, eo(u / 0.35));
      const k = (u - 0.35) / 0.65;
      return { ...lerp(VARY.tuck, VARY.landReady, Math.max(0, k * 2 - 1)), rot: 360 * eio(Math.min(1, k * 1.15)) };
    }
    if (air) {
      if (jv === 1) return { ...lerp(BASE.jump, VARY.layout, Math.min(1, u * 2)), rot: -360 * e }; // a backflip layout
      if (jv === 2) return lerp(BASE.jump, VARY.split, eo(Math.min(1, u * 1.6))); // a scissor kick in the air
      return { ...lerp(BASE.jump, VARY.tuck, Math.min(1, u * 2)), rot: 360 * e }; // a tucked front flip
    }
    if (jv === 1) return lerp(BASE.launch, VARY.ninja, eo(Math.min(1, u * 1.4)));
    if (jv === 2) return { ...lerp(BASE.launch, VARY.split, eo(Math.min(1, u * 1.5))), rot: 360 * e }; // an aerial, legs split
    if (jv === 3) return { ...lerp(BASE.launch, VARY.cork, Math.min(1, u * 2)), spin: 720 * e }; // a corkscrew
    return { ...lerp(BASE.launch, VARY.tuck, Math.min(1, u * 2.2)), rot: 360 * e }; // a tucked front flip
  }

  // ---------- pose selection (pure) ----------
  function basePose(rig, p, f, ph, Sim) {
    const ST = Sim.ST, H = rig.H;
    if (p.st === ST.HIT) {
      const sp = Math.hypot(p.vx, p.vy);
      if (p.launch > 2400 && sp > 1700 && !p.ground) { // blasted: straight as a plank, head first along the flight, arms trailing
        const w = Math.sin(f * 1.3) * 6;
        return { ...BASE.flung, a1: BASE.flung.a1 + w, a2: BASE.flung.a2 - w, rot: Math.atan2(p.vx * p.face, -p.vy) / R };
      }
      if (p.launch > 2400 && p.ground) return add(BASE.knocked, { a2: 8 * Math.sin(f * 0.9) }); // skidding back low, a hand dragging the floor
      if (p.launch > 2400) { // a big launch tumbles and flails, a cartoon ragdoll
        const w = f * 0.6;
        return P([0, 20 * Math.sin(w * 0.9), 150 + 40 * Math.sin(w), 30 * Math.sin(w * 1.3), -150 + 40 * Math.cos(w * 0.8), 40 * Math.sin(w * 1.1),
          60 + 30 * Math.sin(w * 0.7), -60 + 40 * Math.cos(w), -50 + 30 * Math.cos(w * 0.9), -40 + 30 * Math.sin(w * 1.2), 0, 0, 0, 0, -(f * 22) % 360]);
      }
      return add(BASE.hurt, { a1: 15 * Math.sin(f * 0.8), a2: 15 * Math.cos(f * 0.7) });
    }
    if (p.st === ST.THROW) { // the throw: the blade drawn back over the shoulder, then whipped forward along the aim
      const at = Sim.FEEL.kit.throwAt, aim = (p.wa || 0) * 45;
      if (p.t < at) return lerp(BASE.stance, VARY.throwBack, eo(Math.min(1, (p.t + 1) / at)));
      return lerp(add(VARY.throwOut, { a1: -aim, lean: -aim * 0.2 }), BASE.stance, Math.max(0, (p.t - at - 3) / 8));
    }
    if (p.st === ST.CLASH) return add(VARY.clash, { lean: 3 * Math.sin(f * 2.3), a1: 4 * Math.sin(f * 3.1) }); // braced from the clash, the blade still up
    if (p.st === ST.DASH && p.slide === 1) return add(BASE.slide, { a1: 6 * Math.sin(f * 0.9) });
    if (p.st === ST.DASH && p.slide === 2) return { ...BASE.tuck, rot: 360 * Math.min(1, p.t / 14) }; // the landing roll
    if (p.st === ST.DODGE && ph.kit && p.dk === 1) { // the air dash: a superman, body along the dash
      const vf = p.vx * p.face;
      return { ...BASE.superman, rot: Math.atan2(vf, -p.vy) / R };
    }
    if (p.st === ST.DODGE) {
      if (p.ground) return BASE.back;
      const u = p.dt ? 1 - p.t / p.dt : 0; // an air dodge spins once
      return { ...BASE.jump, rot: (p.dk === 2 ? -360 : 360) * eio(u) };
    }
    if (p.st === ST.DASH) return runPose(BASE.dash, p, H, 2.2);
    if (!p.ground) {
      if (ph.kit && p.wall && p.vy < -300) { // the wall run: feet on the wall, legs cycling up it
        const w = (p.y / 100 / (0.8 * H)) * Math.PI, s2 = Math.sin(w), c2 = Math.cos(w);
        return { ...BASE.stance, lean: 10, a1: 40, e1: 30, a2: -70, e2: 50, l1: 55 * s2, k1: -20 - 90 * Math.max(0, c2), l2: -55 * s2, k2: -20 - 90 * Math.max(0, -c2), rot: -80 };
      }
      if (p.wall) return BASE.wall;
      const wallJump = p.wj < 3 && p.jumps === ph.airJumps;
      if (ph.kit && !p.sj && !wallJump && !p.ff) { // the stick kit: every jump and fall picks a variant from the sim's roll
        const air = p.jumps < ph.airJumps;
        if (p.vy < 0) return airVariant(air, p.jv, Math.max(0, Math.min(1, 1 - p.vy / (air ? ph.airJumpV : ph.jumpV))), f);
        return FALLS[p.jv] || BASE.fall;
      }
      if (p.vy < 0) {
        const pose = lerp(p.vy < ph.jumpV * 0.75 ? BASE.launch : BASE.jump, BASE.fall, Math.max(0, Math.min(1, (p.vy + 1600) / 1600)));
        if (p.sj) pose.rot = 720 * Math.max(0, Math.min(1, 1 - p.vy / (ph.jumpV * 1.35))); // a super jump: a double front flip on the way up
        // a wall jump is a backflip off the wall
        if (p.wj < 3 && p.jumps === ph.airJumps && p.vy < -300) pose.rot = -360 * Math.max(0, Math.min(1, 1 - (p.vy + 300) / (ph.jumpV + 300)));
        // an air jump is a front flip: the turn follows the rise, so it is still a pure function
        if (p.jumps < ph.airJumps && p.vy < -300) pose.rot = 360 * Math.max(0, Math.min(1, 1 - (p.vy + 300) / (ph.airJumpV + 300)));
        return pose;
      }
      return p.ff ? BASE.dive : BASE.fall;
    }
    if (p.hero > 0 && Math.abs(p.vx) < 300) return lerp(BASE.stance, BASE.hero, Math.min(1, p.hero * 1.6)); // set by the renderer after a hard landing
    if (p.land > 0) return lerp(BASE.stance, ph.kit && p.jv % 2 ? VARY.landNinja : BASE.crouch, p.land / 6); // some landings touch down a hand
    if (ph.kit && p.vx * p.face < -350) return BASE.skid; // turning at speed: heels dug in
    if (p.crouch > 0) return p.crouch >= 10 ? add(BASE.deep, { lean: 2 * Math.sin(f * 1.7), a1: 3 * Math.sin(f * 2.3) }) : lerp(BASE.stance, BASE.deep, p.crouch / 10);
    if (ph.kit && Math.abs(p.vx) > ph.run + 120) { // a ninja sprint: leaning hard, both arms swept straight back, the blade trailing
      return { ...runPose(BASE.stance, p, H, 1.6), a1: -118, e1: 0, prop: 8, a2: -128, e2: 6, head: -28 };
    }
    if (Math.abs(p.vx) > 150) return runPose(BASE.stance, p, H, 1);
    // idle: a fencer's bounce on the balls of the feet, the guard bobbing
    const b = Math.sin(f / (ph.kit ? 9 : 22)), bb = Math.abs(b);
    return add(BASE.stance, ph.kit ? { lean: 3 * b, a1: 4 * b, e1: -4 * b, k1: -14 * bb, k2: -12 * bb, l1: 6 * bb } : { lean: 2 * b, a1: 3 * b, e1: -3 * b, k1: -4 * b, k2: -3 * b });
  }
  // the run cycle is driven by distance, so the feet never slide
  // a sprint: leaning hard, long strides, the blade trailing low behind her
  function runPose(base, p, H, lean) {
    const ph = (p.x / 100 / (1.05 * H)) * Math.PI * p.face, s = Math.sin(ph), c = Math.cos(ph);
    return { ...base, lean: 30 + 12 * lean, head: -18, l1: 60 * s, k1: -20 - 95 * Math.max(0, c), l2: -60 * s, k2: -20 - 95 * Math.max(0, -c),
      a1: -55 + 8 * s, e1: -25, prop: 15, a2: -80 + 20 * s, e2: 60, dy: -0.04 * Math.abs(c) };
  }
  function pose(rig, p, f, moves, Sim, win) {
    const ST = Sim.ST, st = rig.style;
    if (win >= 0 && p.ground && st.victory) return lerp(BASE.stance, st.victory, eo(Math.min(1, win / 20)));
    const base = basePose(rig, p, f, rig.ph, Sim);
    if (p.st !== ST.ATK) return base;
    const m = moves[p.mv], k0 = (st.moves && st.moves[p.mv]) || GENERIC[p.mv];
    const pick = (opts) => { const o = opts.filter(Boolean); return o.length ? o[((p.vr || 0) >> 2) % o.length] : null; };
    const k = p.cmb === 1 ? pick([st.kicks && st.kicks[p.mv], KICKS[p.mv], ...(KICKS_ALT[p.mv] || [])]) || backhand(k0)
      : p.cmb >= 2 ? pick([st.finish && st.finish[p.mv], FINISH[p.mv], ...(FINISH_ALT[p.mv] || [])]) || leaping(k0)
      : rig.ph && rig.ph.kit && (p.mv === 0 || p.mv === 1) && (p.vr || 0) % 3 === 2 ? rising(k0) : k0;
    const stance = p.ground ? BASE.stance : BASE.fall;
    let out;
    if (p.t < m.su) {
      out = lerp(stance, k.wind, eo(Math.min(1, p.t / Math.max(1, m.su * 0.6))));
      if (k.turn) out.spin = k.turn * eo(Math.min(1, (p.t + 1) / Math.max(1, m.su))); // the turn of a spinning kick
      if (p.chg > 0 && p.t === m.su - 1) out = add(out, { lean: 3 * Math.sin(f * 2.1), a1: 4 * Math.sin(f * 2.7) }); // a held charge trembles
    } else if (p.t < m.su + m.ac) {
      out = lerp(k.wind, k.strike, Math.min(1, (p.t - m.su + 1) / 2)); // the strike snaps in and holds
      if (k.spin) out[k.flip ? "spin" : "rot"] = k.spin * ((p.t - m.su) / Math.max(1, m.ac));
    } else {
      const u = (p.t - m.su - m.ac) / Math.max(1, m.re);
      out = u < 0.3 ? { ...k.strike } : lerp(k.strike, stance, eio((u - 0.3) / 0.7));
    }
    return out;
  }

  // ---------- drawing ----------
  const dir = (a) => [Math.sin(a * R), Math.cos(a * R)];
  // joint positions for a pose, feet planted on the ground (or the lowest foot at 0 in the air)
  function joints(rig, q) {
    const H = rig.H, hip = [0, 0];
    const leg = (l, k) => { const [tx, ty] = dir(l), [sx, sy] = dir(l + k); const knee = [tx * B.thigh * H, ty * B.thigh * H]; return [knee, [knee[0] + sx * B.shin * H, knee[1] + sy * B.shin * H]]; };
    const [knee1, foot1] = leg(q.l1, q.k1), [knee2, foot2] = leg(q.l2, q.k2);
    const lift = -Math.max(foot1[1], foot2[1]) + (q.dy || 0) * H, shift = (q.dx || 0) * H;
    const off = (v) => [v[0] + shift, v[1] + lift];
    const up = [Math.sin(q.lean * R), -Math.cos(q.lean * R)];
    const neck = [up[0] * B.torso * H, up[1] * B.torso * H];
    const ha = q.lean + q.head, head = [neck[0] + Math.sin(ha * R) * (B.neck + B.headR) * H, neck[1] - Math.cos(ha * R) * (B.neck + B.headR) * H];
    const arm = (a, e) => { const [ux, uy] = dir(a), [fx, fy] = dir(a + e); const elbow = [neck[0] + ux * B.uarm * H, neck[1] + uy * B.uarm * H]; return [elbow, [elbow[0] + fx * B.farm * H, elbow[1] + fy * B.farm * H]]; };
    const [elbow1, hand1] = arm(q.a1, q.e1), [elbow2, hand2] = arm(q.a2, q.e2);
    const J = { hip, knee1, foot1, knee2, foot2, neck, head, elbow1, hand1, elbow2, hand2 };
    for (const k in J) J[k] = off(J[k]);
    J.handAngle = q.a1 + q.e1; // the prop leaves the front hand along the forearm
    return J;
  }
  function stroke(g, pts, w, color) {
    g.strokeStyle = color; g.lineWidth = w; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]);
    g.stroke();
  }
  // shade a hex colour toward black (k < 0) or white (k > 0)
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
    return `rgb(${c.join(",")})`;
  }
  const rgb = (c) => { // "#abc", "#aabbcc" or "rgb(r,g,b)"
    const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(c);
    if (m) return [+m[1], +m[2], +m[3]];
    const h = c.length === 4 ? "#" + [...c.slice(1)].map((x) => x + x).join("") : c, n = parseInt(h.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  function mix(a, b, t) {
    const ca = rgb(a), pb = rgb(b);
    return `rgb(${ca.map((v, j) => Math.round(v + (pb[j] - v) * t)).join(",")})`;
  }
  // q: pose; o: { tint, tintColor, vx, vy (for cloth), f }
  function draw(g, rig, q, o = {}) {
    const H = rig.H, st = rig.style, J = joints(rig, q), w = H * 0.075;
    const body = o.tint ? mix(st.color, o.tintColor || "#ffffff", Math.min(1, o.tint)) : st.color, back = o.tint ? body : shade(st.color, -0.35);
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    const cx = 0, cy = -H * 0.5;
    if (q.rot) { g.translate(cx, cy); g.rotate(q.rot * R); g.translate(-cx, -cy); }
    if (q.spin) g.scale(Math.cos(q.spin * R) || 0.05, 1); // a pirouette turns the body side on
    // cloth first: it flows behind the body, away from the motion
    const sway = Math.sin((o.f || 0) / 7), drag = Math.max(-1, Math.min(1, -(o.vx || 0) / 900)), lift = Math.max(-1, Math.min(1, (o.vy || 0) / 1400));
    if (st.acc.includes("cape")) {
      const n = J.neck, L = H * 0.42, tip = [n[0] - L * (0.45 + 0.35 * Math.max(0, -drag)) + 4 * sway, n[1] + L * (0.85 - 0.5 * Math.abs(drag) - 0.3 * lift)];
      g.fillStyle = shade(st.color, -0.55); g.beginPath(); g.moveTo(n[0] - w * 0.3, n[1]); g.quadraticCurveTo(n[0] - L * 0.2, n[1] + L * 0.5, tip[0], tip[1]);
      g.lineTo(tip[0] + L * 0.22, tip[1] - L * 0.08); g.quadraticCurveTo(n[0] + w * 0.2, n[1] + L * 0.45, n[0] + w * 0.4, n[1]); g.closePath(); g.fill();
    }
    if (st.acc.includes("scarf")) {
      const n = J.neck, L = H * 0.5, end = [n[0] - L * (0.7 + 0.3 * Math.max(0, -drag)), n[1] + L * (0.15 - 0.4 * lift) + 6 * sway];
      g.strokeStyle = "#e0a640"; g.lineWidth = w * 0.7; g.beginPath(); g.moveTo(n[0], n[1] + w * 0.3); g.quadraticCurveTo(n[0] - L * 0.4, n[1] + 8 * sway, end[0], end[1]); g.stroke();
      g.lineWidth = w * 0.5; g.beginPath(); g.moveTo(n[0], n[1] + w * 0.3); g.quadraticCurveTo(n[0] - L * 0.3, n[1] + H * 0.1, end[0] + 6, end[1] + H * 0.12); g.stroke();
    }
    // a pale halo keeps the strokes readable over the painted stage
    const halo = "rgba(255,246,232,0.42)";
    const limbs = [[J.hip, J.knee2, J.foot2], [J.neck, J.elbow2, J.hand2], [J.hip, J.neck], [J.hip, J.knee1, J.foot1], [J.neck, J.elbow1, J.hand1]];
    for (const l of limbs) stroke(g, l, w + 3, halo);
    stroke(g, [J.hip, J.knee2, J.foot2], w, back); stroke(g, [J.neck, J.elbow2, J.hand2], w, back);
    stroke(g, [J.hip, J.neck], w * 1.1, body);
    g.fillStyle = halo; g.beginPath(); g.arc(J.head[0], J.head[1], B.headR * H + 1.5, 0, 7); g.fill();
    g.fillStyle = body; g.beginPath(); g.arc(J.head[0], J.head[1], B.headR * H, 0, 7); g.fill();
    if (st.acc.includes("bun")) { const hb = [J.head[0] - B.headR * H * 0.55, J.head[1] - B.headR * H * 0.95]; g.beginPath(); g.arc(hb[0], hb[1], B.headR * H * 0.5, 0, 7); g.fill(); }
    stroke(g, [J.hip, J.knee1, J.foot1], w, body);
    if (!o.noProp) drawProp(g, rig, J, q, w);
    stroke(g, [J.neck, J.elbow1, J.hand1], w, body);
    g.restore();
    return J;
  }
  // ---------- weapons: drawn as real steel, two-tone bevel, guard, wrapped grip, pommel ----------
  const STEEL = { hi: "#f4f8fc", mid: "#b9c3ce", lo: "#6c7786", ink: "#14171d" };
  const WEAPONS = {
    // a duelling rapier: long, narrow and straight, a swept gold hilt with a cup and quillons
    rapier: { len: 0.9, base: 0.05, w0: 0.02, w1: 0.012, bend: 0, metal: "#c9a24a", grip: "#5a0d1f" },
    // a shamshir: a deep curve that widens toward the point, drooping quillons
    shamshir: { len: 0.78, base: 0.05, w0: 0.026, w1: 0.04, bend: 0.11, metal: "#e0a640", grip: "#1f5a43" },
  };
  // the blade's centre line in local space: points from the guard to the point, along the hand
  function bladeLine(rig, J, q, n = 10) { return bladeFrom(rig, J.hand1, J.handAngle + (q.prop || 0), n); }
  function bladeFrom(rig, h, deg, n = 10) {
    const W = WEAPONS[rig.style.prop], H = rig.H, a = deg * R, d = [Math.sin(a), Math.cos(a)], nrm = [-d[1], d[0]];
    const pts = [];
    for (let k = 0; k <= n; k++) {
      const u = k / n, t = W.base + (W.len - W.base) * u, b = W.bend * H * Math.sin(u * Math.PI * 0.85) * u;
      pts.push([h[0] + d[0] * t * H + nrm[0] * b, h[1] + d[1] * t * H + nrm[1] * b]);
    }
    return { pts, d, nrm, h };
  }
  // a thrown blade in world space: the point at (x, y), along its flight, or tumbling when knocked loose
  function drawThrown(g, rig, x, y, vx, vy, tumble) {
    const W = WEAPONS[rig.style.prop];
    if (!W) return;
    const deg = tumble ? tumble : Math.atan2(vx, vy) / R, a = deg * R, L = W.len * rig.H;
    drawWeapon(g, rig, [x - Math.sin(a) * L, y - Math.cos(a) * L], deg, rig.H * 0.075);
  }
  // the blade from guard to point, in the same space the body is drawn in (after rot and spin)
  function blade(rig, q) {
    if (!WEAPONS[rig.style.prop]) return null;
    const J = joints(rig, q), { pts } = bladeLine(rig, J, q, 6), cy = -rig.H * 0.5, sx = q.spin ? Math.cos(q.spin * R) || 0.05 : 1;
    const c = Math.cos((q.rot || 0) * R), sn = Math.sin((q.rot || 0) * R);
    return pts.map(([x, y]) => { x *= sx; const yy = y - cy; return [x * c - yy * sn, x * sn + yy * c + cy]; });
  }
  function drawProp(g, rig, J, q, w) { drawWeapon(g, rig, J.hand1, J.handAngle + (q.prop || 0), w); }
  // a weapon on its own: the grip at `h`, pointing along `deg` (0 is straight down); thrown blades use it too
  function drawWeapon(g, rig, h, deg, w) {
    const W = WEAPONS[rig.style.prop];
    if (!W) return;
    const H = rig.H, { pts, d, nrm } = bladeFrom(rig, h, deg), at = (t) => [h[0] + d[0] * t * H, h[1] + d[1] * t * H];
    const off = (p, k) => [p[0] + nrm[0] * k, p[1] + nrm[1] * k];
    // grip and pommel behind the hand
    const pom = at(-0.075);
    stroke(g, [at(-0.065), at(0.035)], w * 0.62 + 2, STEEL.ink); stroke(g, [at(-0.065), at(0.035)], w * 0.62, W.grip);
    g.strokeStyle = W.metal; g.lineWidth = 1;
    for (let k = 0; k < 4; k++) { const a0 = at(-0.055 + k * 0.024), a1 = at(-0.045 + k * 0.024); g.beginPath(); g.moveTo(...off(a0, -w * 0.3)); g.lineTo(...off(a1, w * 0.3)); g.stroke(); }
    g.fillStyle = W.metal; g.strokeStyle = STEEL.ink; g.lineWidth = 1.2;
    g.beginPath(); g.arc(pom[0], pom[1], H * 0.022, 0, 7); g.fill(); g.stroke();
    // the blade: a tapered outline, the edge half bright and the spine half shaded, a glint down the middle
    const n = pts.length - 1, half = (k) => H * (W.w0 + (W.w1 - W.w0) * (k / n)) * (k === n ? 0 : 1) * (k > n - 2 ? 0.55 : 1);
    const left = pts.map((p, k) => off(p, half(k))), right = pts.map((p, k) => off(p, -half(k)));
    g.beginPath(); g.moveTo(...left[0]); for (const p of left) g.lineTo(...p); for (let k = n; k >= 0; k--) g.lineTo(...right[k]); g.closePath();
    g.fillStyle = STEEL.lo; g.fill(); g.lineWidth = 1.6; g.strokeStyle = STEEL.ink; g.stroke();
    g.beginPath(); g.moveTo(...left[0]); for (const p of left) g.lineTo(...p); for (let k = n; k >= 0; k--) g.lineTo(...pts[k]); g.closePath();
    g.fillStyle = STEEL.hi; g.fill();
    g.strokeStyle = STEEL.mid; g.lineWidth = 1; g.beginPath(); g.moveTo(...pts[1]); for (let k = 2; k < n - 1; k++) g.lineTo(...pts[k]); g.stroke(); // the fuller
    // the guard over the blade's root
    const gd = at(0.045);
    if (rig.style.prop === "rapier") {
      g.strokeStyle = STEEL.ink; g.lineWidth = w * 0.42 + 2; g.beginPath(); g.moveTo(...off(gd, H * 0.08)); g.lineTo(...off(gd, -H * 0.08)); g.stroke();
      g.strokeStyle = W.metal; g.lineWidth = w * 0.42; g.stroke();
      g.lineWidth = 2.2; g.beginPath(); g.moveTo(...off(gd, H * 0.075)); g.quadraticCurveTo(...off(at(0.0), H * 0.12), ...off(pom, H * 0.02)); g.stroke(); // the knuckle bow
      g.fillStyle = W.metal; g.strokeStyle = STEEL.ink; g.lineWidth = 1.2; g.beginPath(); g.ellipse(gd[0], gd[1], H * 0.03, H * 0.045, Math.atan2(d[1], d[0]), 0, 7); g.fill(); g.stroke(); // the cup
      for (const k of [1, -1]) { const e = off(gd, k * H * 0.085); g.beginPath(); g.arc(e[0], e[1], H * 0.014, 0, 7); g.fill(); g.stroke(); }
    } else {
      const a = off(at(0.07), H * 0.08), b = off(at(0.07), -H * 0.08); // quillons drooping toward the blade
      g.strokeStyle = STEEL.ink; g.lineWidth = w * 0.45 + 2; g.beginPath(); g.moveTo(...a); g.quadraticCurveTo(...gd, ...b); g.stroke();
      g.strokeStyle = W.metal; g.lineWidth = w * 0.45; g.stroke();
      g.fillStyle = W.metal; g.strokeStyle = STEEL.ink; g.lineWidth = 1.2; g.beginPath(); g.arc(gd[0], gd[1], H * 0.022, 0, 7); g.fill(); g.stroke();
    }
  }

  // a fighter rig: style, standing height in world px and the owner's physics (for air jumps)
  function create(id, height, ph) { return { id, stick: 1, style: STYLES[id], H: height, h: height, ph, sheets: {} }; }

  // a still image of the fighter in its stance, for the menu chip, the HUD and the loading card
  function still(id, size, portrait) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"), rig = create(id, portrait ? size * 1.5 : size * 0.8, { airJumps: 2 });
    g.translate(portrait ? size * 0.5 : size * 0.45, portrait ? size * 1.42 : size * 0.92);
    draw(g, rig, BASE.stance, { f: 0 });
    return c;
  }

  root.Stick = { STYLES, WEAPONS, create, pose, draw, joints, blade, drawThrown, still, BASE };
})(this);
