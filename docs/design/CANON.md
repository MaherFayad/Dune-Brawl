# Dune Brawl canon

The shared source of truth for lore and fighter design. Every lore and character document must agree with this file. If a document needs to break a rule here, it says so under "Canon changes requested" instead of silently breaking it.

Writing rules for every document: plain English, no em or en dashes (use a period, comma or colon), Arabic in Modern Standard Arabic with no diacritics and noun-form labels.

## 1. World premise (fixed)

- **The Drift.** Above the Empty Quarter (الربع الخالي), the desert broke into floating islands of rock that ride a storm that never ends. People call the floating islands and the storm together the Drift.
- **Why it broke.** Long ago, seven tribes bound a great storm marid beneath the sands with an oath. The oath is weakening. Each time it cracks, more land lifts into the sky.
- **The Night of Suhail.** Every year, when the star Suhail (سهيل, Canopus) rises at the end of summer, the storm opens a calm ring around the islands. Champions fight there. The last one standing may make one claim on the storm.
- **How the storm judges (game rules in-world).**
  - Every blow leaves storm sand on you. The more sand you carry, the harder the wind pulls you when you are struck. This is damage %: more damage means more knockback.
  - A fighter thrown into the storm is carried back to the ring three times. This is the 3 stocks and the respawn drop.
  - On the fourth fall the storm keeps you. You wake in the dunes below with nothing. Nobody dies: the tone is adventure, not horror.
- **Stages.** Dune Island (dusk desert, floating rock, 1 main platform and 2 soft platforms), Hejaz Ruins (ancient stone ruins at noon, walls for clinging), Djinn Market (lantern-lit night market, wide platform, 3 soft platforms).
- **Tone.** One Thousand and One Nights adventure with a fighting-game swagger. Theatrical, warm, a little funny. Bold, never grim.

## 2. Content guardrails (GCC audience)

- Jinn, ghouls and sea spirits are drawn from folklore and One Thousand and One Nights, never from theology. No prophets, no named religious figures, no scripture, no religious symbols, no places of worship as stages, nothing that mocks belief.
- No text, script or symbols on clothing or weapons (also a readability rule).
- Modest, culturally respectful costumes for every fighter. No sexualized poses or framing.
- Cartoon violence only: no blood, no gore, no death. Knockouts are falls into the storm.
- Real tribes, real families and real countries are never villains.
- Never name Brawlhalla or any other game's characters in prompts or documents.

## 3. Starting roster (fixed seeds)

Agents may rename fighters (propose 3 names, recommend 1) and expand everything, but must keep the archetype, weapon family, dominant hue lane, motive and rival below.

| ID | Working name | Archetype | Weapon | Dominant hue lane | Motive seed | Rival |
|---|---|---|---|---|---|---|
| `djinn-warrior` | Djinn Warrior | All-rounder | Scimitar | Indigo (alt: crimson, given in the plan) | A desert swordsman bound to a djinn who lives in his sash and blade. He wants to win the claim to end the bond, but the djinn has its own plans for the claim. | Dune Ghoul |
| `dune-ghoul` | Ghoul of the Dunes | Heavy grappler | Bare claws | Bile green (alt: bone white with violet) | A ghul who once lured caravans into the deep desert. The breaking of the oath is waking things older than it, and it wants the claim to keep its desert. | Djinn Warrior |
| `falcon-rider` | Falcon Rider | Air specialist | Spear | Ivory white with gold (alt: charcoal with emerald) | A falconer from the high cliffs whose great falcon descends from the Roc. The storm took the falcon's nesting cliffs; the rider wants them brought down to earth again. | Sea Siren |
| `sea-siren` | Sea Siren of Sindbad | Zoner | Returning thrown weapon (chakram or a pearl-diver variant) | Sea teal (alt: coral with pearl) | A sea spirit from the waters Sindbad sailed, raised among pearl divers. The storm is drinking the sea into the sky; she wants it given back. | Falcon Rider |
| `dagger-dancer` | Dagger Dancer | Rushdown | Twin curved daggers | Rose magenta (alt: saffron with black) | Inspired by the clever heroine of Ali Baba and the Forty Thieves: a dancer and strategist who outwitted a band of thieves. Their surviving captain now serves the storm, and she has come to finish it. | Djinn Warrior (she suspects his djinn of serving the thieves) |

Hue lanes exist so no two fighters share a dominant hue, and no fighter uses a stage background's main hue (dusk purple and orange, noon sandstone, night amber).

## 4. Art and readability rules (from the plan)

- About 64 world px tall in game (about 9% of a 720p view). Generated at 256 px frames.
- 2 to 3 px dark outline, flat cel shading with one shadow tone, saturated colors, white highlights.
- Each palette: 1 dominant hue, 1 accent, white highlight.
- Silhouette must be recognizable as a solid black shape and different from the other 4 fighters.
- No thin parts under 4 px at game size. No smoke or wisp lower bodies: feet must read on platforms.
- Source art faces right; code mirrors it. Team color shows in a ring under the feet.
- Every attack has 1 held anticipation pose and 1 smear frame.
- Animation prompt rule: the character stays in place, side view facing right, camera fixed, full body in frame. Movement comes from code.

## 5. Animation budget per fighter

At most 18 generated AutoSprite sheets: 15 core sheets, up to 2 optional splits, and at most 1 for the fighter's hook. Done in code, not generated: air jump flip, ground dodge, air dodge, ground pound fall (holds the down air active frame), respawn drop.

Core sheets (15): idle, run, jump (one sheet split in code into rise, fall and land), hurt (hitstun, with tumble as a rotation), victory, taunt, and the 9 attack sheets (all 10 slots except ground pound, which reuses down air).

Optional splits (up to 2): give jump land its own sheet, and give tumble its own sheet separate from hitstun.

AutoSprite custom template (from the plan):

> [MOVE NAME]: [one-line description]. Snappy 2D fighting game animation: hold a clear anticipation pose, then a fast strike with one smear frame, then a quick return to the ready stance. Character stays in place, side view facing right, camera fixed, full body always in frame.

## 6. Move slots (fixed by the input map)

Every fighter has exactly these 10 moves, in this index order. Inputs: A = light, B = heavy.

| Index | Slot | Input | Ground or air |
|---|---|---|---|
| 0 | Jab (neutral light) | A | Ground |
| 1 | Side light | Side + A | Both |
| 2 | Down light | Down + A | Ground |
| 3 | Up light | Up + A | Both |
| 4 | Neutral air | A in air | Air |
| 5 | Side heavy | B, or Side + B | Ground |
| 6 | Recovery (up heavy) | Up + B, once per airtime | Both |
| 7 | Down heavy | Down + B | Ground |
| 8 | Down air | Down + A in air | Air |
| 9 | Ground pound | B in air | Air, ends on landing |

## 7. Move data format (matches the live prototype `sim.js`)

Each move is one object. All numbers are integers.

| Field | Meaning |
|---|---|
| `su`, `ac`, `re` | Startup, active and recovery frames at 60 fps |
| `box` | Hitbox `[x1, x2, y1, y2]` in world px relative to the feet, facing right. y is negative upward (the head is at about -64) |
| `dmg` | Damage % added on hit |
| `kb` | Base knockback |
| `kg` | Knockback growth. Launch strength `l = kb + floor(kg * victimDamage / 10)` |
| `ax`, `ay` | Launch direction as a vector scaled to about 100 (`ax*ax + ay*ay` close to 10000). `ay` negative launches upward, positive spikes downward |
| `ix`, `iy` | Optional: velocity impulse applied to the attacker on the first active frame, in sim units (100 = 1 px per frame). Negative `iy` is upward |
| `away` | Optional `1`: launch away from the attacker instead of along its facing |
| `air` | Optional `1`: aerial move, cancelled on landing |
| `endOnLand` | Optional `1`: ground pound style, lands into the down heavy |

Derived rules in the sim today: hitstun `6 + floor(l / 48)` frames, hit pause `3 + floor(dmg / 3)` frames. Knockback, gravity and speed values are in **prototype units**. The game feel retune (for example the planned 3.5x knockback multiplier) is a single global multiplier applied to every fighter equally, so fighter data stays relative.

## 8. Baseline fighter (today's prototype moves with the plan's retuned frame data)

This is the balance reference. Every fighter is designed as a deliberate deviation from it.

| # | Slot | su/ac/re | box | dmg | kb | kg | ax, ay | Extras |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | 3/2/7 | 8, 58, -58, -26 | 5 | 330 | 12 | 80, -60 | |
| 1 | Side light | 4/3/9 | 8, 82, -52, -20 | 8 | 380 | 26 | 86, -50 | ix 420 |
| 2 | Down light | 5/5/10 | 0, 66, -24, 0 | 7 | 430 | 16 | 28, -96 | ix 950 |
| 3 | Up light | 4/4/10 | -36, 36, -116, -56 | 7 | 410 | 18 | 14, -100 | |
| 4 | Neutral air | 3/5/9 | -48, 48, -70, -4 | 7 | 380 | 20 | 70, -70 | away, air |
| 5 | Side heavy | 12/4/20 | 10, 108, -64, -12 | 17 | 560 | 58 | 88, -48 | ix 620 |
| 6 | Recovery | 4/10/18 | -30, 40, -114, -18 | 11 | 520 | 32 | 25, -97 | iy -1700, ix 220 |
| 7 | Down heavy | 11/5/20 | -84, 84, -32, 0 | 15 | 520 | 50 | 72, -70 | away |
| 8 | Down air | 5/4/10 | -26, 26, -8, 30 | 9 | 380 | 24 | 40, 92 | air |
| 9 | Ground pound | 8/40/14 | -30, 30, -24, 22 | 13 | 520 | 40 | 30, -92 | iy 2100, air, endOnLand |

Baseline totals: damage sum 99. Side heavy kill index `K = kb + kg * 10` (launch strength at 100%) = 1140.

Baseline physics (prototype units): gravity 58, max fall 1050, fast fall 1700, run 740, air max 640, jump -1500, air jump -1400, 2 air jumps, hurtbox 36 px wide and 72 px tall (target 64).

## 9. Balance budget

- Light startup 3 to 5 frames (jab exactly 3 for everyone except the heavy, who may use 4).
- Side heavy and down heavy startup 11 to 14 frames. Only the heavy grappler may go to 16, and only with armor.
- Recovery startup 4 to 6. Ground pound startup 8 to 10.
- Damage sum of all 10 moves: 90 to 108.
- Side heavy K: 1000 to 1350. Rushdown near the low end, heavy near the high end, all-rounder within 40 of 1140.
- Per-fighter physics are percentages of the baseline: run, air speed, jump height, gravity and fall speed each 85% to 115% (one stat per fighter may reach 80% or 120% if it is the fighter's identity). Air jumps 2, or 3 for the air specialist only.
- `weight`: mass in percent, 90 to 115 (baseline 100). Knockback taken is `floor(l * 100 / weight)`, applied before hitstun is computed. Light fighters are below 100 and fly farther; the heavy is above 100 and flies less. Note: `weight` is a new sim field, see below.
- Each fighter has exactly one hook: a unique mechanic that defines it. It must be specified with integer state fields and frame counts so it stays deterministic and rollback safe.
- Any mechanic the sim does not have today (projectiles, armor, command grabs, extra jumps, stances, per-fighter physics, weight) goes in a "Sim changes required" list in the character document.

## 10. Deliverables per fighter

1. `docs/characters/<id>.md`: the character bible (structure in the agent brief).
2. `assets/fighters/<id>/moves.draft.json`: `{ "id", "stats", "hook", "moves": [10 move objects in slot order] }` using the format in section 7. Valid JSON, integers only.
