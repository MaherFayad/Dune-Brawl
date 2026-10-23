# Ghoul of the Dunes (`dune-ghoul`)

Heavy grappler, bare claws, bile green. This document follows `docs/design/CANON.md`. Where it stretches a rule it says so in the budget check (section 7) or under "Canon changes requested" (section 13). Move data lives in `assets/fighters/dune-ghoul/moves.draft.json`.

## 1. Name options

| # | English | Arabic | Note |
|---|---|---|---|
| 1 | **Abu Sarab** | **أبو سراب** | "Father of Mirages". A warm, uncle-style nickname for a creature whose whole trick is the false lantern on the next dune. |
| 2 | Qutrub | قطرب | A night-wandering ghoul-kin from folklore. Strong and short, but obscure to most players and harder to read as charming. |
| 3 | Ghoul of the Dunes | غول الكثبان | The working name. Clear, but generic, and "ghoul" alone leans toward horror. |

**Recommended: Abu Sarab (أبو سراب).** A kunya nickname sounds friendly and a little funny in Arabic, which is exactly the creepy-fun tone we want. It names his folklore role (the mirage that leads travelers astray) instead of his species, and it is easy to say in both languages. The species stays visible in the title.

**Title:** Ghoul of the Dunes (غول الكثبان).

## 2. At a glance

| | |
|---|---|
| Archetype | Heavy grappler |
| Weapon | Bare claws (oversized three-claw hands) |
| Difficulty | 2 of 3 (few, simple buttons, but every win comes from reads) |
| Playstyle | Abu Sarab walks you down slowly behind an armored hide of packed sand, eats your light hits and answers with a command grab that throws harder than anyone's heavy. He wins by making the opponent act first, then turning their action into a trip into the storm. |

**Strengths**
1. The biggest kill move on the roster: Lost Road (side heavy) is a command grab with K 1320, and it catches ground dodges.
2. Sand Hide armor absorbs one light hit (up to 12 damage) during his heavies, so jab pressure and light aerials lose to him.
3. Heaviest fighter (weight 115): he flies the least and lives the longest.

**Weaknesses**
1. Slowest run (80%) and low jumps: he cannot chase and has to be approached.
2. Weakest recovery (Sand Geyser rises less than the baseline) on top of heavy gravity and fall speed, so he is easy to edgeguard.
3. Widest hurtbox (44 px) and long whiff recovery on Lost Road (30 frames): he is the easiest fighter to combo and to punish.

## 3. Lore

For as long as caravans have crossed the Empty Quarter, travelers have whispered about Abu Sarab. He is a ghul of the deep dunes: a hunched, grinning shape with long arms, hooves for feet and a brass lantern that glows the green of a mirage. On moonless nights he hangs the lantern on a far dune and calls out in a voice that sounds exactly like your cousin. Follow it, and the shortcut never ends. By dawn you are walking in circles around the same dune, lighter by one bag of dates and all of your pride, while Abu Sarab laughs somewhere behind the next ridge.

He has never needed to hurt anyone. Getting lost is the whole joke, and he is very good at it.

Then the oath began to crack. When the land lifted into the Drift it took his dunes with it, and the deep desert he spent centuries learning by heart now floats in pieces inside the storm. Worse, the cracks run deeper than the marid's prison. Things older than any ghul have begun to turn over in their sleep beneath the sand, and for the first time in his long life Abu Sarab knows what his travelers feel: the ground is not where it should be.

So the ghul who leads everyone astray has come, for once, the right way: straight to the calm ring on the Night of Suhail, ready to wrestle every champion who stands between him and the storm.

**His claim:** that the storm sets his desert back down, every dune where it belongs, and leaves the deep sands to the one creature who knows every wrong turn in them.

**Relationships**
- **Djinn Warrior (rival):** Centuries ago the djinn in that sash lit a brighter lantern on the next dune and stole a whole caravan out of his trick, and Abu Sarab has not forgiven a single camel of it.
- **Falcon Rider:** A falcon's eyes see straight through a mirage, so he keeps his lantern low whenever the rider's bird circles overhead.
- **Sea Siren:** Both of them lure travelers, one with a song and one with a lantern; he calls her a colleague, and she does not.
- **Dagger Dancer:** Anyone who can outwit forty thieves can outwit a ghul, so he admires her openly and keeps one claw on his supper bag.

| | English | Arabic |
|---|---|---|
| Victory line | "Lost again? Do not worry. I know a shortcut." | "تهت مجددا؟ لا تقلق. أعرف طريقا مختصرا." |
| Taunt line | "This way, traveler! Just a little farther..." | "من هنا يا مسافر! بقي القليل فقط..." |

## 4. Visual design

| Attribute | Spec |
|---|---|
| Proportions | About 4 heads tall but the widest body on the roster: a boulder of a back and shoulders, small head set low between the shoulders, very long thick arms whose knuckles reach the knees, short bowed legs. Hands and claws are oversized for readability (each claw at least 6 px wide at game size). |
| Silhouette hooks | Hunched boulder back crusted with chunky sand plates (the Sand Hide); long donkey-like ears swept back; two big round hooves planted flat (from the folklore ghul's donkey feet); a chunky brass lantern hanging from the belt; a short, heavy traveler's shawl knotted across the shoulders. |
| Main palette | Bile green skin `#8FB82A` (shadow `#5A7A1A`); accent date brown cloth wraps and shawl `#6E3B22` (shadow `#4A2615`); bone claws, tusks and hooves `#E9DFC4` (shadow `#B8AA88`); olive khaki sand plates `#8A8452`; lime glow in the eyes and lantern `#E6F53C`; outline `#1E2410`; highlight `#FFFFFF`. |
| Alternate palette (player 2) | Bone white skin `#E8E2D0` (shadow `#B3AA96`); accent violet cloth wraps and shawl `#6B3FA0` (shadow `#45286B`); charcoal claws, tusks and hooves `#3A3440`; ash grey sand plates `#9A949E`; violet glow `#C88BFF`; outline `#1E1A24`; highlight `#FFFFFF`. |
| Skin and materials | Smooth, slightly lumpy cartoon skin (no rot, no sores, no visible bones); sand plates read as packed earth with a few chunky cracks; matte cloth wraps on the forearms and waist; brass lantern with one white glint; claws and hooves look like polished bone. |
| Face | Big round glowing eyes with tiny pupils, bushy eyebrow tufts, a wide grin with flat teeth and two short rounded tusks. The grin is the charm: he always looks like he knows a shortcut. |
| Personality in motion | Rolls his shoulders and taps his claws together in idle; runs in a heavy lope with knuckles low; lands with a deep knee bend and a thud; beckons with one curling claw before he strikes; laughs with his whole back. |
| Never | A smoke, sand or wisp lower body (both hooves always visible); blood, drool, rot, skulls or exposed bones; horror close-ups or snarling fangs; thin claws or ears under 4 px at game size; text, script or symbols on the shawl, wraps or lantern; headwear that copies real Gulf dress. |

**Why his silhouette is unique as a black shape.** Every other fighter is a vertical shape with a weapon line: the Djinn Warrior is tall and upright with a turban tail and a curved blade, the Falcon Rider is a tall figure with a long spear and a bird, the Sea Siren is slender with a round thrown weapon, and the Dagger Dancer is lithe with two short blades and flowing cloth. Abu Sarab is the only horizontal shape: wider than he is tall, his head below his shoulder line, no weapon at all, and two long arms hanging to the ground like a gorilla. In solid black he reads as "a rock with arms and ears", with two round hooves underneath, and that cannot be mistaken for anyone else even at 64 px.

**Feet.** He stands on two large round hooves, about 14 px wide at game size, always planted flat and outlined. Nothing smokes or trails below the knees, so landings and the team ring under his feet read clearly.

## 5. Stats

All values are percentages of the baseline in CANON section 8, except `airJumps`, `weight` and `hurtW`.

| Stat | Value | Prototype units | Reason |
|---|---|---|---|
| `run` | 80 | 592 | Identity stretch: the slowest run on the roster, so he must walk people down instead of chasing. |
| `airSpeed` | 88 | 563 | Heavy drift: he commits to jumps and cannot weave out of edgeguards. |
| `jump` | 88 (height) | jump -1488, air jump -1388 | Low jumps keep him a ground fighter. Velocity = baseline x isqrt(jump x gravity x 100) / 1000 = isqrt(985600) = 992, so 1500 x 992 / 1000 = 1488. |
| `gravity` | 112 | 64 (58 x 112 / 100, floored) | He drops like a stone, which sells weight and makes his armored landings fast. |
| `fallSpeed` | 110 | max 1155, fast fall 1870 | Lands fast for Ghoul Pounce and armored landings; the price is that combos on him stay grounded longer. |
| `airJumps` | 2 | 2 | Standard. Only the air specialist gets 3. |
| `weight` | 115 | knockback taken = floor(l x 100 / 115) | Weight is mass (CANON section 9): heaviest on the roster, he flies about 13% less far than the baseline. |
| `hurtW` | 44 px | 44 x 72 (64 after the retune) | Extra field: his bulk is a real target. Baseline width is 36. |

## 6. Hook: Sand Hide (درع الرمل)

Abu Sarab wears a crust of packed storm sand on his back and shoulders. While the crust is whole, his two heavies cannot be interrupted by a light hit. When it cracks, it takes 4 seconds to regrow, or he can regrow it instantly by feeding: landing his command grab.

**Inputs.** None new. The armor is automatic on Lost Road (side heavy: B, or Side + B) and Dune Quake (down heavy: Down + B). It also covers the Dune Quake that plays when Ghoul Pounce lands (`endOnLand`).

**Integer state (per fighter, saved in every snapshot and hashed):**

| Field | Range | Meaning |
|---|---|---|
| `hide` | 0 or 1 | 1 = crust whole, armor available |
| `hideCd` | 0 to 240 | Frames until the crust regrows |
| `holdT` | 0 to 24 | Lost Road hold timer (0 = not holding) |
| `heldId` | -1 or player index | Who Abu Sarab is holding |
| `heldBy` | -1 or player index | Set on the victim while held |
| `throwBack` | 0 or 1 | Back throw chosen on hold frame 12 |

**Hook parameters (`hook` in the JSON):** `hideStart 1`, `absorbHits 1`, `absorbMaxDmg 12`, `absorbDmgPct 50`, `regrowFrames 240`, `feedOnThrow 1`.

**Armor windows (per move `armor` field, frames counted from t = 1 on the first startup frame):**
- Lost Road (move 5): t 3 to 14 (all of startup after the first 2 frames).
- Dune Quake (move 7): t 3 to 15, including when it starts from a Ghoul Pounce landing.
- No armor on active or recovery frames, on lights, on Sand Geyser or on the Ghoul Pounce fall.

**Rules, applied in this order when a hit connects on Abu Sarab:**
1. If he is inside an armor window and `hide` = 1 and the hit's `dmg` is 12 or less, the armor **absorbs** it: he takes `floor(dmg x 50 / 100)` damage (he swallows half the sand), gets no knockback and no hitstun, and his move keeps running. Hit pause still applies to both fighters as normal (`3 + floor(dmg / 3)`), so the impact reads. Then `hide` = 0 and `hideCd` = 240.
2. If he is inside an armor window and `hide` = 1 and the hit's `dmg` is 13 or more, the armor **breaks**: the hit applies in full as a normal hit, and `hide` = 0, `hideCd` = 240.
3. Otherwise (no window, or `hide` = 0) the hit applies normally and the hook state does not change.
4. Only one hit per frame can be absorbed. Since `hide` drops to 0, a second hit on a later frame of the same move lands normally.

**Regrow and feed.**
- Every sim frame, if `hideCd` > 0 it decreases by 1; on the frame it reaches 0, `hide` = 1.
- **Feed:** when a Lost Road throw releases, `hide` = 1 and `hideCd` = 0 immediately.
- On respawn, `hide` = 1 and `hideCd` = 0.

**Lost Road command grab (move 5, the hook's feeding move):**
- Grab box `[8, 64, -62, -4]` checks the opponent's hurtbox on active frames t 15 to 19 instead of dealing a hit. `ix 300` gives a short lurch on t 15.
- It catches grounded or airborne opponents who are not invulnerable, with one exception: `dodgeCatch 1` means it **ignores ground dodge invulnerability**. Air dodge invulnerability still beats it.
- On catch: the victim's move and hitstun end, `heldBy` is set, and the victim's feet are locked at Abu Sarab's feet + (facing x 36, 0) every frame (`ox 36`, `oy 0`). The victim ignores inputs, ignores gravity and plays its hitstun animation. Abu Sarab plays the hold sheet.
- Hold lasts 24 frames (`hold 24`). On hold frame 12 (`dirRead 12`) the sim reads his stick: holding back sets `throwBack` = 1. On hold frame 13, if `throwBack` = 1, he flips facing and the victim's lock point moves to his new front (the sheet shows him swinging the traveler overhead).
- On hold frame 24 the throw releases: the victim takes `dmg 15` and is launched with `kb 600`, `kg 72` along `ax 82, ay -57` in his current facing, using the same damage and hitstun order as a normal hit. Then Abu Sarab has `throwRe 16` recovery frames. Hide is fed.
- On whiff, recovery is the move's `re 30`.
- **Clash:** if two Lost Roads catch each other on the same frame (mirror match), nobody is held; both fighters enter 12 frames of recovery (`clashRe 12`) and are pushed apart.
- **Grab and strike on the same frame:** strikes resolve first. If the strike on Abu Sarab is absorbed, his grab still checks and can catch the attacker. If it is not absorbed, he is hit and the grab is cancelled.

**Frame summary.** Lost Road: 14 startup (armored 3 to 14), 5 active, 30 whiff recovery; on catch 24 hold + 16 recovery. Dune Quake: 15 startup (armored 3 to 15), 5 active, 24 recovery. Regrow: 240 frames (4 seconds).

**Counterplay.**
- Hit him with a heavy (13 damage or more) during startup: it breaks the crust and lands as a full hit.
- Hit him twice: the first light hit eats the armor, the second lands normally. Multi-hit moves and returning projectiles do this naturally.
- Watch the crust. When it is cracked (code shows dull, broken plates and the HUD plate icon empties), he has 4 seconds with no armor unless he lands a grab.
- Jump or air dodge, never ground dodge, when you expect Lost Road. Then punish the 30-frame whiff.
- Stay outside 64 px. His run is the slowest in the game, so spacing is cheap.

**Why it is rollback safe.** Every piece of hook state is a small integer on the fighter struct, included in snapshots and in the per-frame state hash. Armor depends only on move index, the move timer `t`, `hide` and the integer `dmg` of the incoming hit. The throw direction is read from the same replayed input stream on a fixed hold frame. Regrow is a frame counter, not a clock. There is no randomness, and the resolution order (strikes, then armor, then grabs, then the clash rule) does not depend on player index, so both peers and every re-simulation reach the same result. All parameters live in the hashed move JSON.

## 7. Moveset

Box is `[x1, x2, y1, y2]` relative to the feet, facing right. Extras use the CANON field names plus the documented `armor` and `grab` fields.

| # | Slot | Name | Arabic | Animation shows | su/ac/re | dmg | kb | kg | ax, ay | Box | Extras | Job |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Beckoning Claw | مخلب النداء | One claw curls in a "come here" beckon, then snaps forward in a backhand swipe at chest height | 4/3/8 | 6 | 340 | 12 | 80, -60 | 8, 60, -60, -28 | | Fastest button; checks close approaches and keeps people at grab distance |
| 1 | Side light | Caravan Shove | دفعة القافلة | Both palms pulled back to the hip, then a big two-palm shove with a short heavy step | 5/3/11 | 9 | 400 | 26 | 88, -47 | 10, 80, -58, -18 | ix 300 | Long poke and whiff punish; pushes opponents toward the ledge for Lost Road |
| 2 | Down light | Sand Scoop | مجرفة الرمل | Crouches low, digs one claw into the sand and scoops upward like a shovel | 5/4/9 | 8 | 460 | 16 | 18, -98 | 4, 72, -24, 0 | ix 450 | Combo starter: pops the opponent straight up for Thunder Clap |
| 3 | Up light | Thunder Clap | تصفيقة الرعد | Both arms swing up and clap the claws together above his head | 4/4/11 | 8 | 420 | 20 | 12, -99 | -40, 40, -124, -56 | | Anti-air and juggle; covers both sides above him |
| 4 | Neutral air | Tumbleweed | كرة الشوك | Curls into a spinning ball with arms and claws flung out | 4/6/11 | 8 | 390 | 20 | 70, -70 | -50, 50, -70, -4 | away, air | Air space control; long active frames beat jumps in |
| 5 | Side heavy | Lost Road | درب التيه | Hunches with arms wide (armored wind-up), lurches forward and snatches with both claws; misses into a stumble | 14/5/30 | 15 | 600 | 72 | 82, -57 | 8, 64, -62, -4 (grab box) | armor t 3 to 14; grab: hold 24, ox 36, oy 0, dirRead 12, backThrow 1, throwRe 16, dodgeCatch 1, clashRe 12; ix 300 | Command grab and main kill move; feeds Sand Hide; beats ground dodge and light pressure |
| 6 | Recovery | Sand Geyser | نافورة الرمل | Crouches, then springs straight up with both claws overhead as a burst of sand erupts under his hooves | 6/10/22 | 11 | 500 | 30 | 25, -97 | -32, 42, -118, -16 | iy -1550, ix 180 | Gets him home, barely; hits ledge guarders above him |
| 7 | Down heavy | Dune Quake | زلزلة الكثبان | Raises both fists over his head (armored hold), then slams the ground; sand bursts out on both sides | 15/5/24 | 16 | 560 | 54 | 66, -75 | -92, 92, -34, 0 | armor t 3 to 15; away | Armored two-sided kill move; beats landings and ledge getups |
| 8 | Down air | Hoof Stomp | وطأة الحافر | Tucks his knees, then stomps straight down with both hooves | 5/4/13 | 10 | 400 | 26 | 30, 95 | -26, 26, -6, 32 | air | Spike offstage; on a grounded opponent it starts his combos |
| 9 | Ground pound | Ghoul Pounce | انقضاض الغول | Reuses Hoof Stomp: holds the stomp pose and drops like a boulder, landing into Dune Quake | 10/40/16 | 14 | 560 | 42 | 35, -94 | -34, 34, -24, 24 | iy 2300, air, endOnLand | Fast, scary way down; the landing is an armored Dune Quake |

**Budget check**

| Check | Budget | Abu Sarab | Status |
|---|---|---|---|
| Jab startup | 3 (heavy may use 4) | 4 | Heavy exception used |
| Other light startup | 3 to 5 | 5, 5, 4, 4, 5 | Within |
| Side heavy, down heavy startup | 11 to 14 (heavy to 16 with armor) | 14, 15 | 15 uses the heavy exception, armored |
| Recovery startup | 4 to 6 | 6 | Within |
| Ground pound startup | 8 to 10 | 10 | Within |
| Damage sum | 90 to 108 | 6+9+8+8+8+15+11+16+10+14 = **105** | Within, near the top as a heavy should be |
| Side heavy K | 1000 to 1350, heavy near the high end | 600 + 72 x 10 = **1320** | Within |
| Physics | 85 to 115, one stat to 80 or 120 | run 80, others 88 to 112 | Run is the one identity stretch |
| Weight | 90 to 115, heavy above 100 | 115 | Within (top) |
| Air jumps | 2 | 2 | Within |

Other kill indexes for reference: Dune Quake K 1100, Ghoul Pounce K 980, Sand Geyser K 800.

**Rules bent, and why**
- **Run at 80%.** This is the single allowed identity stretch. Slowness is the plan's hook for him and the main price of his power.
- **Down heavy startup 15.** Allowed only for the heavy grappler with armor, and Dune Quake is armored for t 3 to 15.
- **Side heavy is a command grab, not a strike.** Its K is measured on the throw launch (the same formula). This is the grappler identity. Its whiff recovery (30) is the longest in the kit to pay for the dodge catch.
- **Armor absorbs half the damage** instead of all or none. This is part of the hook (he swallows the sand), and it is a single integer rule.

## 8. Game plan

**Combo math used here.** Hitstun `H = 6 + floor(l / 48)` with `l = kb + floor(kg x d / 10)`, where `d` is the victim's damage before the hit, victim weight 100. Frame 0 is the hit frame. Abu Sarab is actionable on frame `r`, which is `ac + re` for a grounded move hit on its first active frame, or about 2 for an aerial that hits just before he lands (landing cancels it). A follow-up connects if `r + su <= H` and the spacing holds. If the sim later adds landing lag, add it to `r`. Upper limits depend on launch distance and are marked for playtest.

**Bread-and-butter combos**

| Name | Inputs | Damage | Works from | Math |
|---|---|---|---|---|
| Stomp Scoop | Low falling Hoof Stomp on a grounded opponent, land, Sand Scoop | 18 | 0% to about 60% (playtest) | Stomp at 0%: l 400, H 14; r 2 + su 5 = 7, fits easily |
| Stomp Road | Low falling Hoof Stomp, land, Lost Road | 25, and the hide is fed | 31% to about 80% (playtest) | Needs H >= 2 + 14 = 16, so l >= 480: 400 + floor(2.6 x d) >= 480 at d >= 31 |
| Scoop Clap | Sand Scoop, Thunder Clap | 16 | 43% to about 100% (playtest) | r = 4 + 9 = 13, + su 4 = 17, so l >= 528: 460 + floor(1.6 x d) >= 528 at d >= 43 |

Stomp Scoop at low damage leads naturally into Scoop Clap once the opponent passes 43%, so the full low-to-mid route is Stomp, Scoop, Clap for 26.

**Kill setups**
1. **Ledge Lost Road.** Walk the opponent to the ledge with Caravan Shove and Beckoning Claw, then grab when they jab or ground dodge. Throw forward if they are between him and the ledge, or hold back on hold frame 12 if he is facing inward. Launch strength is 600 + 7.2 x d: it matches the baseline side heavy at about 30% less damage. If the baseline side heavy kills at 110% to 140% from the ledge (the plan's target), Lost Road kills at about 84% to 108%.
2. **Armored landing trap.** When the opponent lands near him or gets up at the ledge, start Dune Quake. Their landing aerial or wake-up light gets absorbed by Sand Hide, and the slam hits both sides. Ghoul Pounce does the same from above, since it lands into an armored Dune Quake. Launch strength is 560 + 5.4 x d, which kills at about 119% to 151% on the same scale. If they respect it and wait, the 24-frame recovery is the risk.

**How to play against him**
- Do not jab him during a heavy wind-up. Use your own heavy (13+ damage) to break the crust, or hit him twice.
- Never ground dodge next to him. Lost Road catches ground dodges. Jump or air dodge instead, then punish the 30-frame whiff.
- Read the crust: when the plates are cracked (and the HUD plate icon is empty) you have 4 seconds of free pressure, unless he grabs you.
- Spacing is cheap. Fight from just outside 64 px; he runs at 80% and cannot catch a retreating opponent.
- Take him offstage. Low jumps, slow drift, heavy gravity and a short Sand Geyser make him the easiest fighter to edgeguard. His weight keeps him alive long, so the edge is where you take stocks.
- Combo him. His wide hurtbox and fast fall keep him in your strings longer than anyone else.

## 9. Matchups

- **Djinn Warrior (rival), even:** the sand dash lets the Djinn Warrior slip past Lost Road and pressure his slow recovery, but every dash that ends inside 64 px is a grab, and the trail shows where it will end.
- **Falcon Rider, slightly unfavored:** the rider lives in the air where Lost Road only catches landings and his low jumps cannot chase; he wins by armoring through landing aerials with Dune Quake and Ghoul Pounce.
- **Sea Siren, unfavored:** a returning weapon can hit twice, so it strips the crust on the way out and lands on the way back; he must walk through the zone and win one read at the ledge.
- **Dagger Dancer, slightly favored:** Sand Hide eats her light strings and one Lost Road takes a light fighter at low damage, but her speed punishes every whiff he makes.

## 10. Animation sheets

18 sheets, the CANON maximum: 15 core sheets (rows 1 to 3, 5, 7 to 17), the 2 optional splits (row 4 land, row 6 tumble) and 1 hook sheet (row 18). AutoSprite settings per the plan: frame_size 256, is_humanoid true, video_tier turbo for drafts and pro for keepers, remove_bg default (ultra if halos), with_sound off. Every custom line is dropped into the plan's template:

> [MOVE NAME]: [one-line description]. Snappy 2D fighting game animation: hold a clear anticipation pose, then a fast strike with one smear frame, then a quick return to the ready stance. Character stays in place, side view facing right, camera fixed, full body always in frame.

For non-attack sheets (idle, run, jump, land, hurt, tumble, victory, taunt) the attack sentence is replaced by "Smooth 2D fighting game animation" and the rest of the template is kept.

| # | Sheet | Game frames | Preset or custom | frame_count | One-line custom description |
|---|---|---|---|---|---|
| 1 | Idle | 36 loop | Preset idle | 24 | Preset, no prompt (plan value). Fallback if too light: "Hunched ready stance, shoulders rolling, claws tapping together, lantern swaying gently." |
| 2 | Run | 20 loop | Preset run | 16 | Preset, no prompt (plan value). Fallback: "A slow heavy lope, hunched forward, long arms swinging low, big hooves landing flat." |
| 3 | Jump (rise and fall) | 10 rise, 12 fall loop | Preset jump | 16 | Preset, no prompt; split into rise and fall in the editor. |
| 4 | Land (optional split) | 8 | Custom | 16 | Heavy landing: knees bend deep, knuckles touch the ground, ears flop, then he pushes back up into his stance. |
| 5 | Hurt (hitstun) | 8 loop | Custom | 16 | Flinch: ears pinned back, eyes squeezed shut, arms raised to cover his face, body rocking back. |
| 6 | Tumble (optional split) | 12 loop | Custom | 24 | Launched tumble: curled up and spinning backward, hooves over head, arms flailing, ears flapping. |
| 7 | Victory | 90 | Custom | 32 | Sits on a mound of sand, opens a stolen bag of dates, raises his glowing lantern and laughs with his whole back. |
| 8 | Taunt (Lantern Lure) | 48 | Custom | 32 | Holds his lantern up high, beckons with one curling claw and gives a wide toothy wink. |
| 9 | Jab: Beckoning Claw | 4/3/8 | Custom | 24 | One claw curls in a beckoning gesture, then snaps forward in a quick backhand swipe at chest height. |
| 10 | Side light: Caravan Shove | 5/3/11 | Custom | 32 | Pulls both palms back to his hip, then a big two-palm shove forward with one short heavy step. |
| 11 | Down light: Sand Scoop | 5/4/9 | Custom | 32 | Crouches low, digs one claw into the sand in front of him and scoops it sharply upward like a shovel. |
| 12 | Up light: Thunder Clap | 4/4/11 | Custom | 32 | Swings both long arms up in an arc and claps his claws together high above his head. |
| 13 | Neutral air: Tumbleweed | 4/6/11 | Custom | 32 | Curls into a ball and spins once in place with both arms and claws flung out wide. |
| 14 | Side heavy: Lost Road | 14/5/30 | Custom | 64 | Hunches with arms spread wide, then lurches forward and snatches with both claws, then stumbles forward off balance on a miss. |
| 15 | Recovery: Sand Geyser | 6/10/22 | Custom | 64 | Crouches, then springs upward with both claws stretched overhead while a burst of sand erupts beneath his hooves. |
| 16 | Down heavy: Dune Quake | 15/5/24 | Custom | 64 | Raises both fists high over his head, holds, then slams them into the ground so sand bursts out to both sides. |
| 17 | Down air: Hoof Stomp (also Ghoul Pounce) | 5/4/13 | Custom | 40 | In midair he tucks his knees, then stomps straight down with both hooves together. |
| 18 | Hook: Lost Road hold and throw | 24 hold + 16 | Custom | 64 | Holds a struggling traveler-shaped sack of sand at arm's length, swings it up over his head and hurls it forward. |

Notes. Ratios are 1.5x to 2x except Lost Road (49 game frames, 64 generated, 1.3x), where most of the 30-frame whiff recovery is one held stumble pose and extra frames would be identical. The hook sheet uses a sand sack as the held object so the sheet stays one character; in game the real opponent is locked to the claw point and plays its own hitstun sheet. Ghoul Pounce holds Hoof Stomp's active frame in code. Air jump flip, dodges, the Ghoul Pounce fall and the respawn drop are done in code per CANON section 5. Armor absorb and crust crack are procedural effects (white flash, sand burst from the shoulders, dull cracked tint on the plates), not sheets.

## 11. Higgsfield prompts

**Model sheet (Nano Banana Pro, 16:9, 2k):**

Character model sheet for an original 2D fighting game heavyweight: a friendly but menacing desert ghoul from Arabian folklore. Huge hunched body about 4 heads tall and wider than it is tall, boulder-like back and shoulders crusted with chunky olive khaki plates of packed sand, small head set low between the shoulders, long donkey-like ears swept back, big round glowing lime eyes with tiny pupils, bushy eyebrow tufts, a wide sly grin with flat teeth and two short rounded tusks. Very long thick arms with oversized three-clawed hands reaching the knees, short bowed legs ending in two big round bone-colored hooves planted flat. Bile green skin, date brown cloth wraps on the forearms and waist, a short heavy traveler's shawl knotted across the shoulders, a chunky brass lantern with a lime glow hanging from the belt. Creepy-fun and charming, cartoon proportions, no blood, no bones, no rot. Views: front, three-quarter, side, back, plus a row of 4 expressions (sly grin, attack roar, hurt, victory laugh). Bold dark outlines, flat cel shading with one shadow tone, saturated colors, white highlights. Plain light grey background, no text, no logos.

**Base pose (FLUX 3, 1:1, 2k, model sheet attached):**

Same character as the reference. Full body, side view facing right, hunched grappler ready stance, both hooves flat on the ground, long arms hanging forward with claws open near knee height, lantern on the belt visible, whole body inside the frame. Same outlines and cel shading. Plain flat background, no ground shadow.

**Alternate palette (base pose attached):**

Same image, recolor only: bone white skin instead of bile green, violet cloth wraps and shawl instead of date brown, charcoal claws, tusks and hooves instead of bone, ash grey sand plates instead of olive khaki, violet glow in the eyes and lantern instead of lime. Keep pose, outlines and shading identical.

## 12. Sim changes required

1. **Per-fighter physics** from `stats`: run, airSpeed, gravity and fallSpeed as integer percentages of the baseline (floored). `jump` is a height percentage; convert once at load with integer math: jump velocity = baseline x isqrt(jump x gravity x 100) / 1000 (1488 and 1388 for Abu Sarab). Values go into the move data hash.
2. **Weight** (mass, per CANON section 9). Knockback taken is `floor(l x 100 / weight)`. Proposal for the open detail: hitstun keeps using the unscaled `l`, so heavies fly less far but are not harder to combo.
3. **Per-fighter hurtbox width** (`hurtW` 44 px).
4. **Armor (Sand Hide).** Per-move `armor` window `{from, to}` checked against the move timer `t`; fighter state `hide` and `hideCd`; absorb rule (dmg 12 or less: half damage, no knockback, no hitstun, move continues, hit pause still applies); break rule (dmg 13 or more: normal hit); 240-frame regrow; feed on throw; reset on respawn. The armor window must also apply to a down heavy entered through `endOnLand`.
5. **Command grab.** A move with a `grab` field whose box tests the opponent's hurtbox instead of hitting; held state on both fighters (`holdT`, `heldId`, `heldBy`, `throwBack`); victim locked to the attacker's feet + (facing x `ox`, `oy`), no gravity, no inputs, hitstun animation; direction read on hold frame `dirRead` with a facing flip on the next frame for a back throw; release on hold frame `hold` applying the move's dmg, kb, kg, ax and ay as a normal hit; separate `throwRe` recovery after a catch and `re` after a whiff; `dodgeCatch` ignores ground dodge invulnerability only; `clashRe` rule for simultaneous grabs; strikes resolve before grabs on the same frame.
6. **Snapshot and hash.** All new fields (`hide`, `hideCd`, `holdT`, `heldId`, `heldBy`, `throwBack`) saved, restored and hashed every frame.
7. **Renderer and animation mapping.** New states HOLD (attacker, hook sheet) and HELD (victim, hitstun sheet); the optional land and tumble split sheets; procedural armor effects (white flash and sand burst on absorb, cracked plate tint while `hide` = 0, a 2 px sand outline while armor is live).
8. **HUD.** A sand plate icon beside his damage % that shows full or cracked (a shape, not only a color, for accessibility).

## 13. Canon changes requested

1. **Hook sheet for the throw (clarification).** Sand Hide is fed by Lost Road, so this document counts the Lost Road hold and throw as the 1 hook sheet. If the canon prefers that sheet to show the armor itself, the throw can reuse Lost Road's catch pose and Caravan Shove's strike frames instead, and the armor stays fully procedural.
2. **Weight and hitstun (open detail).** CANON now defines weight as mass (`floor(l x 100 / weight)`), which this document uses. It does not say whether hitstun uses the scaled or unscaled `l`. This document proposes unscaled, so all five fighters' combo math stays comparable; please confirm in CANON.

## 14. Character select strings

`en.json`:

```json
{
  "fighter.dune-ghoul.name": "Abu Sarab",
  "fighter.dune-ghoul.title": "Ghoul of the Dunes",
  "fighter.dune-ghoul.tagline": "Follow his lantern. Never take his shortcut."
}
```

`ar.json`:

```json
{
  "fighter.dune-ghoul.name": "أبو سراب",
  "fighter.dune-ghoul.title": "غول الكثبان",
  "fighter.dune-ghoul.tagline": "اتبع فانوسه، ولا تسلك طريقه المختصر."
}
```
