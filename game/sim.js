// Dune Brawl deterministic simulation (test build).
// Integer math only, no clocks, no Math.random. Positions and velocities are in sim units:
// 100 sim units = 1 world px. Ported from the live prototype, with per-fighter move data and
// stats, weight, and the game feel retune from the development plan.
(function (root) {
  "use strict";

  const S = 100;
  const div = (a, b) => Math.trunc(a / b);
  const IN = { L: 1, R: 2, U: 4, D: 8, J: 16, A: 32, B: 64, X: 128 };
  const ST = { IDLE: 0, ATK: 1, HIT: 2, DODGE: 3, DEAD: 4 };

  // Dune Island: one main platform (720 px wide) and two soft platforms.
  const STAGE = {
    main: { x1: 280 * S, x2: 1000 * S, y: 470 * S, yb: 560 * S },
    plats: [
      { x1: 370 * S, x2: 570 * S, y: 330 * S },
      { x1: 710 * S, x2: 910 * S, y: 330 * S },
    ],
    blast: { l: -320 * S, r: 1600 * S, t: -360 * S, b: 1010 * S },
    spawnX: [520 * S, 760 * S],
    respawn: { x: 640 * S, y: 120 * S },
  };

  // Global feel values. Every fighter's stats are percentages of these.
  // Units: sim units per frame (velocities), sim units per frame squared (gravity).
  const FEEL = {
    grav: 72, hitGrav: 45, maxFall: 1300, fastFall: 2000, hitMaxFall: 2800,
    run: 900, gAcc: 210, fric: 150, airAcc: 95, airMax: 760, airFric: 8,
    jumpV: 1520, airJumpV: 1420, jumpCut: 700,
    h: 64, hw: 18,
    kbMul: 350,          // knockback multiplier in percent, applied to base and growth
    hitstunDiv: 168,     // hitstun = 6 + launch / hitstunDiv (48 x 3.5 keeps the prototype's hitstun)
    hitDecay: 4,         // percent of horizontal launch speed lost per frame in hitstun
    pauseBase: 4, pauseDiv: 2, pauseMax: 12,
    dodgeG: 20, dodgeA: 22, dodgeCdG: 36, dodgeCdA: 60, dodgeInvFrom: 3,
    dodgeSpeedG: 1250, dodgeSpeedA: 1150,
    buffer: 7, countdown: 90, stocks: 3, deadFrames: 75, respawnInv: 100,
  };

  const isqrt = (n) => (n <= 0 ? 0 : Math.floor(Math.sqrt(n)));

  // Build the per-player physics table from a fighter definition (moves.draft.json).
  function physics(def) {
    const st = def.stats || {};
    const pct = (k) => (st[k] === undefined ? 100 : st[k]);
    const grav = div(FEEL.grav * pct("gravity"), 100);
    // jump stat is a height percentage: keep v^2 / 2g proportional to it
    const baseH = div(FEEL.jumpV * FEEL.jumpV, 2 * FEEL.grav);
    const airBaseH = div(FEEL.airJumpV * FEEL.airJumpV, 2 * FEEL.grav);
    return {
      grav,
      maxFall: div(FEEL.maxFall * pct("fallSpeed"), 100),
      fastFall: div(FEEL.fastFall * pct("fallSpeed"), 100),
      run: div(FEEL.run * pct("run"), 100),
      gAcc: div(FEEL.gAcc * pct("run"), 100),
      airMax: div(FEEL.airMax * pct("airSpeed"), 100),
      airAcc: div(FEEL.airAcc * pct("airSpeed"), 100),
      jumpV: -isqrt(2 * grav * div(baseH * pct("jump"), 100)),
      airJumpV: -isqrt(2 * grav * div(airBaseH * pct("jump"), 100)),
      airJumps: st.airJumps === undefined ? 2 : st.airJumps,
      weight: st.weight || 100,
      hw: div((st.hurtW || FEEL.hw * 2) * S, 2),
      h: FEEL.h * S,
    };
  }

  // Moves: the 10 slots from the fighter JSON, integers only.
  function moves(def) {
    return def.moves.slice(0, 10).map((m) => ({
      su: m.su, ac: m.ac, re: m.re, box: m.box.slice(), dmg: m.dmg, kb: m.kb, kg: m.kg,
      ax: m.ax, ay: m.ay, ix: m.ix || 0, iy: m.iy || 0, away: m.away || 0, air: m.air || 0,
      endOnLand: m.endOnLand || 0,
    }));
  }

  function player(x, face, ph) {
    return {
      x, y: STAGE.main.y, vx: 0, vy: 0, face, ground: 1, jumps: ph.airJumps, dmg: 0,
      stocks: FEEL.stocks, st: ST.IDLE, t: 0, mv: 0, hit: 0, inv: 0, dcd: 0, drop: 0, recov: 0,
      ff: 0, cut: 1, prev: 0, buf: 0, bufT: 0, land: 0, launch: 0,
    };
  }
  const PKEYS = Object.keys(player(0, 1, { airJumps: 2 }));
  const GKEYS = ["f", "freeze", "over", "overT", "hf", "hx", "hy", "hk", "hp", "kf", "kx", "ky", "kp"];

  // A match binds two fighter definitions; the returned object steps a plain state.
  function match(defA, defB) {
    const ph = [physics(defA), physics(defB)];
    const mv = [moves(defA), moves(defB)];

    function create() {
      return {
        f: 0, freeze: 0, over: 0, overT: 0, hf: -1, hx: 0, hy: 0, hk: 0, hp: 0,
        kf: -1, kx: 0, ky: 0, kp: 0,
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

    function stepPlayer(s, i, input) {
      const p = s.p[i], P = ph[i], M = mv[i];
      const pressed = bufferPress(p, input);
      if (p.st === ST.DEAD) {
        if (p.stocks <= 0) return;
        if (--p.t <= 0) {
          p.x = STAGE.respawn.x; p.y = STAGE.respawn.y; p.vx = 0; p.vy = 0; p.st = ST.IDLE; p.t = 0;
          p.inv = FEEL.respawnInv; p.dmg = 0; p.jumps = P.airJumps; p.ground = 0; p.recov = 0; p.ff = 0;
        }
        return;
      }
      if (p.inv > 0) p.inv--;
      if (p.dcd > 0) p.dcd--;
      if (p.drop > 0) p.drop--;
      if (p.land > 0) p.land--;
      const dx = (input & IN.R ? 1 : 0) - (input & IN.L ? 1 : 0);
      const take = (bit) => {
        if (p.bufT > 0 && p.buf & bit) { p.buf &= ~bit; if (!p.buf) p.bufT = 0; return true; }
        return false;
      };

      if (p.st === ST.HIT) {
        if (--p.t <= 0) { p.st = ST.IDLE; p.t = 0; p.launch = 0; }
        p.vx -= div(FEEL.hitDecay * p.vx, 100);
      } else if (p.st === ST.DODGE) {
        p.t--;
        if (p.ground) p.vx -= div(18 * p.vx, 100);
        else { p.vx -= div(9 * p.vx, 100); p.vy -= div(9 * p.vy, 100); }
        if (p.t <= 0) { p.st = ST.IDLE; p.t = 0; }
      } else if (p.st === ST.ATK) {
        const m = M[p.mv];
        p.t++;
        if (p.t === m.su) {
          if (m.ix) p.vx = p.face * m.ix;
          if (m.iy) p.vy = m.iy;
          if (m.iy < 0) p.ground = 0;
        }
        if (p.ground) p.vx -= div(12 * p.vx, 100);
        else if (dx) {
          p.vx += dx * div(P.airAcc, 2);
          if (Math.abs(p.vx) > P.airMax) p.vx -= dx * div(P.airAcc, 2);
        }
        if (p.t >= m.su + m.ac + m.re) { p.st = ST.IDLE; p.t = 0; }
      }

      if (p.st === ST.IDLE && s.f >= FEEL.countdown) {
        if (take(IN.X) && p.dcd <= 0) {
          p.st = ST.DODGE;
          if (p.ground) { p.t = FEEL.dodgeG; p.vx = FEEL.dodgeSpeedG * dx; p.dcd = FEEL.dodgeCdG; }
          else {
            p.t = FEEL.dodgeA; p.dcd = FEEL.dodgeCdA;
            const dy = (input & IN.U ? -1 : 0) + (input & IN.D ? 1 : 0);
            p.vx = FEEL.dodgeSpeedA * dx; p.vy = dy ? FEEL.dodgeSpeedA * dy : Math.min(p.vy, 200);
          }
          if (dx) p.face = dx;
        } else if (take(IN.J)) {
          if (p.ground) { p.vy = P.jumpV; p.ground = 0; p.cut = 0; }
          else if (p.jumps > 0) {
            p.jumps--; p.vy = P.airJumpV; p.vx = dx * P.airMax; p.ff = 0; p.cut = 0;
            if (dx) p.face = dx;
          }
        } else {
          let kind = 0;
          if (take(IN.A)) kind = 1; else if (take(IN.B)) kind = 2;
          if (kind) {
            let m;
            if (kind === 2) m = input & IN.U ? (p.ground || !p.recov ? 6 : -1) : input & IN.D ? (p.ground ? 7 : 9) : 5;
            else m = input & IN.U ? 3 : input & IN.D ? (p.ground ? 2 : 8) : dx ? 1 : p.ground ? 0 : 4;
            if (m >= 0) {
              if (dx) p.face = dx;
              p.st = ST.ATK; p.t = 0; p.mv = m; p.hit = 0;
              if (m === 6) p.recov = 1;
              if (m === 9) { p.vy = 0; p.vx = div(p.vx, 3); }
            }
          }
        }
      }

      if (p.st === ST.IDLE) {
        if (p.ground) {
          if (dx) {
            p.face = dx;
            const target = dx * P.run;
            if (p.vx < target) p.vx = Math.min(target, p.vx + P.gAcc);
            else if (p.vx > target) p.vx = Math.max(target, p.vx - P.gAcc);
          } else if (p.vx > 0) p.vx = Math.max(0, p.vx - FEEL.fric);
          else if (p.vx < 0) p.vx = Math.min(0, p.vx + FEEL.fric);
          if (pressed & IN.D && p.y !== STAGE.main.y) { p.drop = 12; p.ground = 0; p.y += S; }
        } else {
          if (dx) {
            if (dx * p.vx < P.airMax) { p.vx += dx * P.airAcc; if (dx * p.vx > P.airMax) p.vx = dx * P.airMax; }
          } else if (p.vx) p.vx -= Math.sign(p.vx) * Math.min(Math.abs(p.vx), FEEL.airFric);
          if (pressed & IN.D && p.vy > -300) p.ff = 1;
          if (!p.cut && !(input & IN.J) && p.vy < -FEEL.jumpCut) { p.vy = -FEEL.jumpCut; p.cut = 1; }
          if (p.vy >= 0) p.cut = 1;
        }
      }

      const wasGround = p.ground;
      move(p, P, M);
      if (p.ground && !wasGround) land(p, M);
    }

    function move(p, P, M) {
      const prevY = p.y;
      if (!p.ground) {
        const hit = p.st === ST.HIT;
        p.vy += hit ? FEEL.hitGrav : P.grav;
        const pounding = p.st === ST.ATK && M[p.mv].endOnLand && p.t >= M[p.mv].su;
        const cap = hit ? FEEL.hitMaxFall : p.ff ? P.fastFall : P.maxFall;
        if (p.ff && !hit && p.vy < P.fastFall) p.vy = Math.max(p.vy, P.fastFall);
        if (p.vy > cap && !pounding) p.vy = cap;
      }
      p.x += p.vx; p.y += p.vy; p.ground = 0;
      const m = STAGE.main;
      if (p.vy >= 0) {
        if (p.x >= m.x1 - 6 * S && p.x <= m.x2 + 6 * S && prevY <= m.y && p.y >= m.y) {
          p.y = m.y; p.vy = 0; p.ground = 1;
        } else if (p.drop <= 0) {
          for (const pl of STAGE.plats) {
            if (p.x >= pl.x1 && p.x <= pl.x2 && prevY <= pl.y && p.y >= pl.y) { p.y = pl.y; p.vy = 0; p.ground = 1; break; }
          }
        }
      }
      // solid island body: push out of the sides and the underside
      if (!p.ground && p.y > m.y && p.y - P.h < m.yb && p.x + P.hw > m.x1 && p.x - P.hw < m.x2) {
        if (prevY - P.h >= m.yb) { p.y = m.yb + P.h; if (p.vy < 0) p.vy = 0; }
        else if (p.x < div(m.x1 + m.x2, 2)) { p.x = m.x1 - P.hw; if (p.vx > 0) p.vx = 0; }
        else { p.x = m.x2 + P.hw; if (p.vx < 0) p.vx = 0; }
      }
    }

    function land(p, M) {
      // air jumps are refilled by step(), which knows the owner's physics
      p.recov = 0; p.ff = 0; p.land = 6;
      if (p.st === ST.ATK && p.mv === 9 && p.t >= M[9].su) { p.mv = 7; p.t = M[7].su - 2; p.hit = 0; p.vx = 0; }
      else if (p.st === ST.ATK && M[p.mv].air) { p.st = ST.IDLE; p.t = 0; }
      if (p.st === ST.HIT && p.t > 0) p.vx = div(6 * p.vx, 10);
    }

    function step(s, inputs) {
      if (s.over) { s.overT++; s.f++; return; }
      const ins = s.f < FEEL.countdown ? [0, 0] : inputs;
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
        if (v.st === ST.DODGE && v.t > FEEL.dodgeInvFrom - 1) continue;
        const b = box(a, m);
        if (b[0] < v.x + V.hw && b[1] > v.x - V.hw && b[2] < v.y && b[3] > v.y - V.h) hits.push(i);
      }
      for (const i of hits) {
        const a = s.p[i], v = s.p[1 - i], m = mv[i][a.mv];
        a.hit = 1;
        v.dmg = Math.min(999, v.dmg + m.dmg);
        let l = m.kb + div(m.kg * v.dmg, 10);
        l = div(l * FEEL.kbMul, 100);
        l = div(l * 100, ph[1 - i].weight);
        const dir = m.away ? (v.x >= a.x ? 1 : -1) : a.face;
        v.vx = dir * div(l * m.ax, 100);
        v.vy = div(l * m.ay, 100);
        if (v.ground && v.vy > 0) v.vy = -div(v.vy, 2);
        v.ground = 0; v.st = ST.HIT; v.t = 6 + div(l, FEEL.hitstunDiv); v.launch = l;
        v.ff = 0; v.recov = 0;
        if (v.jumps < 1) v.jumps = 1;
        if (v.vx) v.face = v.vx > 0 ? -1 : 1;
        if (a.mv === 9) { a.st = ST.IDLE; a.t = 0; a.vy = -900; }
        s.freeze = Math.max(s.freeze, Math.min(FEEL.pauseMax, FEEL.pauseBase + div(m.dmg, FEEL.pauseDiv)));
        s.hf = s.f; s.hx = v.x; s.hy = v.y - 36 * S; s.hk = l; s.hp = i;
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
