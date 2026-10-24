# Hirba (`chameleon-slinger`)

**Hirba (حرباء)**, The Slow Trick Shot (الرامية المتمهلة). Move data: `assets/fighters/chameleon-slinger/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Hirba is a chameleon trick-shot with a slingshot, a wide flat hat and a curled tail. She is always chewing and never in a hurry, and her eyes look two ways at once. She shifts color when hit. No guns, ever: the slingshot is her only weapon, and her tongue is her rope. Lime with magenta bands (moves off magenta if Marjana stays).

## How they play

Trickster with long reach. Pebble Shot reaches 160 px and Tongue Lash 142 px, so she wins the space between the fighters and makes them come to her. Tongue Trip hits feet from far away and Tongue Snap hits far above her head. Her recovery reaches forward with the tongue, so she can come home from far out at a low angle.

**Strengths**
1. Longest reach in the cast on the ground (Pebble Shot, Tongue Lash).
2. Odd angles: a ground-level trip and a very tall, narrow anti-air.
3. A recovery that travels sideways a long way.

**Weaknesses**
1. Thin hitboxes: the far tips are narrow, and whiffs have long recovery.
2. Average weight (96) with no armor or parry: once caught close, she has only her jab and neutral air.
3. Weak up close until the real projectile gives her a safe shot.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 100 | 100 | 102 | 95 | 95 | 2 | 96 | 30 | 66 |

Damage sum 98. Side heavy K (kb + kg x 10) 1220.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Tail Flick | نفضة الذيل | 3/2/7 | 5 | 330/12 |  | Tail flick; fast close check. |
| 1 | Side light | Pebble Shot | حصاة المقلاع | 4/3/11 | 7 | 360/24 |  | Slingshot pebble, faked as a long thin hitbox (12 to 160 px). Stand-in for a real projectile. |
| 2 | Down light | Tongue Trip | عرقلة اللسان | 5/4/12 | 7 | 420/14 |  | Tongue slaps the feet far ahead; pops up. |
| 3 | Up light | Tongue Snap | فرقعة اللسان | 4/4/12 | 8 | 410/20 |  | Tongue snaps straight up, 152 px high; narrow anti-air. |
| 4 | Neutral air | Coil Spin | لفة الذيل | 3/5/9 | 9 | 370/24 | away | Curls up and spins in the air. |
| 5 | Side heavy | Tongue Lash | جلدة اللسان | 13/4/24 | 16 | 520/70 | charge | Long tongue lash, chargeable. Her kill move. |
| 6 | Recovery | Tongue Tether | حبل اللسان | 5/12/18 | 9 | 440/26 | ix 700, iy -1500 | Tongue shoots up and forward and pulls her along. Stand-in for the tether. |
| 7 | Down heavy | Color Burst | فورة الألوان | 12/5/22 | 14 | 500/56 | charge, away | Flashes all her colors; a burst on both sides; chargeable. |
| 8 | Down air | Hat Drop | سقطة القبعة | 5/4/11 | 10 | 370/28 |  | Hat-first drop; spike. |
| 9 | Ground pound | Tail Anchor | مرساة الذيل | 9/40/14 | 13 | 500/44 | iy 2100, endOnLand | Tail-first anchor drop into her down heavy. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 41 s, Hirba dies at 195% on average (75 stocks lost), Saif dies at 198% (65 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- TODO slingshot projectile. Proposed hook: on Pebble Shot frame `pebbleSpawnFrame` 4, spawn one pebble at (`pebbleSpawnX` 30, `pebbleSpawnY` -42) moving at `pebbleVx` 1400 for `pebbleLife` 40 frames, at most `pebbleMaxOnScreen` 1, dealing `pebbleDmg` 7 with the move's knockback. Then shrink the move's own hitbox to the sling (about 8 to 50 px). Shares the projectile system Dana's shell needs.
- TODO tongue tether. Proposed hook: Tongue Tether casts a tongue `tetherReach` 160 px up and forward; if it touches a ledge within `tetherFrames` 14 she is pulled to it at `tetherPullSpeed` 1600; if it touches a fighter (`tetherFoePull` 1) she is pulled to them instead. Until then the move fakes it with `iy: -1500, ix: 700` and a long diagonal hitbox.

## Canon changes requested

- Stats are inside the budget. Pebble Shot and Tongue Tether hitboxes are stand-ins that will shrink once the projectile and tether exist.
