# Djinn Warrior (`djinn-warrior`)

Character bible. Binding sources: `docs/design/CANON.md` and `docs/design/development-plan.txt` (section "Character 1: Djinn Warrior"). This document keeps the plan's spec and extends it. Move data lives in `assets/fighters/djinn-warrior/moves.draft.json`.

## 1. Name options

| # | English | Arabic | Meaning and fit |
|---|---|---|---|
| 1 | **Saif** | **سيف** | "Sword". Short, sounds the same in both languages, easy to shout across a room, and names the thing he can never put down. |
| 2 | Nasim | نسيم | "Breeze". Fits the djinn wind and the Sand Stride, but reads soft for a swordsman. |
| 3 | Zafir | ظافر | "Victorious". Strong, but it promises a win the bond story does not guarantee. |

**Recommended: Saif (سيف).** He is the fighter new players learn the game on, so his name should be the easiest to read, say and remember, and it should describe him at a glance. "Saif" is one syllable in both languages, is a common given name with no religious link, and ties straight to the scimitar. The joke at the heart of his story also lands: he is named for a sword he cannot let go of.

**Title:** The Bound Blade / **النصل المقيد**

The djinn that lives in his sash and blade calls itself **Ajaj (عجاج)**, "the dust cloud". (If the world lore document names the djinn differently, the lore document wins.)

## 2. At a glance

| | |
|---|---|
| Archetype | All-rounder |
| Weapon | Scimitar (a curved sword whose edge is set from djinn sand) |
| Difficulty | 1 of 3 |
| Playstyle | Saif plays the game as it is meant to be played: poke with a slightly long blade, punish mistakes, and finish with a clean side heavy at the ledge. His Sand Stride gives him one honest trick, a burst of movement that leaves a short sand trail the opponent has to respect. |

**Strengths**
1. Baseline physics and baseline frame data: every habit learned on him carries to the rest of the roster.
2. Sword reach 2 to 4 px longer than baseline on blade moves, so his pokes win even trades at the edge of range.
3. Sand Stride: a fast, readable approach or retreat that controls the floor and gives a reliable follow-up at any percent.

**Weaknesses**
1. No standout extreme: he is out-ranged by the zoner, out-sped by the rushdown and out-muscled by the grappler.
2. His directional ground dodge is replaced by the Sand Stride, which is only invulnerable for 6 frames and locks out every dodge for 48 frames.
3. The trail does nothing against airborne opponents, so fighters who live in the air take away his ground control.

## 3. Lore

**Bio (about 270 words)**

Saif grew up guarding caravans on the edge of the Empty Quarter. He was the guard who walked at the back, so that nobody was left behind. One night a ghoul's false lanterns drew his caravan off the track. Saif went after the lost riders alone, and at the bottom of a buried well he found a brass hilt with no blade, warm as a coal. When he picked it up, sand poured out of the hilt and set itself into a curved edge, and a laughing wind wrapped around his waist and became a saffron sash.

The djinn calls itself Ajaj, the dust cloud. It led the caravan home that night, and it has not let go of Saif since. It lives in his sash and in his scimitar. It lends him speed when he asks, and sometimes when he does not. It laughs at the wrong moments. If Saif sets the sword down, the sash ties it back to his belt before he can take a step.

When the old oath beneath the sands began to crack and the islands rose into the Drift, Ajaj grew excited, and that worried Saif more than any storm. Now, on the Night of Suhail, he climbs into the calm ring to win the one claim and ask the storm to unbind them. Ajaj agrees, a little too quickly. It has a wish of its own ready, and it will not say what it is.

Saif fights the way he guarded caravans: steady, patient, never showing more than he must. Other champions measure themselves against him, and he knows a match is never won in one swing.

**His claim:** "Untie the knot between me and Ajaj, and let each of us walk his own road." Ajaj's own claim stays a mystery.

**Relationships**

| Fighter | Relationship |
|---|---|
| Dune Ghoul (rival) | Its false lanterns led his caravan astray on the night he found Ajaj, and it has never forgiven him for the travelers he brought home. |
| Falcon Rider | They once shared a fire on the high cliffs, and Saif respects a rider who lost a home to the storm and still keeps every promise. |
| Sea Siren | He has never seen the sea and she finds that hilarious; he is wary of her songs but quietly agrees the water should be given back. |
| Dagger Dancer | She suspects Ajaj of serving the thieves' captain, and Saif cannot swear she is wrong, because he does not know what Ajaj wants either. |

**Lines**

| | English | Arabic |
|---|---|---|
| Victory | "Steady wins the storm." | الثبات يغلب العاصفة. |
| Taunt | "Ajaj, stop laughing. They can hear you." | كفى ضحكا يا عجاج، فهم يسمعونك. |

## 4. Visual design

A desert warrior bound to a djinn: a fully human body and legs (feet must read clearly on platforms), with the djinn shown only in the glowing eyes, the living sash and the sand along the scimitar.

| Attribute | Spec |
|---|---|
| Proportions | About 4.5 heads tall, large hands and blade for readability, wide stance (plan). The blade is about 1.3 heads long and at least 6 px thick at game size; the sash ends are wide ribbons, at least 5 px thick at game size. |
| Silhouette hooks | Tall turban wrap with a flowing tail, curved scimitar, long sash (plan). The turban tail and the two sash ends always trail behind him, so his facing reads even in a black silhouette. |
| Main palette | Deep indigo body wear `#2B2D8F` (shadow `#1B1B5E`), saffron sash `#F2A516` (shadow `#C07A0A`), turquoise glow `#36E2D4` on eyes and blade edge only, white highlight `#FFFFFF`. |
| Alternate palette (player 2) | Crimson wear `#B5172F` (shadow `#7C0E1F`), sand-white sash `#EFE4CC` (shadow `#C9B997`), gold glow `#FFC93C`, white highlight `#FFFFFF`. |
| Skin and materials | Warm brown skin `#9C6136` (shadow `#74431F`); brass bracers and hilt `#C89B3C` (shadow `#8E6A22`); blade steel `#DCE1EA` with the glow color on the edge; outline `#1A1426` at 2 to 3 px. Clothing: long-sleeved knee-length tunic, loose trousers, soft boots, wide belt under the sash. No bare torso. |
| Sand Trail (code-drawn) | Sand grains `#E9C27B` with a 2 px outline `#1A1426` and a top rim in the palette's glow color, so the trail reads on dusk, noon sandstone and night amber stages alike. Settling sand is drawn loose and swirling; armed sand is a packed, brighter strip. |
| Personality in motion | Light on his feet, spins the blade in idle, lands in a crouch (plan). The sash sometimes tugs on its own (Ajaj), Saif glances at it, then back to the fight. Confident, fast, slightly theatrical. |
| Never | Thin wisps that vanish at game size, a smoke lower body, text or symbols on clothing (plan). Also never: a crescent or star motif on the hilt or cloth, the djinn drawn as a separate floating body, blood or cuts, a bare torso. |

**Palette discipline.** Indigo is his dominant hue lane. Saffron is the accent. The turquoise glow is kept to the eyes and blade edge (well under 5% of the sprite), so it never competes with the Sea Siren's sea teal lane. The alternate crimson is a true red and stays clear of the Dagger Dancer's rose magenta.

**Why his silhouette reads differently as a black shape.**
- He is the only fighter with a tall vertical head shape: the turban wrap adds about half a head above the skull, and its tail streams back.
- He holds the only curved crescent-shaped blade: a long arc forward of the body, unlike a straight spear line or two short daggers.
- Two wide sash ends flare back from the hips, giving him a "flag" behind the waist that no one else has.
- Under all of that is an upright, plain human body in a wide, balanced stance. The ghoul is hunched, low and clawed with no weapon. The falcon rider is defined by a long straight spear and wing shapes. The siren is defined by a round thrown disc. The dancer is small and narrow with two short blades.
At 64 px as a solid black shape: tall head, arc in front, flags behind, square stance. That reads as Saif and nobody else.

## 5. Stats

All values are percentages of the baseline (CANON section 8 and 9). He is the ruler the rest of the roster is measured against.

| Stat | Value | Reason |
|---|---|---|
| Run | 100 | His Sand Stride already gives him burst speed, so his run stays the reference. |
| Air speed | 100 | Honest drift: new players learn air control on the baseline. |
| Jump | 100 | Baseline jump height keeps soft platform timing identical to the teaching material. |
| Gravity | 100 | Neither floaty nor fast-falling, so juggles and recoveries feel "normal". |
| Fall speed | 100 | Baseline max fall and fast fall, so landing timings carry over to every other fighter. |
| Air jumps | 2 | The standard; only the air specialist gets 3. |
| Weight | 100 | Mass in percent: knockback taken is `floor(l * 100 / 100) = l`, so he flies exactly as far as the baseline and his hitstun is unchanged. Light fighters (below 100) fly farther than him, the heavy (above 100) flies less. |

## 6. Hook: Sand Stride and Sand Trail

**Names:** Sand Stride / **خطوة الرمل**; the trail it leaves is the Sand Trail / **أثر الرمل**.

### Rules

**Input.** On the ground, press Dodge while holding Left or Right. This replaces his directional ground dodge. Dodge with no horizontal direction on the ground is still the standard spot dodge (20 frames, cooldown 36). The air dodge is unchanged.

**The stride.**
- Starts from any state where a ground dodge could start (standing, walking, running). It cannot cancel an attack.
- He turns to face the stride direction (same as the dodge), so the move always reads front-on.
- 14 frames long. Frame 1 sets `vx = dir * 1300`. Frames 2 to 14 each apply `vx -= trunc(12 * vx / 100)`. Total travel is 90 px (58 px during the invulnerable frames, 74 px by the cancel frame). For comparison, the ground dodge travels 49 px in 20 frames.
- Invulnerable on frames 1 to 6 (attacks, the Sand Trail and future projectiles all ignore him). Vulnerable on frames 7 to 14.
- Cancel window: from frame 9, a buffered attack (A or B) or jump ends the stride and starts that action on the same frame through the normal idle logic. Ground attacks come out as ground attacks. Dodge cannot cancel it.
- If he is not on the ground at the start of a stride frame (he ran off an edge), the stride ends at once, he falls with his current `vx`, and no trail is laid.
- If he is hit during the stride, it ends and no trail is laid.
- Cooldown: sets `dcd = 48` (the shared dodge cooldown), so after a stride he cannot spot dodge, ground dodge or air dodge for 48 frames.

**The trail.**
- Laid when the stride ends by completing or by cancelling, only if he is still on the surface he started on (`y == sy0`). It covers the ground he crossed: `tx1 = min(sx0, x)`, `tx2 = max(sx0, x)`, `ty = y`.
- Lifetime 48 frames (`tt = 48`, counting down). Frames 1 to 12 of its life are settling sand: visible and harmless. Frames 13 to 48 (`1 <= tt <= 36`) it is armed.
- Only one trail per fighter: a new trail replaces the old one. With a 48 frame cooldown, overlap is rare anyway.
- When armed, it hits the opponent once if all of these are true: the opponent is grounded, its hurtbox overlaps the rectangle `[tx1, tx2] x [ty - 12 px, ty]`, and it is not in hitstun, not in dodge or stride invulnerability, not respawn invulnerable and not KO'd. Then the trail vanishes (`tt = 0`).
- The trip: 3 damage, `kb 330`, `kg 0`, launch `ax 26`, `ay -96`, horizontally toward Saif (the sand pulls you to its master). The launch strength is a flat 330 at every percent, so hitstun is always `6 + floor(330 / 48) = 12` frames (before the victim's weight scaling) and hit pause is `3 + floor(3 / 3) = 4` frames.
- The trail vanishes when Saif loses a stock.
- Armor (when the sim adds it) treats the trip as a normal 3 damage hit.

### Integer state fields

All fields live on the fighter object built by `u()` in the sim, so `clone()` and `hash()` pick them up automatically (both iterate `Object.keys(u(0, 1))`).

| Field | Meaning |
|---|---|
| `st = 5` (`ST.STRIDE`) | New state value for the stride. |
| `t` | Existing frame counter, 1 to 14 during the stride. |
| `sx0`, `sy0` | Position at stride start (sim units). |
| `tx1`, `tx2`, `ty` | Trail extent and surface height (sim units). |
| `tt` | Trail frames left; 0 means no trail; armed while `1 <= tt <= 36`. |
| `fid` | Fighter id index set at match start, so only this fighter gets the hook (mirror matches give both players their own trail). |
| `dcd` | Existing dodge cooldown, set to 48 by the stride. |

### Frame summary

| Item | Frames |
|---|---|
| Stride total | 14 |
| Invulnerable | 1 to 6 |
| Cancel window | 9 to 14 |
| Cooldown (all dodges) | 48 from stride start |
| Trail settle | 12 |
| Trail armed | 36 |
| Trip hitstun | 12 (flat) |
| Trip hit pause | 4 |

### Sim pseudo code

```
// idle block, dodge branch (before the standard dodge)
if (buffered(X) && dcd <= 0 && ground && dir != 0 && fid == DJINN) {
  st = STRIDE; t = 1; face = dir; vx = dir * 1300; sx0 = x; sy0 = y; dcd = 48;
}

// per fighter update, before the state branches
if (tt > 0) tt--;

// state branch
else if (st == STRIDE) {
  if (!ground) { st = IDLE; t = 0; }
  else {
    t++;
    vx -= trunc(12 * vx / 100);
    if (t > 14 || (t >= 9 && bufT > 0 && (buf & (A | B | J)))) {
      if (y == sy0) { tx1 = min(sx0, x); tx2 = max(sx0, x); ty = y; tt = 48; }
      st = IDLE; t = 0;   // the idle block runs this same frame and consumes the buffer
    }
  }
}

// hit check: skip a defender with st == STRIDE && t <= 6

// step(): after attack hits resolve, before blast zones, for e = 0 then 1
if (o.tt >= 1 && o.tt <= 36) { v = opponent; if (v.ground && v.st != HIT && ... overlap) { o.tt = 0; apply trip; } }

// blast zone KO: o.tt = 0
```

### Counterplay

- Hit him on frames 7 to 14, or wait out the stride and punish: he has no dodge for 48 frames.
- Jump over the trail, stand on a different platform, dodge through it, or wait 36 frames.
- The 12 settling frames mean a stride straight through you never trips you on the spot. Step off the loose sand.
- It never hits airborne fighters or fighters already in hitstun, so it cannot extend or loop combos.
- It hits once and vanishes.
- The trip never leads into his side heavy (12 hitstun against 12 startup), so the trail is a damage tool, not a kill tool.

### Why it is rollback safe

- Integers only: positions in sim units, `trunc` for every division, no floats, no `Math.random`, no clock reads.
- Every new value is a field on the fighter object, so saving, restoring and hashing state already cover it. Resimulating a frame reproduces the stride and trail exactly.
- All parameters come from `moves.draft.json` (later `moves.json`), which is hashed at handshake.
- Resolution order is fixed (player 0's trail, then player 1's) after attack hits, so simultaneous events always resolve the same way.
- The trail and its particles are drawn from `(tx1, tx2, ty, tt, f)` only; any particle jitter is seeded from those values in the renderer. The trip sound uses the existing hit frame field (`hf`) with the 2 frame audio dedupe.

### Future mechanics

- Chase dodge (phase 2): after landing a hit, his stride cooldown halves to 24 frames, but the travel does not grow, so the trail stays short.
- Gravity cancel and wall cling do not touch the stride, which is ground only.

## 7. Moveset

Rule for every row: blade moves keep 2 to 4 px of extra reach over baseline; everything else is baseline unless noted.

| # | Slot | Name (English) | Name (Arabic) | Animation shows | su/ac/re | dmg | kb | kg | ax/ay | box | Extras | Job |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Quick Cut | ضربة خاطفة | A short wrist flick of the scimitar at chest height, back foot planted. | 3/2/7 | 5 | 330 | 12 | 80/-60 | 8, 60, -58, -26 | | Fastest button, point-blank punish, jab into jab or side light |
| 1 | Side light | Lunge Slash | ضربة الاندفاع | A fast forward slash at chest height with a short lunge step (plan test). | 4/3/9 | 8 | 380 | 26 | 86/-50 | 8, 86, -52, -20 | ix 420 | Main poke and combo link, 50% and up |
| 2 | Down light | Dune Slide | انزلاق الكثيب | Low slide on one knee, blade held flat and low, sash streaming behind, sand spray at the front foot. | 5/5/10 | 7 | 430 | 16 | 28/-96 | 0, 68, -24, 0 | ix 950 | Pop-up and approach under pokes; juggle setup |
| 3 | Up light | Rising Arc | قوس صاعد | An overhead arc from front to back above the turban, both feet planted. | 4/4/10 | 7 | 410 | 18 | 14/-100 | -38, 38, -118, -56 | | Anti-air, juggle, links into recovery at 115% |
| 4 | Neutral air | Blade Whirl | دوامة النصل | He spins once in place with the blade held out flat, the sash wrapping the circle. | 3/5/9 | 7 | 380 | 20 | 70/-70 | -50, 50, -70, -4 | away, air | Air combo ender, out-of-jump panic button, landing cover |
| 5 | Side heavy | Sandstorm Cleave | شق العجاج | Winds the scimitar behind the head, then a huge two-handed horizontal swing that leaves a sand trail, with a big forward step (plan test). | 12/4/20 | 17 | 560 | 58 | 88/-48 | 10, 112, -64, -12 | ix 620 | Main kill move, ledge finisher |
| 6 | Recovery | Djinn Updraft | صعود الجني | Ajaj's wind lifts him in a rising corkscrew slash, blade overhead, sash spiralling under his feet (feet still visible). | 4/10/18 | 11 | 520 | 32 | 25/-97 | -30, 40, -114, -18 | iy -1700, ix 220 | Recovery, vertical finisher after Rising Arc |
| 7 | Down heavy | Twin Sweep | كسح مزدوج | Crouches and sweeps the blade in a low full circle around both feet, sand spraying both ways. | 11/5/20 | 14 | 520 | 50 | 72/-70 | -86, 86, -32, 0 | away | Two-sided roll and landing punish, second kill move |
| 8 | Down air | Scorpion Sting | لدغة العقرب | Knees tucked, he stabs the blade straight down below his feet. | 5/4/10 | 9 | 380 | 24 | 40/92 | -26, 26, -8, 30 | air | Spike for edgeguards; ground bounce on stage |
| 9 | Ground pound | Sandfall | انهيال الرمل | Reuses the Scorpion Sting active frame for the fall; lands into Twin Sweep. | 8/40/14 | 13 | 520 | 40 | 30/-92 | -30, 30, -24, 22 | iy 2100, air, endOnLand | Landing mixup, gets him down fast, resets to Twin Sweep |

### Budget check

| Rule | Budget | Saif | OK |
|---|---|---|---|
| Jab startup | exactly 3 | 3 | Yes |
| Light startups | 3 to 5 | 3, 4, 5, 4, 3, 5 | Yes |
| Side heavy and down heavy startup | 11 to 14 | 12, 11 | Yes |
| Recovery startup | 4 to 6 | 4 | Yes |
| Ground pound startup | 8 to 10 | 8 | Yes |
| Damage sum (10 moves) | 90 to 108 | **98** (5+8+7+7+7+17+11+14+9+13) | Yes |
| Side heavy K = kb + kg * 10 | 1000 to 1350, all-rounder within 40 of 1140 | **1140** (560 + 580) | Yes, exactly baseline |
| Physics | 85 to 115% | all 100 | Yes |
| Weight | 90 to 115 | 100 | Yes |
| Air jumps | 2 | 2 | Yes |
| Launch vectors | about 10000 | 9364 to 10196 | Yes (ground pound 9364 is the baseline vector) |

**Rules bent, and why.**
1. **Blade reach +2 to +4 px** on jab, side light, down light, up light, neutral air, side heavy and down heavy. The scimitar is his identity, and a small reach edge is the "honest" strength an all-rounder can win with.
2. **Down heavy damage 14 instead of 15**, the price of the reach and the hook.
3. **His directional ground dodge is replaced by the Sand Stride.** The plan's dodge rule applies to every fighter; he trades the long invulnerable roll (about 17 frames) for a 6 frame invulnerable burst with a cancel and a trail, and a longer 48 frame cooldown.
4. **The Sand Trail adds 3 damage outside the 10-move sum.** With the trip included he deals at most 101, still inside the 90 to 108 band.

## 8. Game plan

All combo windows below were checked against the live prototype sim (`sim.js` from dunebrawl.vercel.app) with this move data, using a victim that air dodges or spot dodges on its first actionable frame, so every listed route is a true combo. Hitstun is `6 + floor(l / 48)` with `l = kb + floor(kg * damage / 10)`, where damage already includes the hit that just landed. A follow-up is true when `ac + re + next su` of the first move is less than the hitstun. Percent is the victim's damage before the combo. These are prototype units at weight 100 against a weight 100 victim; the planned global knockback retune and per-fighter weight will move the windows, so re-run them after the retune. Lighter victims (weight below 100) take longer hitstun and open the windows a little earlier.

### Bread-and-butter combos

1. **Quick Cut into Lunge Slash** (13 damage). True from **40%** up to any percent within 50 px; at 70 px only 40 to 60% (the victim drifts out of reach). At 40% the jab gives `l = 330 + floor(12 * 45 / 10) = 384`, hitstun 14, and the gap is `2 + 7 + 4 = 13`. Below 40%, point-blank Quick Cut into Quick Cut is true at every percent (10 damage), but a third jab never links, so there is no jab lock.
2. **Lunge Slash into Lunge Slash** (16 damage). True from **50% to 145%** within 50 px (50 to 80% at 70 px). At 50%: `l = 380 + floor(26 * 58 / 10) = 530`, hitstun 17, gap `3 + 9 + 4 = 16`. From **105%**, finish with Lunge Slash, short hop, Blade Whirl instead (15 damage) to carry them toward the ledge.
3. **Sand Trail trip into Lunge Slash** (11 damage). True at **every percent**, from as far as 90 px, because the trip is a flat 12 frames of hitstun and Lunge Slash starts in 4. From **50%**, trip, Lunge Slash, Lunge Slash for 19 damage (within 50 px, 50 to 135%). This is his low-percent starter and the first combo the tutorial teaches. It needs him to be idle (or within the 7 frame buffer of a move ending) when the trip fires.

Note on Dune Slide: it only links into Rising Arc at **145% and up** (gap 19 against 15 to 18 frames of hitstun). Below that it is a pop-up that puts the opponent in the air in front of him, ready for a Rising Arc or Blade Whirl read.

### Kill setups

1. **Ledge Sand Trail.** When the opponent is recovering, stride along the ledge so the armed trail covers the landing spot. If they land on it, trip into Lunge Slash pushes them back off stage. If they jump over it, Rising Arc meets them. If they air dodge onto the stage, the dodge ends inside Sandstorm Cleave range: K 1140, the baseline kill move (in today's prototype units it kills a recovering opponent from the ledge at about 260%; the retune targets 110 to 140%).
2. **Rising Arc into Djinn Updraft.** True from **115%** at point blank: the arc pops them straight up and the updraft carries them to the top blast zone. Best under a soft platform or near the top of the screen. For opponents recovering low, Scorpion Sting off stage is the spike alternative.

### How to play against him

- Respect the blade: his pokes reach 2 to 4 px further than yours would at baseline, so do not stand at the very tip of your own range.
- Watch the stride. Punish frames 7 to 14, and remember he has no dodge for 48 frames after it.
- Step off settling sand. You have 12 frames, and the trail never hits you in the air.
- Bait Sandstorm Cleave (12 startup, 20 recovery) with a dodge and punish the long recovery.
- His recovery is the baseline Djinn Updraft with no extra jump. Edgeguard him like you would anyone, and stay above him.

## 9. Matchups

| Opponent | One line |
|---|---|
| Dune Ghoul (rival) | Stay outside the grab range, poke with the blade, and use the stride's 6 invulnerable frames to cross up its slow armored heavies instead of trading into them. |
| Falcon Rider | The hardest matchup: the trail is useless against an air fighter, so Saif must win with Rising Arc anti-airs and patient landing punishes with Twin Sweep. |
| Sea Siren | Stride through her thrown weapon on its invulnerable frames to close the gap, then keep her in the corner with trail and Lunge Slash before it returns. |
| Dagger Dancer | Back-stride lays sand between them so her rush has to jump, where Rising Arc waits; never stride toward her on the ground, because she punishes frames 7 to 14. |

## 10. Animation sheets

CANON section 5 (updated): 15 core sheets, up to 2 optional splits, at most 1 hook sheet, 18 at most. Saif uses **15 core + 1 split (jump land) + 1 hook = 17 sheets**. He takes the land split because "lands in a crouch" is one of his personality hooks; tumble stays a code rotation of the hurt sheet. Done in code, not generated: air jump flip, ground dodge, air dodge, ground pound fall (holds the Scorpion Sting active frame), respawn drop.

Frame counts follow the plan's rule of about 1.5 to 2 times the game frames for attacks. Loops keep the plan's counts because they cycle. Heavies stay at the plan's 32: their held anticipation and recovery poses are repeated in retiming.

Template for every custom row: "[MOVE NAME]: [one-line description]. Snappy 2D fighting game animation: hold a clear anticipation pose, then a fast strike with one smear frame, then a quick return to the ready stance. Character stays in place, side view facing right, camera fixed, full body always in frame."

| # | Sheet | Game frames | AutoSprite | frame_count | One-line description |
|---|---|---|---|---|---|
| 1 | Idle | 36 loop | preset idle | 24 | None (preset, no prompt). Retiming picks the frames where he spins the blade. |
| 2 | Run | 20 loop | preset run | 16 | None (preset, no prompt). |
| 3 | Jump (split in code into rise and fall) | 10 rise, 12 fall loop | preset jump | 16 | None (preset, no prompt). |
| 4 | Hurt (hitstun; tumble is a code rotation) | 8 loop | custom | 12 | Hurt: he flinches back with the turban tail and sash snapping forward, blade held close to the body. |
| 5 | Victory | 90 | custom | 32 | Victory: he spins the scimitar once, plants it point down beside him, and folds his arms while the sash waves on its own. |
| 6 | Taunt | 60 | custom | 24 | Taunt: he lowers the blade and frowns at his sash as it tugs and flaps by itself, then shrugs. |
| 7 | Quick Cut (jab) | 12 | custom | 24 | Quick Cut: a short wrist flick of the scimitar at chest height, back foot planted. |
| 8 | Lunge Slash (side light) | 16 | custom | 24 | Side light attack: a fast forward scimitar slash at chest height with a short lunge step. (plan) |
| 9 | Dune Slide (down light) | 20 | custom | 32 | Dune Slide: a low slide on one knee with the blade held flat near the ground and sand spraying at the front foot. |
| 10 | Rising Arc (up light) | 18 | custom | 32 | Rising Arc: an overhead scimitar arc from front to back above the turban, both feet planted. |
| 11 | Blade Whirl (neutral air) | 17 | custom | 32 | Blade Whirl: one full spin in place with the blade held out flat and the sash wrapping the circle, knees tucked. |
| 12 | Sandstorm Cleave (side heavy) | 36 | custom | 32 | Side heavy attack: wind up the scimitar behind the head, then a huge two-handed horizontal swing that leaves a sand trail, with a big forward step. (plan) |
| 13 | Djinn Updraft (recovery) | 32 | custom | 32 | Djinn Updraft: a rising corkscrew slash with the blade overhead and the sash spiralling below him, feet always visible. |
| 14 | Twin Sweep (down heavy) | 36 | custom | 32 | Twin Sweep: he crouches and sweeps the blade in a low full circle around both feet, sand spraying to both sides. |
| 15 | Scorpion Sting (down air, also ground pound) | 19 | custom | 32 | Scorpion Sting: knees tucked, he stabs the scimitar straight down below his feet with both hands. |
| 16 | Jump land (optional split) | 6 | custom | 12 | Land: he drops into a deep crouch with one hand touching the ground and the blade held back, then rises to the ready stance. |
| 17 | Sand Stride (hook) | 14 | custom | 24 | Sand Stride: a low forward burst with knees bent, blade swept back and the sash and turban tail streaming behind, then he plants his feet and rises to the ready stance. |

## 11. Higgsfield prompts

Style follows the plan. No game is named.

**Model sheet (Nano Banana Pro, 16:9, 2k, 4 to 6 drafts):**

Character model sheet for an original 2D fighting game hero: a desert warrior bound to a djinn. Human body, about 4.5 heads tall, wide confident stance, large hands, curved scimitar with a turquoise glowing edge and a thick, readable blade. Tall indigo turban wrap with a flowing tail, saffron sash with two wide ribbon ends that trail behind the hips, long-sleeved knee-length indigo tunic, loose trousers, soft boots, brass bracers and a brass hilt, warm brown skin, glowing turquoise eyes. Fully human legs and feet. Modest clothing, no bare torso. Views: front, three-quarter, side, back, plus a row of 4 expressions (neutral, attack shout, hurt, victory). Bold dark outlines, flat cel shading with one shadow tone, saturated colors, white highlights. Plain light grey background, no text, no logos, no symbols on clothing or weapon.

**Base pose (FLUX 3, 1:1, 2k, model sheet attached):**

Same character as the reference. Full body, side view facing right, fighting ready stance with the scimitar held forward at waist height, knees slightly bent, feet flat on the ground and clearly visible, turban tail and sash ends trailing behind. Whole body, turban tail and blade inside the frame. Same outlines and cel shading. Plain flat background, no ground shadow.

**Alternate palette (base pose attached):**

Same image, recolor only: crimson clothing (#B5172F) instead of indigo, sand-white sash (#EFE4CC) instead of saffron, gold glow (#FFC93C) instead of turquoise on the eyes and blade edge. Skin, brass and steel unchanged. Keep pose, outlines and shading identical.

## 12. Sim changes required

The current prototype sim uses one global move table and one global physics block, and has the states IDLE, ATK, HIT, DODGE and DEAD. Saif needs:

1. **Per-fighter move tables** loaded from hashed `moves.json`. Today there is a single `MOVES` array, which still carries the old frame data (for example jab 3/3/8 and side heavy 16/5/24); Saif's file uses the canon retuned values.
2. **Per-fighter stats block** (run, airSpeed, jump, gravity, fallSpeed, airJumps, weight). Saif's values are all baseline, but the loader must read them.
3. **Weight as mass**: `l = floor(l * 100 / weight)` before hitstun. Neutral for Saif at 100, needed for the roster.
4. **A fighter id field** (`fid`) on the fighter state, set at match start, to enable fighter-specific hooks.
5. **New state `ST.STRIDE = 5`** with the stride logic above: start from the dodge branch with a held direction on the ground, decaying velocity, invulnerability on `t <= 6`, buffered attack or jump cancel from `t >= 9`, edge and hit cancel rules, cooldown 48 via `dcd`.
6. **New fighter fields** `sx0`, `sy0`, `tx1`, `tx2`, `ty`, `tt`, added to `u()` so clone and hash cover them.
7. **A non-move hitbox (the Sand Trail)**, resolved in `step()` after attack hits and before blast zones, with its own rules (grounded victims only, never in hitstun, respects dodge, stride and respawn invulnerability), its own hit pause and effects fields (`hf`, `hx`, `hy`, `hk`), and clearing on the owner's KO.
8. **Renderer and audio**: draw the trail from its fields (settling and armed looks), a 2 frame afterimage on the stride, and the trip sound through the existing hit dedupe.
9. **Tests**: add Saif with random stride inputs to the 20,000 frame determinism test and the rollback soak.

## 13. Canon changes requested

None. The updated section 5 (15 core sheets, up to 2 splits, 1 hook sheet) and the updated weight rule (mass in percent) are applied above.

## 14. Character select strings

`en.json`
```json
{
  "fighter.djinn-warrior.name": "Saif",
  "fighter.djinn-warrior.title": "The Bound Blade",
  "fighter.djinn-warrior.tagline": "Steady blade, restless djinn."
}
```

`ar.json`
```json
{
  "fighter.djinn-warrior.name": "سيف",
  "fighter.djinn-warrior.title": "النصل المقيد",
  "fighter.djinn-warrior.tagline": "نصل ثابت وجني لا يهدأ"
}
```
