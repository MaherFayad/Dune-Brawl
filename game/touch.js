// Dune Brawl touch controls for phones and tablets: a floating analog stick on the left half of
// the screen and an action cluster on the right. They produce the same input bits as the
// keyboard (Sim.IN), merged into player 1's input, so they work in every mode, online included.
// Shown only during a match on a touch screen. Targets are 64 to 84 px, well over the WCAG 2.2
// minimum (2.5.8) and the 44 pt platform guideline; every control works with multi-touch.
(function (root) {
  "use strict";
  const IN = root.Sim.IN;
  const coarse = () => (root.matchMedia && root.matchMedia("(pointer: coarse)").matches) || "ontouchstart" in root;
  let used = coarse(), shown = false, el = null;
  const held = new Map(); // pointerId -> bits held by a button
  const stick = { id: null, ox: 0, oy: 0, x: 0, y: 0, R: 64, lowT: 0, jump: false };
  // tap jump: a quick flick up jumps (held for a full jump, let go early for a short hop); a slow
  // push up stays a plain up, for up attacks, aiming a throw and the recovery
  const JUMP_Y = -0.62, LOW_Y = -0.3, FLICK_MS = 150;
  function tapJump() {
    const ny = (stick.y - stick.oy) / stick.R, now = performance.now();
    if (ny > LOW_Y) { stick.lowT = now; stick.jump = false; }
    else if (ny < JUMP_Y && !stick.jump && now - stick.lowT < FLICK_MS) stick.jump = true;
  }

  const css = `
  #touch { position:fixed; inset:0; z-index:5; pointer-events:none; touch-action:none; user-select:none; -webkit-user-select:none; }
  #touch[hidden] { display:none; }
  #touch .zone { position:absolute; left:0; top:0; bottom:0; width:50%; pointer-events:auto; touch-action:none; }
  #touch .base, #touch .knob { position:absolute; border-radius:50%; pointer-events:none; transform:translate(-50%,-50%); }
  #touch .base { width:128px; height:128px; background:rgba(11,10,26,.32); border:3px solid rgba(255,255,255,.55); box-shadow:0 0 0 2px rgba(11,10,26,.6); }
  #touch .knob { width:58px; height:58px; background:rgba(255,255,255,.8); border:3px solid #0b0a1a; }
  #touch .idle { opacity:.45; }
  #touch .pad { position:absolute; right:max(16px, env(safe-area-inset-right)); bottom:max(16px, env(safe-area-inset-bottom)); width:248px; height:228px; pointer-events:none; }
  #touch button { position:absolute; pointer-events:auto; touch-action:none; border-radius:50%; border:3px solid #0b0a1a; color:#fff; font:italic 900 13px "Arial Black",system-ui,sans-serif; text-transform:uppercase; letter-spacing:.5px;
    background:rgba(42,41,96,.72); box-shadow:0 3px 0 #0b0a1a; -webkit-tap-highlight-color:transparent; }
  #touch button.on { background:rgba(255,211,107,.95); color:#1a1030; transform:translateY(2px); box-shadow:0 1px 0 #0b0a1a; }
  #touch .jump { width:84px; height:84px; right:0; bottom:0; background:rgba(47,213,196,.75); color:#0b0a1a; }
  #touch .light { width:72px; height:72px; right:96px; bottom:6px; }
  #touch .heavy { width:72px; height:72px; right:8px; bottom:96px; }
  #touch .dodge { width:68px; height:68px; right:100px; bottom:96px; }
  #touch .throw { width:64px; height:64px; right:180px; bottom:150px; font-size:11px; }
  #touch .menu { width:auto; height:44px; min-width:64px; border-radius:6px; left:max(12px, env(safe-area-inset-left)); top:max(12px, env(safe-area-inset-top)); padding:0 12px; font-size:12px; }
  #touch .turn { position:absolute; left:50%; top:40%; transform:translate(-50%,-50%); padding:12px 16px; background:rgba(16,15,44,.92); border:3px solid #0b0a1a; border-radius:6px; color:#fff; font:700 16px system-ui,sans-serif; text-align:center; pointer-events:none; }
  @media (orientation:landscape) { #touch .turn { display:none; } }
  @media (max-height:420px) { #touch .pad { transform:scale(.82); transform-origin:bottom right; } }`;

  function build() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    el = document.createElement("div"); el.id = "touch"; el.hidden = true;
    el.innerHTML = `<div class="zone" aria-hidden="true"></div><div class="base idle"></div><div class="knob idle"></div>
      <div class="pad">
        <button class="jump" data-bit="J" aria-label="Jump">Jump</button>
        <button class="light" data-bit="A" aria-label="Light attack">Light</button>
        <button class="heavy" data-bit="B" aria-label="Heavy attack">Heavy</button>
        <button class="dodge" data-bit="X" aria-label="Dodge">Dodge</button>
        <button class="throw" data-bit="T" aria-label="Throw weapon">Throw</button>
      </div>
      <button class="menu" aria-label="Back to the menu">Menu</button>
      <div class="turn">Turn your phone sideways to play</div>`;
    document.body.appendChild(el);
    const zone = el.querySelector(".zone"), base = el.querySelector(".base"), knob = el.querySelector(".knob");
    const rest = () => { const x = Math.max(90, innerWidth * 0.14), y = innerHeight - Math.max(100, innerHeight * 0.24); return [x, y]; };
    const place = () => {
      const [rx, ry] = rest(), active = stick.id !== null;
      const bx = active ? stick.ox : rx, by = active ? stick.oy : ry, kx = active ? stick.x : rx, ky = active ? stick.y : ry;
      base.style.left = bx + "px"; base.style.top = by + "px"; knob.style.left = kx + "px"; knob.style.top = ky + "px";
      base.classList.toggle("idle", !active); knob.classList.toggle("idle", !active);
    };
    zone.addEventListener("pointerdown", (e) => {
      if (stick.id !== null) return;
      e.preventDefault(); zone.setPointerCapture(e.pointerId);
      stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY; stick.x = e.clientX; stick.y = e.clientY; stick.lowT = performance.now(); stick.jump = false; place();
    });
    zone.addEventListener("pointermove", (e) => {
      if (e.pointerId !== stick.id) return;
      let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy;
      const d = Math.hypot(dx, dy), R = stick.R;
      if (d > R * 1.6) { stick.ox += (dx / d) * (d - R * 1.6); stick.oy += (dy / d) * (d - R * 1.6); dx = e.clientX - stick.ox; dy = e.clientY - stick.oy; } // the base follows a thumb that runs away
      const k = Math.min(1, R / Math.max(1, Math.hypot(dx, dy)));
      stick.x = stick.ox + dx * k; stick.y = stick.oy + dy * k; tapJump(); place();
    });
    const end = (e) => { if (e.pointerId === stick.id) { stick.id = null; stick.jump = false; place(); } };
    zone.addEventListener("pointerup", end); zone.addEventListener("pointercancel", end);
    el.querySelectorAll("button[data-bit]").forEach((b) => {
      const bit = IN[b.dataset.bit];
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); b.setPointerCapture(e.pointerId); held.set(e.pointerId, bit); b.classList.add("on"); if (navigator.vibrate) navigator.vibrate(8); });
      const up = (e) => { held.delete(e.pointerId); b.classList.remove("on"); };
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("lostpointercapture", up);
    });
    el.querySelector(".menu").addEventListener("click", () => root.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape" })));
    addEventListener("resize", place); place();
    el.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // the input bits this frame: the stick in 8 directions with a dead zone, a flick up as jump, plus held buttons
  function bits() {
    let v = 0;
    for (const b of held.values()) v |= b;
    if (stick.id !== null) {
      const nx = (stick.x - stick.ox) / stick.R, ny = (stick.y - stick.oy) / stick.R;
      if (Math.hypot(nx, ny) > 0.25) {
        if (nx > 0.38) v |= IN.R; else if (nx < -0.38) v |= IN.L;
        if (ny < -0.5) v |= IN.U; else if (ny > 0.5) v |= IN.D;
      }
      if (stick.jump) v |= IN.J;
    }
    return v;
  }
  // show during a match on a touch screen (the first touch anywhere turns them on)
  function visible(on) {
    if (!el) build();
    const want = !!on && used;
    if (want === shown) return;
    shown = want; el.hidden = !want;
    if (!want) { held.clear(); stick.id = null; el.querySelectorAll("button.on").forEach((b) => b.classList.remove("on")); }
  }
  addEventListener("touchstart", () => { used = true; }, { passive: true, once: true });
  root.TouchPad = { bits, visible, active: () => shown };
})(this);
