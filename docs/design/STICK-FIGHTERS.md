# Stick fighters (prototype)

Status: prototype. Two stick fighters sit beside the painted roster: **Vespera (stick)** and **Saif (stick)**, marked "stick" on the menu chips. If they feel right, the rest of the roster moves over the same way.

## Why

Every animation problem so far came from generated video clips: soft frames, cut limbs, flagged takes and credits for every retake. A stick fighter is a skeleton posed by code (`game/stick.js`), so every pose is exact, hitboxes match the limbs, and a new move or an absurd finisher is a few lines of key poses, not a clip. The look follows stick-fight animation: thick brush strokes, a strong colour per fighter (red against green), smear frames, speed lines.

## How it works

- **Skeleton:** hip, torso, head, two-bone arms and legs, sized from the fighter's `height`. Feet are planted on the ground automatically, so crouches and lunges stay grounded.
- **Pose = f(sim state):** like the sprite renderer, the pose is a pure function of the fighter's state, so rollback, replays and the recorder need nothing extra.
- **Moves:** each move slot has a wind-up and a strike key pose (`GENERIC` in `stick.js`); a fighter's style can override any slot. The wind-up arrives early and settles, the strike snaps in over 2 frames and holds, the recovery holds a beat and eases back. Spins rotate the body (`spin`) or turn it side on (`flip`).
- **Movement:** a sprint with the weapon trailing, a front flip on every air jump, a backflip off walls, a straight dive on a fast fall, a one-knee hard landing with a dust ring, a spinning air dodge, a flailing tumble on big launches.
- **Style per fighter:** colour, prop (`parasol`, `scimitar`), accessories (`bun`, `cape`, `scarf`), move overrides, victory pose, and an optional form for a move (Vespera dissolves into bats during Bat Swarm).
- **Kin:** a stick fighter borrows its painted counterpart's move data, effects (`game/flair.js`) and sound flavour through `kin` in `FIGHTERS` (`game/main.js`), so the stick Vespera plays exactly like Vespera.
- **Rendering extras:** fading ghosts of the two poses before a strike (smear frames) and speed lines behind anything moving very fast.

## Finishers

A side heavy charged for at least `FEEL.finCharge` frames that hits a fighter at `FEEL.finDamage`% or more starts a finisher (`game/sim.js`). The game holds still for `FEEL.finFrames` (96) while the renderer plays the cinematic: the camera pushes in, letterbox bars and a darkened world, a FINISHER title with the move's name, six passes from six angles with a white streak through the victim on each, and the attacker landing behind them, back turned. Then the sim launches the victim for a KO. It is deterministic, so it works online. Vespera's is the Nightfall Waltz, Saif's the Storm of the Sash. Bots try it on a foe at the finisher's damage.

## Next

- Convert the rest of the roster (a colour, a prop, a few overrides each).
- A choreography per fighter instead of the shared six-pass finisher.
- More absurd moves per fighter: grabs and throws, wall runs, weapon throws.
