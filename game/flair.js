// Dune Brawl per-fighter flair: render-only effects that give each fighter their own look on top
// of the shared reference effects (white sparks, cloud trails, KO splash). In the reference a
// player's weapon smears carry the weapon's colours and the KO they score can end in their own
// emblem; this file is where a fighter declares those. Nothing here touches the sim.
//
// A style can set:
//   smear: colour           tint of the swing crescent on light attacks
//   after: colour           tint of dodge and dash afterimages
//   ko: colour              speed lines of the KO splash this fighter scores
//   hooks (all optional), called by main.js with an api object (see main.js `flairApi`):
//     hit(api, i, x, y, dir, heavy, mv)     this fighter landed a hit
//     parried(api, i, x, y)                 this fighter parried a hit
//     dodge(api, i, x, y, back)             this fighter started a dodge or dash
//     frame(api, i, p, s)                   every frame while alive (signature move effects)
//     land(api, i, x, y, mv)                landed during an attack
//     scoredKO(api, i, x, y, ang, size)     this fighter knocked the other out, at the screen edge
//     won(api, i, x, y)                     the match ended in this fighter's favour
//     drawFront(api, i, p, s, g)            draw over the fighter (world space)
(function (root) {
  "use strict";

  // ---------- procedural shapes (world or screen space, the caller sets the transform) ----------
  // A bat in side view: a small body with ears and two scalloped wings that flap with `phase`.
  function bat(g, x, y, size, phase, rot, body, eye) {
    const flap = Math.sin(phase), s = size;
    g.save(); g.translate(x, y); g.rotate(rot || 0);
    g.fillStyle = body; g.strokeStyle = "rgba(255,90,122,0.55)"; g.lineWidth = Math.max(0.6, s * 0.06);
    for (const side of [-1, 1]) {
      g.save(); g.scale(side, 0.2 + 0.8 * flap); // wings sweep from up to down
      g.beginPath(); g.moveTo(0, 0);
      g.quadraticCurveTo(s * 0.45, -s * 0.55, s * 1.05, -s * 0.12);   // leading edge
      g.lineTo(s * 0.86, s * 0.08); g.quadraticCurveTo(s * 0.74, -s * 0.02, s * 0.62, s * 0.14); // three scallops
      g.quadraticCurveTo(s * 0.5, s * 0.02, s * 0.38, s * 0.16);
      g.quadraticCurveTo(s * 0.25, s * 0.04, 0, s * 0.12);
      g.closePath(); g.fill(); g.stroke(); g.restore();
    }
    g.beginPath(); g.ellipse(0, s * 0.05, s * 0.17, s * 0.24, 0, 0, 7); g.fill();
    g.beginPath(); g.moveTo(-s * 0.13, -s * 0.12); g.lineTo(-s * 0.08, -s * 0.34); g.lineTo(-s * 0.01, -s * 0.15);
    g.lineTo(s * 0.01, -s * 0.15); g.lineTo(s * 0.08, -s * 0.34); g.lineTo(s * 0.13, -s * 0.12); g.fill();
    if (eye) { g.fillStyle = eye; g.fillRect(-s * 0.08, -s * 0.06, s * 0.05, s * 0.05); g.fillRect(s * 0.03, -s * 0.06, s * 0.05, s * 0.05); }
    g.restore();
  }

  // A rose petal: a teardrop with a darker crease, flat cel colours.
  function petal(g, x, y, size, rot, color, shade) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, 0.45 + 0.55 * Math.abs(Math.cos(rot * 1.7)));
    g.fillStyle = color; g.beginPath();
    g.moveTo(0, -size); g.bezierCurveTo(size * 0.9, -size * 0.6, size * 0.7, size * 0.6, 0, size);
    g.bezierCurveTo(-size * 0.7, size * 0.6, -size * 0.9, -size * 0.6, 0, -size); g.fill();
    g.strokeStyle = shade; g.lineWidth = Math.max(0.6, size * 0.18);
    g.beginPath(); g.moveTo(0, -size * 0.6); g.quadraticCurveTo(size * 0.2, 0, 0, size * 0.7); g.stroke();
    g.restore();
  }

  // An open lace parasol canopy seen from the side (dome toward +x), the parry's shield.
  function canopy(g, x, y, r, alpha, rim) {
    g.save(); g.translate(x, y); g.globalAlpha *= alpha;
    g.beginPath(); g.moveTo(0, r);
    g.bezierCurveTo(r * 0.95, r * 0.9, r * 0.95, -r * 0.9, 0, -r);                 // the dome
    for (let k = 1; k <= 4; k++) { const y0 = -r + (k - 1) * r / 2, y1 = -r + k * r / 2; g.quadraticCurveTo(-r * 0.16, (y0 + y1) / 2, 0, y1); } // lace scallops
    g.closePath();
    g.fillStyle = "rgba(20,6,18,0.82)"; g.fill();
    g.lineWidth = Math.max(1.5, r * 0.09); g.strokeStyle = rim; g.stroke();
    g.lineWidth = Math.max(1, r * 0.04); g.strokeStyle = "rgba(255,214,224,0.8)";
    for (const k of [-0.55, 0, 0.55]) { g.beginPath(); g.moveTo(0, k * r); g.quadraticCurveTo(r * 0.5, k * r * 0.8, r * 0.7, k * r * 0.5); g.stroke(); } // ribs
    g.restore();
  }

  // Vespera's crest: an open parasol between two bat wings, in front of a pale moon, with the
  // rapier tip pointing down. Drawn flat with a thick dark outline, like the reference emblems.
  function crest(g, x, y, size, alpha) {
    const s = size;
    g.save(); g.translate(x, y); g.globalAlpha *= alpha; g.lineJoin = "round"; g.lineCap = "round";
    const ink = "#14060f", red = "#c8143c", hi = "#ff5c7a";
    g.fillStyle = "#ffe3e8"; g.strokeStyle = ink; g.lineWidth = s * 0.05;
    g.beginPath(); g.arc(0, -s * 0.05, s * 0.42, 0, 7); g.fill(); g.stroke();                  // moon
    g.fillStyle = "rgba(255,92,122,0.35)"; g.beginPath(); g.arc(s * 0.12, -s * 0.12, s * 0.3, 0, 7); g.fill();
    for (const side of [-1, 1]) {                                                               // wings
      g.save(); g.scale(side, 1);
      g.beginPath(); g.moveTo(s * 0.16, -s * 0.1);
      g.quadraticCurveTo(s * 0.55, -s * 0.62, s * 1.0, -s * 0.36);
      g.lineTo(s * 0.88, -s * 0.12); g.quadraticCurveTo(s * 0.78, -s * 0.2, s * 0.68, -s * 0.02);
      g.quadraticCurveTo(s * 0.56, -s * 0.14, s * 0.44, 0.04 * s);
      g.quadraticCurveTo(s * 0.32, -s * 0.06, s * 0.16, s * 0.08); g.closePath();
      g.fillStyle = ink; g.fill(); g.strokeStyle = red; g.lineWidth = s * 0.025; g.stroke();
      g.restore();
    }
    g.beginPath(); g.moveTo(-s * 0.36, -s * 0.06); g.quadraticCurveTo(0, -s * 0.62, s * 0.36, -s * 0.06); // canopy
    for (let k = 3; k >= -3; k -= 2) g.quadraticCurveTo(s * (k * 0.12 + 0.06), s * 0.04, s * k * 0.12, -s * 0.06);
    g.closePath(); g.fillStyle = red; g.fill(); g.strokeStyle = ink; g.lineWidth = s * 0.05; g.stroke();
    g.strokeStyle = hi; g.lineWidth = s * 0.02;
    g.beginPath(); g.moveTo(0, -s * 0.33); g.lineTo(0, -s * 0.08); g.moveTo(-s * 0.2, -s * 0.24); g.lineTo(-s * 0.12, -s * 0.07); g.moveTo(s * 0.2, -s * 0.24); g.lineTo(s * 0.12, -s * 0.07); g.stroke();
    g.strokeStyle = ink; g.lineWidth = s * 0.07; g.beginPath(); g.moveTo(0, -s * 0.06); g.lineTo(0, s * 0.62); g.stroke(); // blade
    g.strokeStyle = "#e9eef5"; g.lineWidth = s * 0.03; g.beginPath(); g.moveTo(0, -s * 0.04); g.lineTo(0, s * 0.6); g.stroke();
    g.restore();
  }

  // ---------- styles ----------
  // light rose pinks with a white edge: petals must never read as drops of anything
  const ROSE = ["#ff8fb1", "#ffc2d4", "#f2648f", "#ffe0ea"];
  const STYLES = {
    "vampire-countess": {
      smear: "#e0244a", after: "#8a1638", ko: "#ff3d64",
      // a hit sheds rose petals along the thrust; Countess Thrust also pierces with a long glint
      hit(api, i, x, y, dir, heavy, mv) {
        const n = heavy ? 6 : 3;
        for (let k = 0; k < n; k++) api.petal(x, y, dir, heavy ? 1.3 : 1);
        if (mv === 5 || mv === 1) api.mark({ kind: "pierce", x, y, dir, life: mv === 5 ? 12 : 7, len: mv === 5 ? 2.4 : 1.4 });
      },
      // Shade Snap: a parried hit throws the canopy up as a shield and scatters bats
      parried(api, i, x, y) {
        api.mark({ kind: "canopy", i, life: 20 });
        for (let k = 0; k < 7; k++) api.bat(x, y, (k / 7) * Math.PI * 2, 8 + api.rnd() * 4, 0.9);
      },
      // she dodges by bursting into a few bats that peel off behind her
      dodge(api, i, x, y, back) {
        for (let k = 0; k < 5; k++) api.bat(x, y - api.body(i) * (0.3 + api.rnd() * 0.5), (back > 0 ? 0 : Math.PI) + (api.rnd() - 0.5) * 1.6, 7 + api.rnd() * 4, 0.75);
      },
      frame(api, i, p, s) {
        const m = api.move(i, p.mv);
        if (p.st !== api.ST.ATK) return;
        // Bat Swarm: bats pour out around her while she rises
        if (p.mv === 6 && p.t >= m.su && p.t < m.su + m.ac) for (let k = 0; k < 2; k++) {
          const a = -Math.PI / 2 + (api.rnd() - 0.5) * 2.6;
          api.bat(p.x / api.S + (api.rnd() - 0.5) * 30, p.y / api.S - api.body(i) * (0.1 + api.rnd() * 0.8), a, 7 + api.rnd() * 5, 1);
        }
        // Shade Snap: a crimson ward shimmers in front of her for the parry frames
        if (p.mv === 2 && m.parry && p.t >= m.parry[0] && p.t <= m.parry[1]) api.mark({ kind: "ward", i, life: 2 });
        // a charged heavy gathers petals toward the blade
        if (p.chg > 0 && p.t === m.su - 1 && s.f % 3 === 0) api.petalIn(p.x / api.S + p.face * 30, p.y / api.S - api.body(i) * 0.55);
      },
      // Nightfall lands with a ring of shade and a puff of bats
      land(api, i, x, y, mv) {
        if (mv !== 9) return;
        api.mark({ kind: "ring", x, y: y - 4, color: "#8a1638", life: 20, r0: 0.4, r1: 2.2, flat: 1 });
        for (let k = 0; k < 8; k++) api.bat(x, y - 10, Math.PI + (k / 7) * Math.PI, 8 + api.rnd() * 4, 0.9);
      },
      // her KO: a flock of bats bursts in from the edge and her crest rises over the cloud bank
      scoredKO(api, i, x, y, ang, size) {
        for (let k = 0; k < 18; k++) api.bat(x, y, ang + (api.rnd() - 0.5) * 1.6, 11 + api.rnd() * 10, 1.6);
        const cx = x + Math.cos(ang) * size * 0.34, cy = y + Math.sin(ang) * size * 0.34;
        api.mark({ kind: "crest", x: cx, y: cy, size: size * 0.2, life: 96 });
        for (let k = 0; k < 14; k++) api.petal(cx, cy, Math.cos(ang) >= 0 ? 1 : -1, 2.2);
      },
      won(api, i, x, y) { for (let k = 0; k < 24; k++) api.petalRain(x, y); },
    },
  };

  root.Flair = { STYLES, bat, petal, canopy, crest, ROSE };
})(this);
