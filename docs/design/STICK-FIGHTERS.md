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

## The stick kit (movement)

Stick fighters set `kit: 1` and use `FEEL.kit` (`game/sim.js`): an instant jump that goes higher than the reference jump, a sprint that builds after `sprintAfter` frames of running, a slide (down + dodge on the ground, half height), two air dashes per airtime (a superman pose along the dash), a grace jump for `coyote` frames after running off a ledge, a super jump from a held crouch (a double front flip), a roll out of a hard landing held in a direction, and a wall run: hold toward the island's side to run up it for `wallRun` frames, then jump to kick off. A wall kick carries the fighter away for `kickLock` frames before air steering returns, so holding toward the wall still kicks clear.

## Weapons

Real steel, not icons (`WEAPONS` in `game/stick.js`): a tapered blade with a bright edge half and a shaded spine half, a fuller line, a black outline, a guard, a wrapped grip and a pommel. Vespera carries a duelling rapier (long, straight, a swept gold hilt with a cup and quillons); Saif a shamshir (a deep curve that widens toward the point, drooping quillons). A style picks one with `prop`. Every swing leaves a ribbon traced through where the outer blade actually was over the last four frames (`Stick.blade`), a white edge over a tint of the fighter's colour; the parry is a bright arc across the guard.

## Variety

The sim rolls a deterministic seed (`p.vr`, from the frame, the slot and the position) at every jump and attack, so the same inputs give the same flips and rollback agrees. The renderer reads it:

- **Jumps** (`p.jv`): a tucked front flip, a ninja leap (knee up, arms and blade swept back), an aerial with legs split, or a corkscrew. A jump that will carry onto a platform overhead is a vault: a hand reaches up for the ledge, then a tuck and a flip over onto it, feet ready.
- **Air jumps:** a front flip, a backflip layout or a scissor kick; a vault when a platform is overhead.
- **Falls and landings:** the arms-out drop, a ninja descent with the blade back, or a land-ready crouch; some landings touch a hand down.
- **Sprint:** past running speed, a ninja run with both arms and the blade swept straight back.
- **Attacks:** a jab or side light is sometimes a reverse rising slash; combo hit 2 picks among a spinning back kick, a high roundhouse and a knee with an elbow (per move, see `KICKS_ALT`); the finisher among the flying side kick, a tornado kick and a rising dragon slash (`FINISH_ALT`), plus the fighter's own finisher.

## Movement extras

A dash strike (an air dash cancels into an attack from its third frame and keeps its speed), running attacks that slide into the strike (`carryDrag`), and a head stomp: landing on a foe's head bounces you high (`bounceV`), gives the air dashes back and makes them flinch for 2 damage, once per airtime. The kit jump clears a platform in one leap.

## Throws and clashes

Throw (I or V; T and ' in local play; Y on a gamepad; the Throw button on a phone) sends the weapon flying point first, aimed up, straight, or down in the air (`throwSpeed`, `throwGrav` in `FEEL.kit`). It hits the first foe in its path (`throwDmg`, a launch along the throw), is knocked away by a swing or a parry, and sticks where it meets the island or a platform, with a glint and a ring in the owner's colour. Walk over it to take it back; it also comes back after `stuckMax` frames, or at once if it leaves the stage. Until then fists deal `unarmedDmg` percent. The blade is part of the player state, so rollback and replays need nothing extra.

Two swings whose hitboxes meet, both active or within `clashEarly` frames of it, clash: neither lands, both fighters recoil apart for `clashFrames`, the game freezes briefly, and a starburst, rings, sparks, a clang and a CLASH! callout mark it.

## Roster

| Fighter | Weapon | Moves borrowed from |
|---|---|---|
| Vespera | Rapier | The countess |
| Saif | Shamshir | The djinn warrior |
| Marjana | Twin daggers | The dagger dancer: quick and close |
| Dana | War fan (opens for every strike; thrown, it spins like a disc) | The sea siren |
| Nawaf | Spear (blue-steel shaft, leaf head, tassel) | The falconer: long reach |

## Up to four fighters

Two to four fighters, free for all, last one standing (`Sim.match([a, b, c, d])`). A swing can hit several foes at once. Locally, vs bot and watch fill the extra slots with bots; local play gives slots 3 and 4 to plugged-in gamepads. Online, the host is a hub for up to three guests and relays their input packets; the rollback session predicts and confirms each player separately (`game/net.js`).

## Touch

On phones and tablets (`game/touch.js`): a floating analog stick wherever the left thumb lands (a quick flick up jumps, held for a full jump; a slow push up stays a plain up, for up attacks, throws and the recovery), and Jump, Light, Heavy, Dodge and Throw buttons on the right (64 to 84 px, over the WCAG 2.2 2.5.8 minimum), plus a Menu button. They feed player 1 in every mode, online included.

## Combos

Lights that hit open a window (`comboWindow`). A light inside it continues the string: hit 1 is the move itself, hit 2 a kick and hit 3 the finisher. The finisher deals `finDmg`% damage and `finKb`% launch, with a short pause and a FINISH! callout. Each follow-up steps in only as far as the gap needs (capped at `comboStep`, and `comboLunge` for the finisher), so short-reach fighters keep their strings in range.

Each step changes limbs, so a string never repeats the same motion (`KICKS` and `FINISH` in `game/stick.js`; a style can override either through `kicks` or `finish`):

| Move | Hit 2 | Hit 3 (finisher) |
|---|---|---|
| Jab, side light | Spinning back kick, heel at head height | Flying side kick, the body laid out flat behind the heel |
| Down light | Spinning floor sweep | Windmill: two sweeps in one spin |
| Up light | Backflip kick | Rising flip, the blade carried up |
| Neutral air | Axe kick | Double whirl, legs out like a propeller |
| Down air | Double stomp | Corkscrew plunge |

Vespera keeps her own finishers for four of these (the Rose Lunge, the Moon Rise and a double whirl).

## Impact language

From stick-fight animation: a fighter blasted at high speed goes straight as a plank, head first along the flight, then tumbles as it slows, and skids back low when it lands. Anything moving very fast trails streak lines in its own colour. A launched fighter that hits the stage or the island's side at speed cracks it: a fan of dark cracks into the surface, grey smoke billowing sideways along it, grit, a small shake and a low thud (`slam` in `game/audio.js`).

## Finishers

A side heavy charged for at least `FEEL.finCharge` frames that hits a fighter at `FEEL.finDamage`% or more starts a finisher (`game/sim.js`). The game holds still for `FEEL.finFrames` (96) while the renderer plays the cinematic: the camera pushes in, letterbox bars and a darkened world, a FINISHER title with the move's name, six passes from six angles with a white streak through the victim on each, and the attacker landing behind them, back turned. Then the sim launches the victim for a KO. It is deterministic, so it works online. Vespera's is the Nightfall Waltz, Saif's the Storm of the Sash. Bots try it on a foe at the finisher's damage.

## Next

- Convert the rest of the roster (a colour, a prop, a few overrides each).
- A choreography per fighter instead of the shared six-pass finisher.
- More absurd moves per fighter: grabs and throws, weapon throws.
