// Dune Brawl deterministic simulation (test build).
// Integer math only, no clocks, no Math.random. Positions and velocities are in sim units:
// 100 sim units = 1 world px. Ported from the live prototype, with per-fighter move data and
// stats, weight, and the game feel retune from the development plan.
(function (root) {
  "use strict";

  const S = 100;
  const div = (a, b) => Math.trunc(a / b);
  const IN = { L: 1, R: 2, U: 4, D: 8, J: 16, A: 32, B: 64, X: 128 };
  const ST = { IDLE: 0, ATK: 1, HIT: 2, DODGE: 3, DEAD: 4, DASH: 5 };

  // Dune Island, scaled to the reference (docs/design/REFERENCE-MEASUREMENTS.md): the main
  // platform is 14 bodies wide, soft platforms sit 3 bodies up so they take a double jump, and
  // the blast lines are about 9 bodies past each ledge.
  const STAGE = {
    // the island body tapers like its art: `lip` deep at the ledges, `keel` deep at the center
    main: { x1: 190 * S, x2: 1090 * S, y: 470 * S, lip: 60 * S, keel: 250 * S },
    plats: [
      { x1: 320 * S, x2: 600 * S, y: 280 * S },
      { x1: 680 * S, x2: 960 * S, y: 280 * S },
    ],
    blast: { l: -420 * S, r: 1700 * S, t: -420 * S, b: 1060 * S },
    spawnX: [470 * S, 810 * S],
    respawn: { x: 640 * S, y: 240 * S }, // between the soft platforms, above the stage
  };

  // Global feel values. Every fighter's stats are percentages of these.
  // Units: sim units per frame (velocities), sim units per frame squared (gravity).
  const FEEL = {
    grav: 100, hitGrav: 45, maxFall: 1300, fastFall: 2000, hitMaxFall: 2800,
    run: 900, gAcc: 420, fric: 300, airAcc: 190, airMax: 760, airFric: 8, // snappy: full run in 2 frames, a stop in 3, an air reversal in 8
    jumpV: 1640, airJumpV: 1560, jumpCut: 800,
    h: 64, hw: 18,
    kbMul: 355,          // knockback multiplier in percent, applied to base and growth
    growthDiv: 14,       // launch = kb + kg * max(0, damage - growthFrom) / growthDiv; higher means later kills
    growthFrom: 60,      // knockback only starts growing above this damage (docs/design/REFERENCE-KNOCKBACK.md)
    hitstunBase: 8,      // hitstun = hitstunBase + launch / hitstunDiv
    // move classes scale the move data in percent: small hits stay short at any damage, big
    // committed hits are weak early and send far once the victim is red
    kbClass: [30, 60, 30, 60, 30, 60, 60, 60, 60, 60], kgClass: [50, 100, 50, 100, 50, 160, 100, 160, 100, 160],
    hitstunDiv: 168,
    hitDecay: 4,         // percent of horizontal launch speed lost per frame in hitstun
    pauseBase: 3, pauseDiv: 5, pauseMax: 7,   // the reference holds 4 frames on a light hit, 6 on a heavy
    // Dodges, from the reference's published frame data: 2 startup frames, then invincible for
    // 12 (air, with a direction), 20 (air, in place), 16 (ground, in place: our backstep) or 17
    // (chase) frames, no recovery. Cooldown 60 frames after a ground dodge and 163 after an air
    // dodge; landing 75 or more frames after an air dodge clears it, landing sooner caps it at 75.
    dodgeStart: 2, dodgeInvAir: 12, dodgeInvSpot: 20, dodgeInvGround: 16, dodgeInvChase: 17,
    dodgeCdG: 60, dodgeCdA: 163, dodgeLandCd: 75, backstep: 1100,
    dodgeSpeedA: 1450, dodgeDragG: 8, dodgeDragA: 6,
    // ground dodge with a direction is a dash: fast, cancelable into a jump or an attack
    dashSpeed: 1500, dashDrag: 4, dashFrames: 14, dashCancelFrom: 5, dashCd: 16,
    // chase dodge: landing a hit gives 2 dodges (1 if airborne) that ignore the cooldown, usable
    // until 12 frames after the attack ends; attacking within 20 frames of one cancels it, with 9
    // invincible frames
    chaseWindow: 12, chaseSpeed: 130, chaseCancel: 20, chaseCancelInv: 9,
    gcWindow: 18,       // gravity cancel: attack within 18 frames of an in-place dodge, an air move even on the ground
    missDodgeLock: 7, missDashLock: 6, // whiffing locks dodges for 7 frames and dashes for 6
    hitRecovery: 67,    // recovery on hit, percent of the recovery on a miss
    jumpSquat: 2, jumpLand: 4, // jump startup, and the landing recovery after a jump
    sigCd: 10,          // global cooldown between heavy (signature) attacks
    // finisher: a side heavy charged at least finCharge frames that hits a fighter at finDamage%+
    // plays a cinematic for finFrames (the game holds still), then launches them for a KO
    finCharge: 20, finDamage: 150, finFrames: 96, finBonus: 25,
    stunSpeed: 1500,
    // The stick kit: movement built for play rather than matched to the reference, for fighters
    // whose definition sets `kit` (the stick fighters). Instant jumps that go higher on a snappier
    // arc, a sprint that builds while running, up to two quick air dashes per airtime, a slide,
    // a super jump from a crouch, a wall run, a roll out of hard landings, and a short grace
    // jump after running off a ledge.
    kit: {
      grav: 150, jumpV: 2500, airJumpV: 2150, jumpCut: 1100, maxFall: 1850, fastFall: 3100,
      run: 1080, sprint: 1550, sprintAfter: 18, gAcc: 720, airMax: 1000, airAcc: 340,
      dashA: 2100, dashAFrames: 12, dashACd: 30, dashACount: 2, dashADrag: 5, dashStrikeFrom: 3,
      carryDrag: 4, bounceV: 2200, stompDmg: 2, stompStun: 10, // a running attack keeps its speed; landing on a head bounces
      slideSpeed: 1450, slideFrames: 24, slideDrag: 3,
      coyote: 6, superJump: 135, crouchFor: 10, wallRun: 22, wallRunV: 950, wallKick: 1050, kickLock: 10,
      rollSpeed: 1150, rollFrames: 14, hardLand: 1250,
      // combos: a light that hits opens a window; the next light is hit 2 (a faster variant), the
      // one after is the combo finisher: more damage and knockback, a longer hit pause
      comboWindow: 26, comboStep: 1500, comboLunge: 1900, combo2Speed: 80, finDmg: 170, finKb: 150, finPause: 4,
    },    // hitstun lasts while the victim is still launched faster than this (sideways or up)
    parryStun: 40,      // frames an attacker is stunned after hitting a parry
    chargeMax: 30,      // heavies with `charge` can be held up to 30 frames for up to +50%
    wallJumps: 3, wallSlide: 500, // touching the island side: slide slowly, jump off it up to 3 times
    spawnDrop: 280, spawnRelease: 32, // pads hang above the soft platforms; the drop falls through them
    buffer: 7, countdown: 126, stocks: 3, deadFrames: 115, respawnInv: 100, // countdown: 3, 2, 1 at 42 frames each, as measured in the reference
    respawnHang: 150,   // a respawned fighter hangs on its pad until any input, at most this long
  };

  const isqrt = (n) => (n <= 0 ? 0 : Math.floor(Math.sqrt(n)));

  // Build the per-player physics table from a fighter definition (moves.draft.json).
  function physics(def) {
    const st = def.stats || {};
    const pct = (k) => (st[k] === undefined ? 100 : st[k]);
    const K = def.kit ? FEEL.kit : null, base = K || FEEL; // the stick kit swaps in its own movement
    const grav = div(base.grav * pct("gravity"), 100);
    // jump stat is a height percentage: keep v^2 / 2g proportional to it
    const baseH = div(base.jumpV * base.jumpV, 2 * base.grav);
    const airBaseH = div(base.airJumpV * base.airJumpV, 2 * base.grav);
    return {
      grav, kit: K ? 1 : 0,
      maxFall: div(base.maxFall * pct("fallSpeed"), 100),
      fastFall: div(base.fastFall * pct("fallSpeed"), 100),
      run: div(base.run * pct("run"), 100),
      sprint: K ? div(K.sprint * pct("run"), 100) : 0,
      gAcc: div(base.gAcc * pct("run"), 100),
      airMax: div(base.airMax * pct("airSpeed"), 100),
      airAcc: div(base.airAcc * pct("airSpeed"), 100),
      jumpCut: base.jumpCut,
      jumpV: -isqrt(2 * grav * div(baseH * pct("jump"), 100)),
      airJumpV: -isqrt(2 * grav * div(airBaseH * pct("jump"), 100)),
      airJumps: st.airJumps === undefined ? 2 : st.airJumps,
      weight: st.weight || 100,
      hw: div((st.hurtW || FEEL.hw * 2) * S, 2),
      // hurtbox height: big fighters' hurtboxes grow only 60% as much as their art, so size is not a free target
      h: (st.hurtH || st.height || FEEL.h) * S,
    };
  }

  // a frame window from move data: [from, to] or { from, to }
  const span = (w) => (!w ? null : Array.isArray(w) ? [w[0], w[1]] : [w.from, w.to]);

  // Moves: the 10 slots from the fighter JSON, integers only.
  function moves(def) {
    return def.moves.slice(0, 10).map((m, slot) => ({
      su: m.su, ac: m.ac, re: m.re, box: m.box.slice(), dmg: m.dmg,
      kb: div(m.kb * FEEL.kbClass[slot], 100), kg: div(m.kg * FEEL.kgClass[slot], 100),
      ax: m.ax, ay: m.ay, ix: m.ix || 0, iy: m.iy || 0, away: m.away || 0, air: m.air || 0,
      endOnLand: m.endOnLand || 0, charge: m.charge || 0,
      armor: span(m.armor), parry: span(m.parry),
    }));
  }

  function player(x, face, ph) {
    return {
      x, y: STAGE.main.y - FEEL.spawnDrop * S, vx: 0, vy: 0, face, ground: 0, jumps: ph.airJumps, dmg: 0,
      stocks: FEEL.stocks, st: ST.IDLE, t: 0, mv: 0, hit: 0, inv: 0, dcd: 0, drop: 0, recov: 0,
      ff: 0, cut: 1, prev: 0, buf: 0, bufT: 0, land: 0, launch: 0, wall: 0, wj: FEEL.wallJumps,
      chase: 0, chg: 0, hang: 0,
      dt: 0, dk: 0, ds: 999, chaseT: 0, lock: 0, dlock: 0, squat: 0, lag: 0, sig: 0, dashCd: 0,
      slide: 0, coy: 0, crouch: 0, wr: 0, runT: 0, adash: 0, // stick kit: slide (1) or roll (2), grace jump, crouch, wall run, sprint, air dashes
      cmb: 0, cmbT: 0, sj: 0, kick: 0, carry: 0, hb: 0, vr: 0, jv: 0, // vr: the variation seed of the current jump or attack; jv: the jump's style (9: a vault onto a platform) // combo step of the current light (0, 1, 2 = finisher) and the window to continue it
    };
  }
  const PKEYS = Object.keys(player(0, 1, { airJumps: 2 }));
  const GKEYS = ["f", "freeze", "over", "overT", "hf", "hx", "hy", "hk", "hp", "ha", "kf", "kx", "ky", "kp", "fin", "fa"];

  // A match binds two fighter definitions; the returned object steps a plain state.
  function match(defA, defB) {
    const ph = [physics(defA), physics(defB)];
    const mv = [moves(defA), moves(defB)];

    function create() {
      return {
        f: 0, freeze: 0, over: 0, overT: 0, hf: -1, hx: 0, hy: 0, hk: 0, hp: 0, ha: 0, // ha: 0 hit, 1 armored, 2 parried
        kf: -1, kx: 0, ky: 0, kp: 0, fin: 0, fa: 0, // fin: frames left of a finisher, fa: who lands it
        p: [player(STAGE.spawnX[0], 1, ph[0]), player(STAGE.spawnX[1], -1, ph[1])],
      };
    }

    function clone(s) {
      const c = {};
      for (const k of GKEYS) c[k] = s[k];
      c.p = s.p.map((p) => { const q = {}; for (const k of PKEYS) q[k] = p[k]; return q; });
      return c;
    }

    function hash(s) {
      let h = 2166136261;
      const mix = (v) => { h ^= v | 0; h = Math.imul(h, 16777619) >>> 0; h ^= (v / 4294967296) | 0; h = Math.imul(h, 16777619) >>> 0; };
      for (const k of GKEYS) mix(s[k]);
      for (const p of s.p) for (const k of PKEYS) mix(p[k]);
      return h >>> 0;
    }

    function box(p, m) {
      const b = m.box;
      return [
        p.face > 0 ? p.x + b[0] * S : p.x - b[1] * S,
        p.face > 0 ? p.x + b[1] * S : p.x - b[0] * S,
        p.y + b[2] * S,
        p.y + b[3] * S,
      ];
    }

    function bufferPress(p, input) {
      const pressed = input & ~p.prev;
      p.prev = input;
      const b = pressed & (IN.J | IN.A | IN.B | IN.X);
      if (b) { p.buf = b; p.bufT = FEEL.buffer; } else if (p.bufT > 0 && --p.bufT === 0) p.buf = 0;
      return pressed;
    }

    // a deterministic roll for animation variety: same inputs, same flips, so rollback agrees
    function vary(s, i, p) { p.vr = (s.f * 37 + i * 101 + p.vr * 13 + Math.abs(div(p.x, S))) % 9973; }
    // a jump that will carry up onto a platform overhead gets the vault
    function vaultable(p, P) {
      const reach = div(P.jumpV * P.jumpV, 2 * P.grav);
      return STAGE.plats.some((pl) => p.x > pl.x1 - 30 * S && p.x < pl.x2 + 30 * S && pl.y < p.y - 20 * S && p.y - pl.y < reach);
    }
    function stepPlayer(s, i, input) {
      const p = s.p[i], P = ph[i], M = mv[i];
      const pressed = bufferPress(p, input);
      if (p.st === ST.DEAD) {
        if (p.stocks <= 0) return;
        if (--p.t <= 0) {
          p.x = STAGE.respawn.x; p.y = STAGE.respawn.y; p.vx = 0; p.vy = 0; p.st = ST.IDLE; p.t = 0;
          p.inv = FEEL.respawnInv; p.dmg = 0; p.jumps = P.airJumps; p.ground = 0; p.recov = 0; p.ff = 0; p.wj = FEEL.wallJumps;
          p.hang = FEEL.respawnHang;
        }
        return;
      }
      if (p.hang > 0) {
        if (input || --p.hang <= 0) { p.hang = 0; p.inv = Math.max(p.inv, FEEL.respawnInv); }
        else return;
      }
      if (p.inv > 0) p.inv--;
      if (p.dcd > 0) p.dcd--;
      if (p.drop > 0) p.drop--;
      if (p.land > 0) p.land--;
      if (p.chaseT > 0 && --p.chaseT === 0) p.chase = 0;
      if (p.lock > 0) p.lock--;
      if (p.dlock > 0) p.dlock--;
      if (p.sig > 0) p.sig--;
      if (p.dashCd > 0) p.dashCd--;
      if (p.lag > 0) p.lag--;
      if (p.ds < 999) p.ds++;
      if (p.coy > 0) p.coy--;
      if (p.cmbT > 0 && --p.cmbT === 0 && p.st !== ST.ATK) p.cmb = 0;
      const K = P.kit ? FEEL.kit : null;
      let gc = 0; // this frame's attack is a gravity cancel: an air move, even on the ground
      const dx = (input & IN.R ? 1 : 0) - (input & IN.L ? 1 : 0);
      const take = (bit) => {
        if (p.bufT > 0 && p.buf & bit) { p.buf &= ~bit; if (!p.buf) p.bufT = 0; return true; }
        return false;
      };

      if (p.st === ST.HIT) {
        if (--p.t <= 0) {
          const up = Math.min(0, p.vy); // the launch, sideways and upward: never the fall, or a falling fighter could never recover
          if (p.vx * p.vx + up * up > FEEL.stunSpeed * FEEL.stunSpeed) p.t = 1;
          else { p.st = ST.IDLE; p.t = 0; p.launch = 0; }
        }
        p.vx -= div(FEEL.hitDecay * p.vx, 100);
      } else if (p.st === ST.DODGE) {
        p.t--;
        const since = p.dt - p.t, atk = p.bufT > 0 && p.buf & (IN.A | IN.B);
        if (atk && p.dk === 4 && since <= FEEL.chaseCancel) { p.st = ST.IDLE; p.t = 0; p.inv = Math.max(p.inv, FEEL.chaseCancelInv); }
        else if (atk && (p.dk === 2 || p.dk === 3) && since <= FEEL.gcWindow) { p.st = ST.IDLE; p.t = 0; gc = 1; }
        else if (atk && K && p.dk === 1 && since >= K.dashStrikeFrom) { p.st = ST.IDLE; p.t = 0; } // a dash strike: the air dash turns into an attack, keeping its speed
        const drag = K && p.dk === 1 ? K.dashADrag : FEEL.dodgeDragA;
        if (p.ground) p.vx -= div(FEEL.dodgeDragG * p.vx, 100);
        else { p.vx -= div(drag * p.vx, 100); p.vy -= div(drag * p.vy, 100); }
        if (p.st === ST.DODGE && p.t <= 0) { p.st = ST.IDLE; p.t = 0; }
      } else if (p.st === ST.DASH) {
        p.t++;
        p.vx -= div((p.slide && K ? K.slideDrag : FEEL.dashDrag) * p.vx, 100);
        const cancel = p.t >= FEEL.dashCancelFrom && p.bufT > 0 && p.buf & (IN.J | IN.A | IN.B);
        const len = p.slide === 1 ? K.slideFrames : p.slide === 2 ? K.rollFrames : FEEL.dashFrames;
        if (cancel || !p.ground || p.t >= len) { p.st = ST.IDLE; p.t = 0; p.slide = 0; } // keeps its momentum
      } else if (p.st === ST.ATK) {
        const m = M[p.mv];
        p.t++;
        // a held heavy charges: hold one frame before the strike, up to chargeMax frames
        if (m.charge && p.ground && input & IN.B && p.t === m.su - 1 && p.chg < FEEL.chargeMax) { p.chg++; p.t--; }
        if (p.t === m.su) {
          if (m.ix) p.vx = p.face * (K && p.cmb ? Math.max(m.ix, p.face * p.vx) : m.ix);
          if (m.iy) p.vy = m.iy;
          if (m.iy < 0) p.ground = 0;
        }
        if (p.ground) p.vx -= div((p.carry ? K.carryDrag : 12) * p.vx, 100);
        else if (dx) {
          p.vx += dx * div(P.airAcc, 2);
          if (Math.abs(p.vx) > P.airMax) p.vx -= dx * div(P.airAcc, 2);
        }
        // after a hit connects, jump or dodge cancels the recovery so strings flow
        const re = p.hit ? div(m.re * FEEL.hitRecovery, 100) : m.re;
        if (p.hit && p.t >= m.su + m.ac && p.bufT > 0 && p.buf & (IN.J | IN.X | (K && p.cmb < 2 ? IN.A : 0))) { p.st = ST.IDLE; p.t = 0; }
        else if (p.t >= m.su + m.ac + re) {
          p.st = ST.IDLE; p.t = 0;
          if (!p.hit) { p.lock = FEEL.missDodgeLock; p.dlock = FEEL.missDashLock; }
        }
        if (p.st === ST.IDLE && (p.mv === 5 || p.mv === 7 || p.mv === 9)) p.sig = FEEL.sigCd;
      }

      // jump startup: the jump leaves the ground 2 frames after the press
      if (p.squat > 0 && --p.squat === 0 && p.st === ST.IDLE && p.ground) { p.vy = P.jumpV; p.ground = 0; p.cut = !(input & IN.J) ? 1 : 0; if (p.cut) p.vy = -FEEL.jumpCut; }
      const busy = p.squat > 0 || p.lag > 0;
      if (p.st === ST.IDLE && s.f >= FEEL.countdown && !busy) {
        const dy = (input & IN.U ? -1 : 0) + (input & IN.D ? 1 : 0);
        const canDash = p.ground && dx && p.dlock <= 0 && p.dashCd <= 0;
        const airDash = K && !p.ground && (dx || dy) && p.adash < K.dashACount;
        const free = p.chase > 0 || (p.ground && dx ? canDash : p.dcd <= 0 && p.lock <= 0 && (!K || p.ground || airDash || !(dx || dy))); // a dash waits for its own cooldown, never turns into a backstep
        if (p.bufT > 0 && p.buf & IN.X && free && take(IN.X)) {
          p.st = ST.DODGE;
          if (p.chase > 0) { // chase dodge: free of the cooldown, faster, cancelable into an attack
            const sp = div(FEEL.dodgeSpeedA * FEEL.chaseSpeed, 100);
            p.chase--; p.dk = 4; p.dt = FEEL.dodgeStart + FEEL.dodgeInvChase; p.t = p.dt;
            p.vx = sp * dx; p.vy = p.ground ? 0 : dy ? sp * dy : Math.min(p.vy, 200);
          } else if (canDash && K && dy > 0) { // slide: low and fast, under attacks; jump out of it to go farther
            p.st = ST.DASH; p.t = 0; p.slide = 1; p.vx = dx * Math.max(Math.abs(p.vx), K.slideSpeed); p.dashCd = FEEL.dashCd;
          } else if (canDash) { p.st = ST.DASH; p.t = 0; p.vx = FEEL.dashSpeed * dx; p.dashCd = FEEL.dashCd; }
          else if (p.ground) { // no direction: an evasive backstep
            p.dk = 3; p.dt = FEEL.dodgeStart + FEEL.dodgeInvGround; p.t = p.dt; p.vx = -p.face * FEEL.backstep; p.dcd = FEEL.dodgeCdG;
          } else if (airDash) { // stick kit: a fast air dash, two per airtime, refreshed on landing, walls and hits
            const sp = dx && dy ? div(K.dashA * 72, 100) : K.dashA;
            p.dk = 1; p.dt = K.dashAFrames; p.t = p.dt; p.dcd = K.dashACd; p.adash++;
            p.vx = sp * dx; p.vy = sp * dy; p.ff = 0;
          } else if (dx || dy) { // air dodge with a direction
            p.dk = 1; p.dt = FEEL.dodgeStart + FEEL.dodgeInvAir; p.t = p.dt; p.dcd = FEEL.dodgeCdA; p.ds = 0;
            p.vx = FEEL.dodgeSpeedA * dx; p.vy = FEEL.dodgeSpeedA * dy;
          } else { // air dodge in place: longer invincibility, keeps a little of the fall
            p.dk = 2; p.dt = FEEL.dodgeStart + FEEL.dodgeInvSpot; p.t = p.dt; p.dcd = FEEL.dodgeCdA; p.ds = 0;
            p.vx = div(p.vx, 4); p.vy = Math.min(p.vy, 200);
          }
          if (dx) p.face = dx;
        } else if (take(IN.J)) {
          if (K && (p.ground || p.coy > 0)) { // instant, and a crouch held a moment first makes it a super jump
            p.sj = p.crouch >= K.crouchFor ? 1 : 0; // a super jump (the renderer flips it twice)
            p.vy = p.sj ? div(P.jumpV * K.superJump, 100) : P.jumpV;
            p.ground = 0; p.cut = 0; p.coy = 0; p.crouch = 0; p.ff = 0;
            vary(s, i, p); p.jv = p.sj ? 0 : vaultable(p, P) ? 9 : p.vr % 4;
          } else if (p.ground) p.squat = FEEL.jumpSquat;
          else if (p.wall && p.wj > 0) { if (K) { vary(s, i, p); p.jv = 0; } p.wj--; p.vy = P.jumpV; p.vx = K ? -p.wall * K.wallKick : 0; p.ff = 0; p.cut = 0; p.face = K ? -p.wall : p.wall; p.adash = 0; if (K) p.kick = K.kickLock; } // p.wall points at the wall; the kit kicks off it
          else if (p.jumps > 0) {
            p.jumps--; p.vy = P.airJumpV; p.vx = dx * P.airMax; p.ff = 0; p.cut = 0;
            if (K) { vary(s, i, p); p.jv = vaultable(p, P) ? 9 : p.vr % 3; }
            if (dx) p.face = dx;
          }
        } else {
          let kind = 0;
          if (take(IN.A)) kind = 1; else if (p.sig <= 0 && take(IN.B)) kind = 2;
          if (kind) {
            let m;
            const grounded = p.ground && !gc; // a gravity cancel uses the air moves on the ground
            if (kind === 2) m = input & IN.U ? (grounded || !p.recov ? 6 : -1) : input & IN.D ? (grounded ? 7 : 9) : 5;
            else m = input & IN.U ? 3 : input & IN.D ? (grounded ? 2 : 8) : dx ? 1 : grounded ? 0 : 4;
            if (m >= 0) {
              if (dx) p.face = dx;
              p.st = ST.ATK; p.t = 0; p.mv = m; p.hit = 0; p.chg = 0; if (K) vary(s, i, p);
              p.carry = K && Math.abs(p.vx) > P.run - 100 ? 1 : 0; // attacking at a run slides into the strike
              const light = kind === 1 && m !== 6; // a light inside the combo window continues the string
              p.cmb = K && light && p.cmbT > 0 ? Math.min(2, p.cmb + 1) : 0; p.cmbT = 0;
              if (K && p.cmb === 1) p.t = div(M[m].su * (100 - K.combo2Speed), 100); // hit 2 skips into its startup
              if (K && p.cmb) { // each follow-up steps in just far enough to keep the string in reach
                const o = s.p[1 - i], gap = (o.x - p.x) * p.face - div(M[m].box[1] * S * 6, 10);
                let travel = 0, w = 1000;
                for (let f = p.t; f < M[m].su; f++) { if (p.ground) w -= div(12 * w, 100); travel += w; }
                p.vx = gap > 0 && travel > 0 ? p.face * Math.min(p.cmb === 2 ? K.comboLunge : K.comboStep, div(gap * 1000, travel)) : 0;
              }
              if (m === 6) p.recov = 1;
              if (m === 9) { p.vy = 0; p.vx = div(p.vx, 3); }
            }
          }
        }
      }

      if (p.st === ST.IDLE) {
        if (p.ground) {
          if (K) { // the sprint builds while running one way; a crouch on the main stage charges a super jump
            p.runT = dx && dx * p.vx >= P.run - 60 ? p.runT + 1 : 0;
            p.crouch = !dx && input & IN.D && p.y === STAGE.main.y ? p.crouch + 1 : 0;
          }
          if (dx) {
            p.face = dx;
            const target = dx * (K && p.runT >= K.sprintAfter ? P.sprint : P.run);
            if (p.vx < target) p.vx = Math.min(target, p.vx + P.gAcc);
            else if (p.vx > target) p.vx = Math.max(target, p.vx - P.gAcc);
          } else if (p.vx > 0) p.vx = Math.max(0, p.vx - FEEL.fric);
          else if (p.vx < 0) p.vx = Math.min(0, p.vx + FEEL.fric);
          if (pressed & IN.D && p.y !== STAGE.main.y) { p.drop = 12; p.ground = 0; p.y += S; }
        } else {
          if (p.kick > 0) p.kick--; // a wall kick carries away from the wall before air steering returns
          else if (dx) {
            if (dx * p.vx < P.airMax) { p.vx += dx * P.airAcc; if (dx * p.vx > P.airMax) p.vx = dx * P.airMax; }
          } else if (p.vx) p.vx -= Math.sign(p.vx) * Math.min(Math.abs(p.vx), FEEL.airFric);
          if (pressed & IN.D && p.vy > -300) p.ff = 1;
          if (K && p.wall && !p.kick && dx === p.wall && p.wr < K.wallRun) { p.vy = -K.wallRunV; p.wr++; p.face = p.wall; p.ff = 0; } // run up the island's side
          if (!p.cut && !(input & IN.J) && p.vy < -P.jumpCut && p.wr === 0) { p.vy = -P.jumpCut; p.cut = 1; }
          if (p.vy >= 0) p.cut = 1;
        }
      }

      const wasGround = p.ground, fallV = p.vy;
      move(p, P, M);
      if (p.ground && !wasGround) land(p, M, P, dx, fallV);
      if (K && !p.ground && !p.hb && p.vy > 300 && p.st !== ST.HIT) { // landing on a foe's head: a stomp and a big bounce
        const o = s.p[1 - i], O = ph[1 - i], top = o.y - O.h;
        if (o.st !== ST.DEAD && o.inv <= 0 && Math.abs(p.x - o.x) < P.hw + O.hw && p.y >= top - 6 * S && p.y <= top + 16 * S) {
          p.vy = -K.bounceV; p.hb = 1; p.adash = 0; p.ff = 0; p.cut = 1; p.y = top - 6 * S;
          o.dmg += K.stompDmg; if (o.st !== ST.ATK || !mv[1 - i][o.mv].armor) { o.st = ST.HIT; o.t = K.stompStun; o.launch = 0; o.vx = 0; if (!o.ground) o.vy = Math.max(o.vy, 600); }
        }
      }
      if (K && wasGround && !p.ground && p.vy >= 0) p.coy = K.coyote; // ran off a ledge: a short grace jump
    }

    function move(p, P, M) {
      const prevY = p.y, onWall = p.wall;
      p.wall = 0;
      if (!p.ground) {
        const hit = p.st === ST.HIT;
        p.vy += hit ? FEEL.hitGrav : P.grav;
        const pounding = p.st === ST.ATK && M[p.mv].endOnLand && p.t >= M[p.mv].su;
        const cap = hit ? FEEL.hitMaxFall : p.ff ? P.fastFall : P.maxFall;
        if (p.ff && !hit && p.vy < P.fastFall) p.vy = Math.max(p.vy, P.fastFall);
        if (p.vy > cap && !pounding) p.vy = cap;
        if (onWall && !hit && p.vy > FEEL.wallSlide) p.vy = FEEL.wallSlide;
        if (onWall && P.kit) p.adash = 0;
      }
      p.x += p.vx; p.y += p.vy; p.ground = 0;
      const m = STAGE.main;
      if (p.vy >= 0) {
        if (p.x >= m.x1 - P.hw && p.x <= m.x2 + P.hw && prevY <= m.y && p.y >= m.y) { // any overlap with the ledge lands
          p.y = m.y; p.vy = 0; p.ground = 1;
        } else if (p.drop <= 0) {
          for (const pl of STAGE.plats) {
            if (p.x >= pl.x1 && p.x <= pl.x2 && prevY <= pl.y && p.y >= pl.y) { p.y = pl.y; p.vy = 0; p.ground = 1; break; }
          }
        }
      }
      // solid island body, a V from the ledges down to the keel: push out sideways along the
      // slope (that contact is a wall), or down if the fighter came up from underneath
      if (!p.ground && p.y > m.y && p.x + P.hw > m.x1 && p.x - P.hw < m.x2) {
        const half = div(m.x2 - m.x1, 2), cx = m.x1 + half, side = p.x < cx ? -1 : 1;
        const near = (x) => (side < 0 ? Math.min(x + P.hw, cx) : Math.max(x - P.hw, cx));
        const depth = (x) => m.keel - div((m.keel - m.lip) * Math.min(half, Math.abs(x - cx)), half);
        const head = p.y - P.h, bottom = m.y + depth(near(p.x));
        if (head < bottom) {
          if (prevY - P.h >= m.y + depth(near(p.x - p.vx))) { p.y = bottom + P.h; if (p.vy < 0) p.vy = 0; }
          else {
            const dy = head - m.y;
            const reach = dy <= m.lip ? half : div(half * (m.keel - dy), m.keel - m.lip);
            p.x = cx + side * (reach + P.hw);
            if (p.vx * side < 0) p.vx = 0;
            p.wall = -side;
          }
        }
      }
    }

    function land(p, M, P, dx, fallV) {
      // air jumps are refilled by step(), which knows the owner's physics
      p.recov = 0; p.ff = 0; p.land = 6; p.wj = FEEL.wallJumps; p.hb = 0;
      if (P.kit) { // the stick kit: no landing lag, air dashes back, and a roll out of a hard landing
        p.adash = 0; p.wr = 0; p.dcd = 0; p.sj = 0;
        if (p.st === ST.IDLE && dx && fallV > FEEL.kit.hardLand) { p.st = ST.DASH; p.t = 0; p.slide = 2; p.vx = dx * FEEL.kit.rollSpeed; p.face = dx; }
      } else if (p.st === ST.IDLE) p.lag = FEEL.jumpLand;
      if (p.ds < 999) { p.dcd = p.ds >= FEEL.dodgeLandCd ? 0 : Math.min(p.dcd, FEEL.dodgeLandCd - p.ds); p.ds = 999; } // an air dodge's cooldown
      if (p.st === ST.ATK && p.mv === 9 && p.t >= M[9].su) { p.mv = 7; p.t = M[7].su - 2; p.hit = 0; p.vx = 0; }
      else if (p.st === ST.ATK && M[p.mv].air) { p.st = ST.IDLE; p.t = 0; }
      if (p.st === ST.HIT && p.t > 0) p.vx = div(6 * p.vx, 10);
    }

    function step(s, inputs) {
      if (s.over) { s.overT++; stepPlayer(s, s.over - 1, 0); s.f++; return; } // the winner settles onto the ground for the victory pose
      // the reference opening: fighters hang on spawn pads during the countdown and drop in
      if (s.f < FEEL.countdown - FEEL.spawnRelease) { s.f++; return; }
      if (s.f === FEEL.countdown - FEEL.spawnRelease) for (const p of s.p) p.drop = 40; // fall through the soft platforms
      const ins = s.f < FEEL.countdown ? [0, 0] : inputs;
      if (s.fin > 0) { // the finisher cinematic: everything holds while it plays
        s.fin--;
        for (let i = 0; i < 2; i++) bufferPress(s.p[i], 0);
        s.f++;
        return;
      }
      if (s.freeze > 0) {
        s.freeze--;
        for (let i = 0; i < 2; i++) bufferPress(s.p[i], ins[i]);
        s.f++;
        return;
      }
      for (let i = 0; i < 2; i++) {
        const before = s.p[i].ground;
        stepPlayer(s, i, ins[i]);
        if (s.p[i].ground && !before) s.p[i].jumps = ph[i].airJumps;
      }
      const hits = [];
      for (let i = 0; i < 2; i++) {
        const a = s.p[i];
        if (a.st !== ST.ATK || a.hit) continue;
        const m = mv[i][a.mv];
        if (a.t < m.su || a.t >= m.su + m.ac) continue;
        const v = s.p[1 - i], V = ph[1 - i];
        if (v.st === ST.DEAD || v.inv > 0) continue;
        if (v.st === ST.DODGE && v.dt - v.t >= FEEL.dodgeStart) continue;
        const b = box(a, m), vh = v.st === ST.DASH && v.slide === 1 ? div(V.h, 2) : V.h; // a slide ducks under
        if (b[0] < v.x + V.hw && b[1] > v.x - V.hw && b[2] < v.y && b[3] > v.y - vh) hits.push(i);
      }
      for (const i of hits) {
        const a = s.p[i], v = s.p[1 - i], m = mv[i][a.mv], V = ph[1 - i];
        a.hit = 1;
        const vm = v.st === ST.ATK ? mv[1 - i][v.mv] : null;
        const within = (w) => w && v.t >= w[0] && v.t <= w[1];
        const hb = box(a, m);
        // spark at the contact point: the hitbox center clamped onto the victim's hurtbox
        s.hf = s.f; s.hp = i; s.ha = 0;
        s.hx = Math.max(v.x - V.hw, Math.min(v.x + V.hw, div(hb[0] + hb[1], 2)));
        s.hy = Math.max(v.y - V.h, Math.min(v.y - 8 * S, div(hb[2] + hb[3], 2)));
        if (vm && within(vm.parry)) {
          // parried: no damage, the attacker is knocked back and stunned
          a.st = ST.HIT; a.t = FEEL.parryStun; a.launch = 0; a.vx = -a.face * 600; a.vy = a.ground ? 0 : -300;
          s.ha = 2; s.hk = 0; s.freeze = Math.max(s.freeze, FEEL.pauseMax);
          continue;
        }
        const kitA = ph[i].kit ? FEEL.kit : null, fin3 = kitA && a.cmb === 2;
        const dmg = div((m.dmg + div(m.dmg * a.chg, 60)) * (fin3 ? kitA.finDmg : 100), 100);
        if (kitA && a.cmb < 2 && a.mv !== 6 && [0, 1, 2, 3, 4, 8].includes(a.mv)) a.cmbT = m.su + m.ac + m.re - a.t + kitA.comboWindow;
        v.dmg = Math.min(999, v.dmg + dmg);
        let l = m.kb + div(m.kg * Math.max(0, v.dmg - FEEL.growthFrom), FEEL.growthDiv);
        l = div(l * FEEL.kbMul, 100);
        l = div(l * 100, V.weight);
        l = div(l * (60 + a.chg), 60);
        if (fin3) l = div(l * kitA.finKb, 100);
        a.chase = a.ground ? 2 : 1; a.chaseT = m.su + m.ac + m.re - a.t + FEEL.chaseWindow;
        s.hk = l;
        if (vm && within(vm.armor)) {
          // armored: the damage sticks, the move goes on
          s.ha = 1; s.freeze = Math.max(s.freeze, FEEL.pauseBase);
          continue;
        }
        const dir = m.away ? (v.x >= a.x ? 1 : -1) : a.face;
        v.vx = dir * div(l * m.ax, 100);
        v.vy = div(l * m.ay, 100);
        if (v.ground && v.vy > 0) v.vy = -div(v.vy, 2);
        v.ground = 0; v.st = ST.HIT; v.t = FEEL.hitstunBase + div(l, FEEL.hitstunDiv); v.launch = l;
        v.ff = 0; v.recov = 0; v.chg = 0; v.adash = 0; v.slide = 0;
        if (v.jumps < 1) v.jumps = 1;
        if (v.vx) v.face = v.vx > 0 ? -1 : 1;
        if (a.mv === 9) { a.st = ST.IDLE; a.t = 0; a.vy = -900; }
        if (a.mv === 5 && a.chg >= FEEL.finCharge && v.dmg >= FEEL.finDamage) {
          // the finisher: a guaranteed KO launch once the cinematic ends; the attacker ends up
          // behind the victim, back turned
          v.dmg = Math.min(999, v.dmg + FEEL.finBonus);
          const L = div(l * 5, 2);
          v.vx = dir * div(L * 70, 100); v.vy = -div(L * 71, 100); v.t = 90; v.launch = L; v.ground = 0;
          a.st = ST.IDLE; a.t = 0; a.vx = 0; a.vy = 0; a.x = v.x + dir * 55 * S; a.face = dir;
          s.fin = FEEL.finFrames; s.fa = i; s.freeze = 0;
          continue;
        }
        s.freeze = Math.max(s.freeze, Math.min(FEEL.pauseMax, FEEL.pauseBase + div(dmg, FEEL.pauseDiv)) + (fin3 ? kitA.finPause : 0));
        if (fin3) a.cmb = 3; // marks the landed finisher for the renderer until the move ends
      }
      const B = STAGE.blast;
      for (let i = 0; i < 2; i++) {
        const p = s.p[i];
        if (p.st === ST.DEAD) continue;
        if (p.x < B.l || p.x > B.r || p.y > B.b || p.y < B.t) {
          s.kf = s.f; s.kx = Math.max(B.l, Math.min(B.r, p.x)); s.ky = Math.max(B.t, Math.min(B.b, p.y)); s.kp = i;
          p.stocks--; p.st = ST.DEAD; p.t = FEEL.deadFrames; p.vx = 0; p.vy = 0;
          if (p.stocks <= 0) { s.over = 2 - i; s.overT = 0; }
        }
      }
      s.f++;
    }

    return { create, clone, hash, step, box, ph, mv };
  }

  const api = { S, IN, ST, STAGE, FEEL, match, physics, moves };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Sim = api;
})(this);
