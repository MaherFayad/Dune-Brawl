# Dagger Dancer (`dagger-dancer`)

Rushdown. Twin curved daggers. Rose magenta lane (alternate: saffron with black). Rival: Djinn Warrior.

Move data lives in `assets/fighters/dagger-dancer/moves.draft.json`. Every number in this document matches that file.

## 1. Name options

| # | English | Arabic | Note |
|---|---|---|---|
| 1 | **Marjana** | **مرجانة** | The heroine's own name in the Arabic telling of Ali Baba and the Forty Thieves. |
| 2 | Rayhana | ريحانة | "Sweet basil": light, fresh, a common and warm name. |
| 3 | Nadira | نادرة | "Rare, one of a kind": fits a strategist nobody sees coming. |

**Recommendation: Marjana (مرجانة).** GCC players know the name from childhood, so the character explains herself before the first fight, and the word marjan (coral) is a rose red gem that sits exactly in her rose magenta lane. We keep the name and rewrite the person: a free woman, a celebrated dancer and the planner who beat the Forty.

**Title:** Bane of the Forty (قاهرة الأربعين).

## 2. At a glance

| | |
|---|---|
| Archetype | Rushdown |
| Weapon | Twin curved daggers (oversized crescent blades) |
| Difficulty | 3 of 3 |
| Playstyle | Marjana runs faster than anyone in the ring and wins by never letting the beat stop: short, cheap hits chained into long strings. Every new move that lands adds a beat to her Rhythm, which shortens her recovery and unlocks the Dance Step, a recovery cancel that turns a hit into a cross up, a chase or a way home. |
| Strengths | Fastest run in the cast, so she picks when the fight happens. Long strings that get faster as the Rhythm builds. Dance Step gives her mixups on stage and a second way back offstage. |
| Weaknesses | Lightest fighter (weight 90): she dies earliest. Shortest reach and lowest damage per hit, so she has to land three or four hits for what others get from one. Whiffs pay full recovery, and one clean hit on her empties the Rhythm. |

## 3. Lore

**Bio.** Marjana grew up in a busy caravan city at the edge of the sands, the daughter of musicians, and became the most sought after dancer of her generation. She was also the sharpest mind in any room. She managed the household and the trade of the woodcutter Ali Baba's family as a paid partner, and when the Forty Thieves came hunting for the man who had found their cave, it was Marjana who noticed. She saw the chalk mark on the family's door and marked every door in the street the same way. She found the band hiding in the merchant's oil jars and sealed them in. When their captain came back disguised as a guest, she danced for him with two daggers, read his tells between the beats, and exposed him in front of the whole city.

The captain fled into the desert on the night the oath first cracked. The storm took him in, and he serves it now: a raider in the Drift who steers caravans into the wind and keeps what falls. The surviving thieves gathered around him again. Marjana does not leave work half done. She has come to the Night of Suhail with the same two daggers, a dancer's footwork and a plan for every champion in the ring.

**Her claim.** That the storm give back every stolen thing the Forty ever carried into the sky, to the people it was taken from, and that it set their captain down in the dunes with nothing, the way it treats every champion who falls a fourth time.

**Relationships.**

- **Djinn Warrior (rival):** She suspects the djinn in his blade of whispering to the thieves, and she watches him the way she once watched the oil jars.
- **Dune Ghoul:** A creature that lures caravans off the road is just the oldest trick in the desert, and tricks are her trade.
- **Falcon Rider:** She trades news with the rider, whose falcon sees every caravan road from above: a useful friend and a dangerous opponent.
- **Sea Siren:** Marjana likes the siren's honesty about what she wants, but she never trusts anyone who sings to make people follow.

| | English | Arabic |
|---|---|---|
| Victory line | "Forty thieves lost count of my steps. So did you." | "أربعون لصا ضاعوا في خطواتي، وأنت مثلهم." |
| Taunt line | "Keep up. The music has barely started." | "واكبني، فاللحن لم يبدأ بعد." |

## 4. Visual design

| Attribute | Spec |
|---|---|
| Proportions | About 5 heads tall, slim and athletic but never thin (no part under 4 px at game size). Long legs for footwork, slightly oversized hands and daggers. Low, narrow stance on the balls of her feet. |
| Silhouette hooks | Wrapped head scarf with two long, thick ribbon tails ending in weighted tassels. Wide balloon sirwal trousers that gather at the ankle. Knee length tunic with a wide sash. Two oversized crescent daggers that curve outward like hooks at both hands. Chunky bell bands at both ankles. |
| Main palette | Dominant rose magenta `#D42A78` (shadow `#8C1652`) on tunic and trousers, scarf in deeper rose `#A81C5E`. Accent gold `#F4C430` (sash, ankle bells, hilts). Blade steel `#E8EEF5` with white edge `#FFFFFF`. Swing trail rose white `#FF9ED2`. Outline `#24101C`. Highlight `#FFFFFF`. |
| Alternate palette (player 2) | Dominant saffron `#F2A007` (shadow `#B86E00`) on the tunic. Black `#1E1B22` trousers and scarf with a 1 px inner rim `#4A4452` so black areas still read on night stages. Accent silver `#CFD6DE` (sash, bells, hilts). Blade edge warm white `#FFF4D6`, trail `#FFE08A`. Outline `#120E14`. |
| Skin and materials | Warm medium brown skin `#B9784F` (shadow `#8A5235`). Matte cotton tunic and trousers, silk scarf ribbons, polished metal bell bands drawn as big round beads, leather wrapped hilts, bright steel blades with one hard white highlight. Soft leather dance slippers. Costume is fully modest: long sleeves, tunic to the knee over full trousers, scarf covering hair and neck, nothing tight. |
| Personality in motion | Never flat footed: bounces on her toes in idle to a beat only she hears, twirls the front dagger, taps her heel. Lands on her toes. Smiles like she already knows your next move. |
| Never | Bare midriff or revealing or tight costume, hip shaking or dance poses meant to be looked at, camera framing on the body, text or symbols on clothing or blades, ribbons thinner than 4 px, small realistic daggers, blood. |

**Why she reads as a different black shape.** The Djinn Warrior is a tall vertical line with a tall turban and one long blade. The Dune Ghoul is a hunched, wide, heavy mass with long claws. The Falcon Rider is defined by a long spear line and the falcon's wings. The Sea Siren is built around a round returning weapon and flowing sea shapes. Marjana is the smallest and narrowest of the five on top, with a compact scarf instead of a tall headdress, then widens into balloon trousers below the knee: a teardrop body standing on two clear feet. Two crescent hooks at the hands and two ribbon tails behind the head are the only parts that leave that shape, and no one else has twin hooks.

**Keeping the daggers readable at 64 px.** Each blade is drawn oversized: about 16 px long and 6 px wide at game size (a quarter of her height), a crescent rather than a straight knife so the curve survives downscaling. Each blade has a white edge highlight against a dark outline and a gold (alternate: silver) hilt that marks which way it points. In code, every swing draws a rose white (alternate: warm gold) smear trail for 3 frames, and at a full Rhythm (4 beats) the trails thicken and turn gold so the threat is visible.

**Hue check.** Rose magenta (hue about 330) stays clear of Dune Island's dusk purple (about 270 to 290) and of every other fighter's lane. Risk: the canon saffron alternate sits near Djinn Market amber and Dune Island orange. The alternate puts black on the outer shapes (trousers, scarf, ribbons) and keeps saffron to the tunic, so the silhouette edge stays dark against warm backgrounds.

## 5. Stats

All values are integer percentages of the baseline in CANON section 8, except `airJumps` and `weight`.

| Stat | Value | Reason |
|---|---|---|
| run | 120 | Her identity stat (the one allowed 120): the fastest run in the cast so she controls when the fight starts. |
| airSpeed | 105 | Slightly better drift to follow launches and step back offstage, but the air is not her home. |
| jump | 95 | Jump height 95%: she wants to stay near the ground where her strings live. |
| gravity | 110 | Snappy, short arcs: she is back on the floor and attacking sooner. Also makes her easier to juggle. |
| fallSpeed | 110 | Fast falls to land mixups and chase down after a down air; the cost is a weaker vertical recovery. |
| airJumps | 2 | Standard. The 3rd jump belongs to the air specialist. |
| weight | 90 | The lightest legal value: the price for her speed. She takes about 111% knockback (see Canon changes requested). |

## 6. Hook: Rhythm (الإيقاع) and Dance Step (خطوة الرقصة)

One mechanic: a beat meter built from landing different moves in a row. Beats shorten her recovery on moves that connect, and she can spend beats on a Dance Step that cancels recovery.

### State fields (all integers, all in the fighter record, saved and hashed)

| Field | Range | Meaning |
|---|---|---|
| `beat` | 0 to 4 | Current beats (`maxBeat` 4) |
| `beatTimer` | 0 to 90 | Frames until the next beat is lost |
| `lastBeatMove` | -1 to 9 | Move index of the last hit that counted, -1 when empty |
| `stepT` | 0 to 8 | Frames left in the current Dance Step, 0 when not stepping |
| `stepDir` | -1 or 1 | Step direction |
| `stepCd` | 0 to 40 | Frames until the next Dance Step is allowed |
| `stepAirUsed` | 0 or 1 | 1 after an air Dance Step, cleared on landing |
| `atkHit` | 0 or 1 | The current move instance has connected (needed per move if the sim does not track it already) |

### Rules

1. **Gain.** When one of her moves connects with the opponent for the first time in that move instance, set `atkHit = 1`. Then:
   - If the move index differs from `lastBeatMove`: `beat = min(4, beat + 1)`, `lastBeatMove = index`, `beatTimer = 90`.
   - If it is the same index (a repeat): no beat, no timer refresh, and this move gets no recovery cut. Repeats keep the string alive by hitstun alone, so the hook never makes jab loops stronger.
2. **Decay.** Each frame she is not in hit pause, if `beat > 0`, `beatTimer -= 1`. When it reaches 0: `beat -= 1` and, if `beat > 0`, `beatTimer = 20` (`decayStep`). A full meter empties 150 frames after her last new hit.
3. **Reset.** When she takes any hit (entering hit pause as a victim), or loses a stock: `beat = 0`, `beatTimer = 0`, `lastBeatMove = -1`. On a trade (both fighters hit on the same frame), all hits of the frame resolve first, then the reset applies, so being hit always wins over gaining a beat. This makes the result independent of player processing order.
4. **Tempo (recovery cut).** For any move except Recovery (6) and Ground pound (9), if `atkHit = 1` and the hit was not a repeat, the move ends after `effRe = max(3, re - 2 * beat)` recovery frames instead of `re` (`cutPerBeat` 2, `reFloor` 3). It is evaluated every recovery frame from the current `beat`, so the hit that raises the beat already speeds up its own recovery. Whiffs always pay the full `re`.

   | beat | Cut | Jab re | Side light re | Side heavy re |
   |---|---|---|---|---|
   | 0 | 0 | 6 | 8 | 18 |
   | 1 | 2 | 4 | 6 | 16 |
   | 2 | 4 | 3 | 4 | 14 |
   | 3 | 6 | 3 | 3 | 12 |
   | 4 | 8 | 3 | 3 | 10 |

5. **Dance Step (recovery cancel).**
   - **Input:** the existing dodge button (buffered 7 frames like any press), with left or right held for direction. No direction held means forward (`stepDir = facing`).
   - **Window:** any recovery frame of a move except 6 and 9, with `atkHit = 1`, `beat >= 2` (`stepMinBeat`), `stepCd = 0`, and in the air `stepAirUsed = 0`.
   - **Effect:** `beat -= 2` (`stepCost`), `stepT = 8` (`stepFrames`), `stepCd = 40` (`stepCooldown`). The attack ends at once. For 8 frames her horizontal velocity is fixed at `stepDir * 1000` sim units (10 px per frame, about 80 px total, enough to pass through a 36 px hurtbox) and, in the air, vertical velocity is held at 0. She is fully hittable during the step: no invulnerability. Facing turns to `stepDir`. After frame 8 she is actionable (attack, jump, dodge, run). In the air, `stepAirUsed = 1` until she lands.
   - **Separate from dodge:** the step does not start or use the dodge cooldown, and a dodge press outside the window is an ordinary dodge.
   - `stepCd` counts down every frame outside hit pause.

### Frame summary

Beat window 90, decay step 20, step 8 frames at 1000, step cooldown 40, one air step per airtime, recovery floor 3 frames, cut 2 frames per beat.

### Pseudocode (integer only)

```
onHitLanded(f, moveIndex):
  f.atkHit = 1
  if moveIndex != f.lastBeatMove:
    f.beat = min(4, f.beat + 1); f.lastBeatMove = moveIndex; f.beatTimer = 90; f.cutOk = 1
  else:
    f.cutOk = 0

effRe(f, move):
  if move.index == 6 or move.index == 9 or f.atkHit == 0 or f.cutOk == 0: return move.re
  return max(3, move.re - 2 * f.beat)
```

(`cutOk` is one more 0 or 1 field per move instance, saved and hashed with the rest.)

### Counterplay

- Make her whiff: no hit, no beat, no cut. A whiffed Closing Thrust is 18 frames of free punish.
- Hit her once: the whole meter is gone. Trades also reset her and not you.
- Watch the bells: her ankle bells light one per beat and the HUD shows 4 pips. Below 2 lit, the Dance Step is impossible.
- The step is not invulnerable and is a straight line: hold a fast move where she will arrive, or jump it.
- Her strings rely on hitstun more than reach. Past about 50% the knockback carries you out of her short boxes, and from phase 2 directional influence widens that gap.
- She is light with a modest vertical recovery: knock her low and far and edgeguard.

### Why it is rollback safe

Every field is an integer stored in the fighter state that rollback already saves, restores and hashes. All updates happen inside the fixed sim step, in the existing order, and depend only on sim state and the input bits for that frame (the dodge bit is already in the input). Timers count sim frames, never wall time. No floats, no random numbers, no reads from the renderer. The parameters live in the hook block of moves.json, which is in the handshake hash, so both peers always run the same numbers. The trade rule (resolve all hits, then reset) removes any dependence on which player is processed first. The renderer only reads `beat` and `stepT` to draw pips, bell glow, gold trails and the step pose.

## 7. Moveset

| # | Slot | Name | Arabic | Animation shows | su/ac/re | dmg | kb | kg | ax/ay | box | Extras | Job |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Wrist Flick | نقرة المعصم | Quick backhand flick of the front dagger at chest height, rear dagger guarding the hip | 3/2/6 | 4 | 300 | 8 | 70/-71 | 6, 48, -56, -28 | | Fastest poke, string starter, first beat |
| 1 | Side light | Crossing Cut | الضربة المتقاطعة | Gliding step forward, both daggers cross in an X at chest height | 4/3/8 | 7 | 340 | 18 | 84/-54 | 8, 68, -52, -22 | ix 520 | Main approach and link; with 3 beats it confirms into Closing Thrust |
| 2 | Down light | Low Spin | الدوران المنخفض | Drops into a crouching spin, front dagger sweeps along the floor | 4/4/9 | 6 | 400 | 12 | 26/-97 | 0, 56, -22, 0 | ix 1100 | Long slide approach that pops the opponent up for juggles |
| 3 | Up light | Rising Crescent | الهلال الصاعد | Rises on her toes, both daggers sweep up overhead in a crescent arc | 4/3/9 | 7 | 380 | 16 | 12/-99 | -32, 32, -104, -50 | | Juggle link and anti air |
| 4 | Neutral air | Whirl | الدوامة | Full spin in midair with arms out, daggers circling her like a wheel | 3/5/8 | 6 | 340 | 16 | 70/-71 | -40, 40, -64, -8 | away, air | Fast air string link and landing hit, covers both sides |
| 5 | Side heavy | Closing Thrust | الطعنة الختامية | Spins once on the back foot with daggers pulled to her chest, then a long lunge thrusting both daggers forward | 11/3/18 | 15 | 500 | 52 | 87/-49 | 10, 90, -58, -20 | ix 900 | Her only real kill move; long lunge to finish a string |
| 6 | Recovery | Spiral Rise | الصعود اللولبي | Rising corkscrew spin, daggers held out, scarf ribbons wrapping around her | 5/10/16 | 11 | 460 | 26 | 30/-95 | -28, 34, -108, -16 | iy -1650, ix 360 | Return to stage, more sideways than up; never cut by Rhythm |
| 7 | Down heavy | Ring of Blades | حلقة النصال | Crouches with arms spread, both daggers sweep a full circle at ankle height, front and back | 11/4/18 | 14 | 500 | 46 | 77/-64 | -70, 70, -30, 0 | away | Two sided read on landings and rolls, low angle toward the edge |
| 8 | Down air | Twin Swoop | الانقضاض المزدوج | Tucks her knees and drives both daggers straight down under her feet | 4/3/10 | 7 | 340 | 20 | 50/87 | -22, 22, -8, 28 | air | Semi spike for offstage gimps, landing mixup on stage |
| 9 | Ground pound | Star Drop | هبوط النجم | Reuses Twin Swoop, held on the active frame as she plummets | 8/40/12 | 13 | 480 | 34 | 30/-95 | -28, 28, -24, 20 | iy 2300, air, endOnLand | Fast fall out of juggles, punishes people under her; never cut by Rhythm |

Notes: `re` is the full (whiff) recovery. On a connecting, non repeat hit the sim uses `max(3, re - 2 * beat)` (section 6). Boxes are smaller than the baseline on purpose: her reach comes from lunges (`ix`) and run speed, not from blade length.

### Budget check

| Rule | Budget | Marjana | OK |
|---|---|---|---|
| Damage sum | 90 to 108 | 4+7+6+7+6+15+11+14+7+13 = **90** | Yes, the lowest legal sum: low damage per hit |
| Side heavy K | 1000 to 1350, rushdown near the low end | 500 + 52 x 10 = **1020** | Yes |
| Jab startup | Exactly 3 | 3 | Yes |
| Light startup | 3 to 5 | 3 to 4 | Yes |
| Side and down heavy startup | 11 to 14 | 11 and 11 | Yes |
| Recovery startup | 4 to 6 | 5 | Yes |
| Ground pound startup | 8 to 10 | 8 | Yes |
| Physics | 85 to 115, one stat may reach 120 | run 120 (identity), others 95 to 110 | Yes |
| Air jumps | 2 | 2 | Yes |
| Weight | 90 to 115, light below 100 | 90 | Yes |

Compared with the baseline: lights deal 37 instead of 43 and heavies 53 instead of 56. Down heavy K is 960 and Recovery K 720, so she has no strong second kill move.

**Rules bent:** none of the numbers. Two notes: run uses the single 120% identity exception, and the Rhythm makes her effective recovery shorter than the listed `re` at runtime. Even at full Rhythm no recovery drops below 3 frames, whiffs always pay the listed value, and Recovery and Ground pound are never cut.

## 8. Game plan

All combo math uses today's sim rules: launch `l = kb + floor(kg * d / 10)`, hitstun `6 + floor(l / 48)`, victim at weight 100, a link is true when frames to the next active frame (remaining active frames + recovery after the cut + next startup) are fewer than the hitstun. The frame math holds at every percent below. The real limit is distance: as damage grows, knockback carries the victim out of her short boxes, and the ranges given are where her lunges and run still close that gap. Confirm them in the training room. If the planned 3.5x knockback multiplier is applied before hitstun is computed, the hitstun divisor must scale with it or every fighter's combos change.

### Bread and butter combos

1. **Five Count (0 to 40%), 30% damage.** Wrist Flick, Crossing Cut, Low Spin, Rising Crescent, jump Whirl. Each new move adds a beat, so recovery shrinks as the string goes. Links at 0%: jab to side light needs 9 frames against 12 hitstun, side light to down light 10 against 13, down light to up light 10 against 14, up light to jump nair 8 (plus any jump squat) against 14. Ends at 4 beats with a Dance Step ready.
2. **Rising Count (30 to 70%), 26% damage.** Low Spin slide, Rising Crescent, jump Whirl, double jump air Rising Crescent. The slide closes distance from far away. At 50%: down light to up light needs 14 against 15 (the tightest link, done at 1 beat), up light to jump nair 10 against 15, nair to air up light 11 against 15.
3. **Step Chase (50 to 100%), 24% damage.** Wrist Flick, Crossing Cut, Dance Step forward (spends 2 beats), Rising Crescent, jump Whirl. Past 50% Crossing Cut sends the victim too far for a plain link, so the step buys 80 px. At 80%: Crossing Cut to the step and up light needs 2 + 8 + 4 = 14 against 16 hitstun.

### Kill setups

1. **Full Measure confirm (105% and up, 3 or more beats).** Build 3 beats with any three different hits (the first three hits of Five Count, or Low Spin, Rising Crescent, Whirl on landing), then Crossing Cut into Closing Thrust. At 3 beats Crossing Cut recovers in 3 frames, so Closing Thrust needs 2 + 3 + 11 = 16 frames. Crossing Cut gives 17 hitstun from 105%, which makes the link true from there. Closing Thrust then launches at about l 1080 or more. Near the ledge it kills later than the other four fighters' finishers, and that is the point: she earns kills with a long string, not one read.
2. **Deep Dive gimp (60% and up, offstage).** Knock them off with Crossing Cut, chase with her 120% run and a jump, Whirl (beat 1), then Twin Swoop (beat 2) to semi spike them under the island. Twin Swoop connected, so she can spend the 2 beats on an air Dance Step back toward the stage and then Spiral Rise home. Her fast fall makes the dive quick. The step is what makes the dive safe for a light fighter with a modest recovery. Mix in Ring of Blades on stage when they try to land behind her: it covers both sides and sends them out at a low angle.

### How to play against her

- Stay at the tip of your range. Her boxes are short and her hits are weak; make her run into your reach.
- Bait and punish. Whiffed Crossing Cut and Closing Thrust pay full recovery, and Closing Thrust has 18 frames of it.
- One hit resets everything. Trade if you have to: trades always empty her meter.
- Read the bells. With 2 or more lit she can step; the step is a straight 80 px line with no invulnerability, so put a hitbox where it ends.
- Use her weight against her. She dies early and her recovery goes more sideways than up: hit her low and far.
- Do not stay in a long exchange at low percent. Jump or dodge out early in the string before the beats stack.

## 9. Matchups

- **Djinn Warrior (rival):** Even. His scimitar outreaches her daggers, so she wins by running under his swings, punishing his heavy recovery and keeping the fight too close for the blade to be full length.
- **Dune Ghoul:** Slightly favorable. She punishes its slow heavies and never stands still long enough to be caught, but she must never attack into its armor and one grab or heavy hit can take a stock from a fighter this light.
- **Falcon Rider:** Slightly unfavorable. The rider fights above her with spear reach and an extra jump; she waits for landings and uses Rising Crescent and Low Spin to keep the rider in the air on her terms.
- **Sea Siren:** Unfavorable at range, favorable up close. Her 120% run is the answer to zoning: run in behind the weapon's return path, then never let the siren reset to range.

## 10. Animation sheets

17 generated sheets plus 1 hook sheet. Generation uses the plan settings (frame_size 256, turbo for drafts, pro for keepers, is_humanoid true). Attack frame counts are about 1.5 to 2 times the game frames. Loops and long poses follow the plan's own counts because they hold frames. For non attack sheets, use the description and the template's last sentence only ("Character stays in place, side view facing right, camera fixed, full body always in frame.").

| # | Sheet | Preset | Game frames | frame_count | Custom description |
|---|---|---|---|---|---|
| 1 | Idle | idle | 36 loop | 24 | Preset, no prompt |
| 2 | Run | run | 20 loop | 16 | Preset, no prompt |
| 3 | Jump rise | jump | 10 | 16 | Preset, no prompt |
| 4 | Fall | custom | 12 loop | 16 | Fall: airborne loop with knees lightly tucked, scarf ribbons and trouser hems fluttering upward, daggers held ready at her sides. |
| 5 | Land | custom | 6 | 12 | Land: lands softly on the balls of her feet in a low crouch and springs back into the ready stance. |
| 6 | Hurt | custom | 8 loop + 12 loop | 24 | Hurt: recoils from a hit with arms thrown wide and head turned away, then curls into a tumbling spin with both daggers held tight. |
| 7 | Victory | custom | 90 | 48 | Victory: spins both daggers around her fingers, slides them into her sash in one motion, then places a hand on her heart with a confident nod. |
| 8 | Taunt | custom | 40 | 24 | Taunt: taps her heel three times to an unheard beat so the ankle bells jingle, then beckons with the front dagger. |
| 9 | Jab | custom | 3/2/6 | 16 | Wrist Flick: a quick backhand flick of the front dagger at chest height, rear dagger guarding the hip. |
| 10 | Side light | custom | 4/3/8 | 24 | Crossing Cut: a gliding step forward as both daggers slash across each other in an X at chest height. |
| 11 | Down light | custom | 4/4/9 | 32 | Low Spin: drops into a low crouching spin and sweeps the front dagger along the floor in a wide arc. |
| 12 | Up light | custom | 4/3/9 | 24 | Rising Crescent: rises onto her toes and sweeps both daggers up over her head in a crescent arc. |
| 13 | Neutral air | custom | 3/5/8 | 24 | Whirl: a full spin in midair with both arms out, daggers circling her body like a wheel. |
| 14 | Side heavy | custom | 11/3/18 | 48 | Closing Thrust: spins once on the back foot with both daggers pulled to her chest, then a long lunge thrusting both daggers forward together. |
| 15 | Recovery | custom | 5/10/16 | 48 | Spiral Rise: a rising corkscrew spin with both daggers held out and the scarf ribbons wrapping around her. |
| 16 | Down heavy | custom | 11/4/18 | 48 | Ring of Blades: crouches low with arms spread and sweeps both daggers in a full circle at ankle height, in front and behind. |
| 17 | Down air | custom | 4/3/10 | 32 | Twin Swoop: tucks her knees and drives both daggers straight down beneath her feet. |
| 18 (hook) | Dance Step | custom | 8 | 16 | Dance Step: a quick gliding sidestep on her toes, body leaning forward, daggers swept back behind her, ankle bells swinging. |

Ground pound (Star Drop) reuses sheet 17 held on its active frame. Air jump flip, ground dodge, air dodge and respawn drop are done in code per CANON. Sheet count note: CANON section 5 itemizes fewer than 17 sheets; this list reaches 17 by giving jump rise, fall and land their own sheets (cleaner loops than splitting one jump sheet). If the jump stays one sheet, drop rows 4 and 5.

## 11. Higgsfield prompts

**Model sheet (Nano Banana Pro, 16:9, 2k):**

Character model sheet for an original 2D fighting game hero: a quick witted desert dancer and strategist who fights with twin curved daggers. Human, about 5 heads tall, slim athletic build, light on the balls of her feet, slightly oversized hands and two oversized crescent daggers with bright white edges and gold hilts. Modest costume: long sleeved rose magenta tunic reaching the knee, full balloon trousers gathered at the ankle, a wrapped deep rose head scarf covering the hair and neck with two thick ribbon tails ending in tassels, wide gold sash, gold ankle bands with large round bells, soft dance slippers. Warm brown skin, sharp clever eyes, confident half smile. Views: front, three-quarter, side, back, plus a row of 4 expressions (neutral, attack shout, hurt, victory). Bold dark outlines, flat cel shading with one shadow tone, saturated colors, white highlights. Plain light grey background, no text, no logos.

**Base pose (FLUX 3, 1:1, 2k, model sheet attached):**

Same character as the reference. Full body, side view facing right, low fighting ready stance on the balls of her feet, front dagger forward at chest height, rear dagger held near the hip, both daggers fully inside the frame. Same outlines and cel shading. Plain flat background, no ground shadow.

**Alternate palette (base pose attached):**

Same image, recolor only: saffron tunic instead of rose magenta, black trousers and black head scarf instead of rose, silver sash, ankle bands and hilts instead of gold, warm white blade edges. Keep pose, outlines and shading identical.

## 12. Sim changes required

1. **Per fighter physics:** a `stats` block per fighter. `run`, `airSpeed`, `gravity` and `fallSpeed` apply as `floor(base * pct / 100)`. `jump` is a height percentage, so the jump and air jump impulses are derived so the apex is `jump`% of baseline under that fighter's gravity (integer square root at load time, or a precomputed impulse in the data). `airJumps` per fighter.
2. **Weight:** knockback taken scales by weight. Proposed rule: launch strength on the victim `l = floor(l * 100 / weight)`, applied before hitstun is computed (see Canon changes requested).
3. **Hook state in the fighter record:** `beat`, `beatTimer`, `lastBeatMove`, `stepT`, `stepDir`, `stepCd`, `stepAirUsed`, and per move instance `atkHit` and `cutOk`, all saved, restored and hashed by rollback.
4. **Per move connect flag:** `atkHit` set on the first connect of a move instance, if the sim does not already track this to stop multi hits.
5. **Variable recovery:** the attack end check uses `effRe(fighter, move)` instead of the fixed `re`.
6. **New STEP state:** cancel out of attack recovery on the dodge input inside the window, fixed horizontal velocity, vertical velocity held at 0 in the air, no invulnerability, actionable after 8 frames, its own cooldown separate from dodge.
7. **Generic hook callbacks:** `onHitLanded`, `onHitTaken`, `perFrame`, `canCancel`, called in a fixed order, with the rule that all hits of a frame resolve before any hook reset (trades). Other fighters' hooks can use the same entry points.
8. **Hook parameters in moves.json:** the `hook` block is part of the move data hash checked at handshake.
9. **Render only (no sim writes):** 4 beat pips beside her damage %, ankle bell glow per beat, gold trails at 4 beats, the STEP state mapped to the Dance Step sheet, and a short afterimage on the step.

Not needed: projectiles, armor, command grabs, extra jumps or stances.

## 13. Canon changes requested

1. **Clarify `weight` (section 9).** It is defined as "knockback taken in percent" but light fighters must be below 100, which would make light fighters take less knockback. Request: define `weight` as a mass value where knockback taken is `floor(l * 100 / weight)`, so 90 means about 111% knockback taken and 115 means about 87%. Marjana's 90 assumes this reading.
2. **Clarify the sheet count (section 5).** The itemized list adds up to 15 sheets (16 if hitstun and tumble are separate), not 17. Request: state the 17 explicitly. This document assumes jump rise, fall and land are 3 sheets.

## 14. Character select strings

`en.json`:

```json
{
  "fighter.dagger-dancer.name": "Marjana",
  "fighter.dagger-dancer.title": "Bane of the Forty",
  "fighter.dagger-dancer.tagline": "Every step is a trap."
}
```

`ar.json`:

```json
{
  "fighter.dagger-dancer.name": "مرجانة",
  "fighter.dagger-dancer.title": "قاهرة الأربعين",
  "fighter.dagger-dancer.tagline": "كل خطوة فخ."
}
```
