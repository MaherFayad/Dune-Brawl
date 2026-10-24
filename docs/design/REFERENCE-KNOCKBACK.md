# Reference knockback: when a hit sends far

Source: the reference tournament video (1v1 platform fighter, 4 games, 14 min 40 s). The footage is copyrighted; no frames, crops or clips are kept in the repo, only the numbers below.

Units: **bodies** (fighter standing height in that frame) and **frames at 60 fps**. Damage is read from the HUD ring and turned into a continuous number by interpolating the ring colour between the tier anchors (white 0, yellow 50, orange 100, red 150, dark red 200). So "134" means "between orange and red, closer to orange"; treat it as plus or minus 15.

## Summary rules

1. **Small hits stay short at every damage.** Jabs, pokes and the hits inside a string move the victim under 1 body, even at red or dark red. At 60 fps a small hit on a red-ring victim moves it 0 to 8 px per frame (under 0.1 body per frame) for the 10 to 11 frames it is stunned.
2. **Only committed hits launch, and only once damage is high.** A big swing, a signature special or a string ender sends about 2 to 3 bodies below yellow, about 4 to 5 around orange (80 to 120), and 6 to 12 bodies at red (150+), measured 0.5 s after the hit.
3. **The jump between "short" and "far" happens around 100 to 130.** Below 80 nothing in the sample travelled more than 5 bodies (one KO at 80 came from a victim already at the top corner); above 130 almost every committed hit travelled 5 or more.
4. **Launches are front-loaded.** The victim leaves on the first frame after contact at about 0.3 to 0.5 bodies per frame, covers about 3 bodies in the first 10 frames, then decelerates: roughly 65% of the 0.5 s distance is covered by 0.25 s, and the 1 s distance is only about 1.3 times the 0.5 s distance.
5. **The kill confirm is "hold, then hit".** One or more small hits keep the victim in place, then about 18 frames later a launcher sends it. 15 of the 17 red-flash launches tracked at 60 fps follow this pattern.
6. **Position decides the KO as much as damage.** Side KOs happen when the victim is hit 3 to 7 bodies past the ledge or already near a blast line (KO 0.3 to 1.1 s later). The same launcher from centre stage at red is survived (10 to 13 bodies and back). Up launches KO from the ground at 180+, spikes KO at 135+ only when the victim is below ledge height, and one KO happened at 80 because the victim was already at the top corner.
7. **About 25 hits per stock.** A stock lasts about 77 s, takes a median of 25 landed hits (14 to 32), and ends at a median of about 160 damage (mean 167, one outlier at 86).
8. **The game tells you a launch happened.** On every hit the victim flashes in its damage colour (white, yellow, orange, red) for about 10 frames. Launches add a white smoke trail behind the victim, the camera pans or zooms out to follow, and an off-screen bubble appears if it leaves the frame. No screen shake was noticed.

## How this was measured

- **Hit times and damage** come from the HUD ring. The ring colour was sampled along the arc on every frame (52,735 frames), converted to the damage scale above, and every step up of 1.5 or more marks a landed hit (519 hits over the video). Ring resets mark the 20 KOs.
- **Hits** were picked across all four games: the KO hits, every run of red flash on the victim (an automatic scan of the whole video for saturated red pixels), and small and mid hits at every damage tier. Each hit got a 6-frame sheet (0.3 s before, contact, +0.12, +0.25, +0.5, +1.0 s) with a grid, and distances were read against stage corners or platforms, divided by the standing height of a fighter in the same frame (about 35 to 40 px on the half-size sheet).
- **Launch speed and freeze** were measured at 60 fps on 17 red-flash launches by tracking the centroid of the red silhouette frame by frame, and on 4 small hits with 60 fps crops.
- **Damage tiers in the table** use the same scale as the HUD: white under 50, yellow 50+, orange 100+, red 150+, dark red 200+.

## Hit table

Time is in the video (m:ss). Sandstorm is the pink fighter, Pavelski the dark grey wolf. "Att." is whether the attacker was on the ground or in the air. Bodies are distance from the contact point; "off screen" means the victim left the frame (the off-screen bubble showed). Hit pause: "0" means the victim already moved on the frame after contact; "4 to 5" means both fighters held still that long. A dash means not read.

| # | Time | G | Attacker | Att. | Attack size | Victim | Dmg (ring) | Victim state | Bodies 0.5 s | Bodies 1 s | Angle | Hit pause (f) | KO | Cues | Conf. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0:31.6 | 1 | Sandstorm | air | mid (string ender) | Pavelski | 95 yellow | air | 5 | 6.5 | flat | - | no | smoke trail, camera pans | M |
| 2 | 0:41.7 | 1 | Sandstorm | air | big side swing | Pavelski | 134 orange | air | 7 | 9+ | flat | 4 to 5 before contact, 0 after | no | red flash, smoke trail, camera pans | M |
| 3 | 0:51.6 | 1 | Sandstorm | air | small poke | Pavelski | 164 red | ground | <0.5 | <0.5 | none | - | no | none | M |
| 4 | 0:53.7 | 1 | Sandstorm | air | small (1st of 2) | Pavelski | 171 red | air | 0.1 | - | none | 5 | no | red flash | H |
| 5 | 0:53.9 | 1 | Sandstorm | air | mid kick (2nd of 2) | Pavelski | 175 red | air | 6 | 9+ (off screen) | flat | 0 (victim moves next frame) | no | red flash, long smoke, camera pans | M |
| 6 | 0:58.8 | 1 | Sandstorm | air | side swing | Pavelski | 198 red | air, near left edge | KO | - | flat | - | KO 0.33 s | smoke, off-screen bubble | M |
| 7 | 1:27.9 | 1 | Pavelski | ground | mid swing | Sandstorm | 79 yellow | ground at ledge | 4 | 3 (recovering) | down-diagonal | - | no | none | L |
| 8 | 1:42.5 | 1 | Sandstorm | air | down attack | Pavelski | 80 yellow | air off stage | 5 | 5 | down (spike) | - | no | none | L |
| 9 | 1:48.6 | 1 | Sandstorm | air | side (string ender) | Pavelski | 143 orange | air, 7 bodies past ledge | 5+ | KO | flat | - | KO 0.5 s | red flash, smoke, KO burst | M |
| 10 | 2:03.7 | 1 | Pavelski | ground | 2-hit swing | Sandstorm | 136 orange | ground near ledge | 4.5 | 7 | down-diagonal | - | no | red flash | M |
| 11 | 2:05.8 | 1 | Pavelski | air | side air | Sandstorm | 150 red | air off stage | 5 at 0.25 s | KO | down-diagonal | - | KO 0.93 s | red flash, smoke | M |
| 12 | 2:16.0 | 1 | Pavelski | air | big spinning special | Sandstorm | 10 white | air | 3 to 4 | ? | diagonal | - | no | none | L |
| 13 | 2:20.7 | 1 | Sandstorm | air | mid | Pavelski | 2 white | air | 2 to 3 | - | down | - | no | none | L |
| 14 | 2:41.0 | 1 | Pavelski | air | big spinning special | Sandstorm | 90 yellow | air | 3 | 3.5 | down-diagonal | - | no | smoke trail | M |
| 15 | 2:44.6 | 1 | Pavelski | ground | mid swing | Sandstorm | 111 orange | air | 3 | 3 | up-diagonal | - | no | orange flash | M |
| 16 | 2:49.5 | 1 | Pavelski | air | up attack | Sandstorm | 153 red | air | off top in 0.12 s | KO | up | - | KO 0.62 s | red flash, smoke column | M |
| 17 | 3:03.3 | 1 | Sandstorm | air | side | Pavelski | 130 orange | air off ledge | 6+ | 8+ | flat | - | no | red flash, smoke | M |
| 18 | 3:13.7 | 1 | Sandstorm | ground | up attack | Pavelski | 157 red | air | 4 | 4 | up | - | no | red flash | M |
| 19 | 3:25.4 | 1 | Sandstorm | air | long hold, then side launch | Pavelski | 169 red | air | 12 (at 0.7 s) | - | flat | held 20 f, then 0 | no | red flash, very long smoke, camera pans | M |
| 20 | 3:36.7 | 1 | Sandstorm | air | multi-hit, then launch | Pavelski | 181 red | air off stage | - | off screen | flat | - | KO 1.05 s | smoke, off-screen bubble | M |
| 21 | 4:06.7 | 2 | Pavelski | ground | string of small hits | Sandstorm | 64 yellow | ground | <1 | <1 | none | - | no | yellow flash | H |
| 22 | 4:19.5 | 2 | Pavelski | ground | big swing | Sandstorm | 130 orange | ground | 4 | 0 (landed) | up | - | no | red flash, small puffs | M |
| 23 | 4:28.9 | 2 | Sandstorm | ground | up attack | Pavelski | 119 orange | ground at ledge | 2.5 | - | up | - | no | red flash | M |
| 24 | 4:32.3 | 2 | Sandstorm | air | down attack | Pavelski | 136 orange | air below ledge | off bottom | KO | down (spike) | - | KO 0.54 s | red flash | M |
| 25 | 4:47.1 | 2 | Pavelski | air | side air | Sandstorm | 169 red | air below ledge height | 5 at 0.25 s | KO | down-diagonal | - | KO 0.6 s | red flash, smoke | M |
| 26 | 4:56.1 | 2 | Sandstorm | ground | string | Pavelski | 13 white | ground | 1.5 | 1 | up | - | no | none | M |
| 27 | 5:02.6 | 2 | Pavelski | air | down air | Sandstorm | 12 white | air | 2 at 0.25 s | - | up-diagonal | - | no | pale flash | L |
| 28 | 5:10.5 | 2 | Pavelski | air | big spinning special | Sandstorm | 80 yellow | air, already near top-left corner | off screen in 0.25 s | KO | up-diagonal | - | KO 0.51 s | orange flash | M |
| 29 | 5:40.8 | 2 | Sandstorm | ground | big slide | Pavelski | 127 orange | air (low) | 10 | off screen | up-diagonal (30 deg) | - | no | red flash, smoke, zoom out | M |
| 30 | 5:53.0 | 2 | Sandstorm | ground | big swing | Pavelski | 151 red | air (low) | 6.5 | 7 | up-diagonal | - | no | red flash, smoke | M |
| 31 | 6:03.3 | 2 | Sandstorm | air | string of 3 small hits | Pavelski | 168 red | air | <1 per hit | - | none | - | no (KO 0.8 s later by the ender) | red flash on every hit | M |
| 32 | 6:25.1 | 2 | Pavelski | ground | side heavy | Sandstorm | 152 red | ground | 7.5 | 9.5 | flat | - | no | red flash, smoke | M |
| 33 | 6:31.3 | 2 | Pavelski | air | side/down air | Sandstorm | 161 red | air | 5+ | off screen | down-diagonal | - | no | red flash, smoke | M |
| 34 | 6:50.1 | 3 | Pavelski | ground | up attack (big) | Sandstorm | 10 white | ground | 3 | 0 (landed) | up | - | no | white flash | M |
| 35 | 6:58.2 | 3 | Sandstorm | ground | up attack | Pavelski | 9 white | air | 1.5 | - | up | - | no | none | M |
| 36 | 7:14.9 | 3 | Sandstorm | ground | string | Pavelski | 81 yellow | ground | 1.5 | - | up | - | no | orange flash | M |
| 37 | 7:22.3 | 3 | Pavelski | air | big spinning special (2nd hit) | Sandstorm | 137 orange | air | 3+ at 0.25 s | off screen | flat | - | no | red flash, smoke | M |
| 38 | 7:30.8 | 3 | Sandstorm | ground | side swing at ledge | Pavelski | 138 orange | air at ledge | 7.5 | 8.7 | flat | 0 | no | red flash, smoke, camera pans | M |
| 39 | 7:36.9 | 3 | Sandstorm | air | side (string ender) | Pavelski | 160 red | air, 4 bodies past ledge | off screen by 0.25 s | KO | flat | 0 | KO 0.6 s | red flash, smoke, KO burst | M |
| 40 | 7:49.0 | 3 | Sandstorm | air | down air (spike) | Pavelski | 22 white | air below ledge | 1 | - | down | - | no | pale flash | M |
| 41 | 7:57.1 | 3 | Pavelski | air | long hold, then side launch | Sandstorm | 155 red | air, 3.5 bodies past ledge | 6 at 0.25 s | KO | flat | held 18 f, then 0 | KO 0.62 s | red flash, smoke | M |
| 42 | 8:19.4 | 3 | Sandstorm | ground | multi-hit heavy (drags) | Pavelski | 133 orange | ground | 3 | - | flat | - | no | red flash on every hit | M |
| 43 | 8:22.4 | 3 | Sandstorm | air | side | Pavelski | 156 red | air off ledge | 4+ at 0.25 s | off screen | flat | - | no (KO 3.4 s later) | red flash, smoke | M |
| 44 | 8:58.5 | 3 | Pavelski | ground | up attack (2nd hit) | Sandstorm | 153 red | air | 6+ (off top) | off screen | up | - | no | red flash, smoke column, zoom out | M |
| 45 | 9:20.4 | 3 | Pavelski | ground | side swing | Sandstorm | 176 red | ground | 10 | 13 | up-diagonal (25 deg) | 0 | no | red flash, smoke, camera pans | M |
| 46 | 9:34.6 | 3 | Pavelski | ground | up attack (2 hits) | Sandstorm | 186 red | ground | 5+ at 0.25 s | KO | up | - | KO 0.76 s | red flash, smoke column | M |
| 47 | 10:27.1 | 4 | Sandstorm | ground | up attack | Pavelski | 20 white | ground | 3.5 | - | up | - | no | yellow flash | M |
| 48 | 10:42.2 | 4 | Sandstorm | ground | string of small hits | Pavelski | 45 white | ground | <1 | <1 | none | 4 to 5 per hit | no | yellow flash | H |
| 49 | 11:04.1 | 4 | Sandstorm | air | side | Pavelski | 119 orange | air off ledge | 5.5+ | off screen | flat | - | no | red flash, smoke | M |
| 50 | 11:09.2 | 4 | Sandstorm | ground | multi-hit hold | Pavelski | 133 orange | ground | 1 | 1 | none | - | no | flash on every hit | M |
| 51 | 11:29.1 | 4 | Pavelski | air | big spinning special | Sandstorm | 121 orange | air above stage | 10 | KO | down-diagonal (20 deg) | 0 | KO 1.07 s | red flash, smoke | M |
| 52 | 11:51.1 | 4 | Sandstorm | ground | up attack | Pavelski | 183 red | air (low) | 4+ in 0.12 s | KO | up | - | KO 0.45 s | red flash, smoke column | M |
| 53 | 12:19.7 | 4 | Pavelski | ground | 2nd hit of a swing | Sandstorm | 108 orange | ground at ledge | 4 | 6.5 (falling) | down-diagonal | - | no | orange flash | L |
| 54 | 12:42.4 | 4 | Pavelski | ground | side swing | Sandstorm | 155 red | air at ledge | 10 | off screen | flat | 0 | no (KO 4 s later) | red flash, smoke | M |
| 55 | 13:09.1 | 4 | Sandstorm | ground | up attack | Pavelski | 117 orange | air | 5.5 at 0.25 s | off top | up | - | no | red flash, smoke column, zoom out | M |
| 56 | 13:13.4 | 4 | Sandstorm | ground | multi-hit special, then launch | Pavelski | 153 red | ground near ledge | 3 (dragged) | off screen | flat | - | KO 1.0 s | red flash, smoke | M |
| 57 | 14:07.6 | 4 | Sandstorm | air | side | Pavelski | 154 red | air off ledge | 4.5 at 0.25 s | off screen | flat | 0 | no | red flash, smoke | M |
| 58 | 14:12.8 | 4 | Pavelski | ground | side swing | Sandstorm | 118 orange | ground | 5 | - | flat | - | no | orange flash | M |

## Analysis

### What separates far from short

Grouping the table by attack size and damage, distance 0.5 s after the hit (median, with the range):

| Damage at the hit | Small hit (jab, poke, string hit) | Mid hit (single swing, up attack, spike) | Big hit (committed heavy, signature, string ender) |
|---|---|---|---|
| white, 0 to 49 | about 1 (under 1 to 1.5), n=2 | about 2 (1 to 3.5), n=6 | about 3 (3 to 4), n=1 |
| yellow to orange, 50 to 119 | about 1 (under 1 to 1.5), n=2 | about 4 (2.5 to 5), n=5 | about 5 (3 to 7), n=6, one KO from the top corner |
| orange to red, 120 to 149 | about 1 (3 for a dragging multi-hit), n=2 | (none read) | about 7 (4 to 10), n=10, 3 KOs |
| red and dark red, 150+ | under 0.5, n=3, plus the starter hit before every tracked launch | about 4 (up), n=1 | 6 to 12 (13 by 1 s), n=20, 10 KOs |

- **Damage tier** is the main switch, but only for big hits. Small hits do not grow at all; mid hits grow slowly (about 2 bodies at white to about 4 at orange or red); big hits grow about three times from white to red (3 to about 8 at 0.5 s).
- **Attack size** matters more than raw move damage. A ring step of only +4 (the hit at 0:53.9) sent a red-ring victim 6 bodies in 0.5 s and off screen by 1 s, while a +20 multi-hit drag at 133 (8:19.4) moved the victim 3 bodies. What counts is whether the move is a launcher.
- **Angle.** Of the 14 KO hits read: 6 flat sideways, 4 diagonal-down or spike (all with the victim already below ledge height or past the ledge), 3 straight up from the ground at 153 to 186, 1 up-diagonal from the top corner. Up launches at 117 and 153 from mid-stage were survived (5 to 6 bodies up, the top blast line is far).
- **Airborne vs grounded victim.** No clear difference in distance; grounded victims hit flat slide or pop up and land, which cuts the 1 s distance. Airborne victims carry the full trail.
- **Near the ledge.** Every side KO started with the victim 3 to 7 bodies past the ledge or near the side of the screen. From centre stage the longest launch read (13 bodies at 176, 9:20.4) was survived.

### Distance curve estimate

Distance 0.5 s after the hit, in bodies, read as a smooth curve through the table:

| Damage | 0 | 50 | 100 | 150 | 200 |
|---|---|---|---|---|---|
| Small hit | 0.5 to 1 | 0.5 to 1 | under 1 | under 1 | under 1 |
| Mid hit | 1.5 to 2.5 | 2 to 3 | 3 to 4 | 4 | 4 to 5 |
| Big hit | 2 to 3 | 3 to 4 | 4 to 6 | 7 to 10 | 10 to 13 |

The big-hit curve is flat up to about 80, then steep: it looks like growth that only starts once damage passes about 60 to 80, not growth from 0.

### Launch speed and deceleration

- At 60 fps, the red silhouette of a launched victim moves 20 to 40 px per frame on the 1280-wide frame (about 0.3 to 0.5 bodies per frame) for the first 10 frames, then the flash ends and the smoke trail takes over. The camera follows, so this is a low estimate.
- Read off the sheets, flat launches cover about 4.5 to 6.5 bodies by 0.25 s, 7.5 to 10 by 0.5 s and 9.5 to 13 by 1 s (0:41.7, 6:25.1, 9:20.4, 12:42.4). That fits an initial speed near 0.55 bodies per frame decaying about 4.5% per frame, which is what our `hitDecay` of 4 already does.
- Freeze: small hits hold both fighters 4 to 5 frames (60 fps crops at 0:53.7 and 4:06.7, matching the 4-frame hit pause already measured). On launchers the victim is already displaced on the frame after contact; the attacker holds its pose instead. Two heavies showed a 4 to 5 frame hold before the launch (0:41.6, 5:40.8).

### KOs

- 20 KOs. Damage at KO: median about 162, mean 167, range 86 to 198 (one KO at 86 from the top corner).
- Time from the kill hit to the KO: 0.33 to 1.07 s, typically 0.5 to 0.6 s.
- Several orange and red victims survived a 6 to 13 body launch and died later, between 3 s and 35 s afterwards (0:53.9, 3:03.3, 3:25.5, 8:22.4, 12:42.4).

### Hits to KO and the kill confirm

- A stock takes a median of 25 landed hits (14 to 32 over the 20 stocks), about 77 s. Damage per hit is small: median ring step about 8 on the 0 to 200 scale, a quarter of hits under 5, only one in ten above 15.
- The pattern before a launch, seen in 15 of 17 launches tracked at 60 fps: a small hit lands (the victim flashes for 10 to 11 frames and moves under 0.1 body per frame), the flash ends, about 6 frames later the launcher lands and the victim leaves at full speed. The gap from the starter to the launcher is about 18 frames. Longer versions exist: a multi-hit special or hold that keeps the victim in place for about 20 frames, then sends it (3:25.5, 7:57.1, 13:13.4).
- At red, strings of 3 or 4 small hits keep the victim within about 1 body (6:03.3) until the ender.

### Visual cues that came with launches

- Hit flash in the victim's damage colour for about 10 frames on every hit (pale at low damage, yellow, orange, then saturated red). A strong full-body red flash is the most reliable "this one is dangerous" cue in the footage.
- White smoke trail behind every launch of about 3 bodies or more; none on small hits.
- Camera pans to follow and zooms out on long launches; an off-screen bubble shows the victim when it leaves the frame; KO burst and a name banner on KO.
- No screen shake was noticed.

## Our sim now

From `game/sim.js` (`l = (kb + kg * dmg / growthDiv) * kbMul / 100 * 100 / weight`, launch velocity `l * ax / 100` and `l * ay / 100`, hitstun `6 + l / hitstunDiv`, horizontal speed decays `hitDecay` 4% per frame in hitstun), the Djinn Warrior move data, and the tests (`node tests/feel.mjs`, `node tests/pace.js`):

- `tests/feel.mjs`: launchLight50 0.265 bodies per frame, launchHeavy100 0.572, hitstun 12 frames (light at 0) and 27 (heavy at 100), side heavy kills 125 at the ledge (target 130 to 165, LOW) and 245 mid-stage.
- `tests/pace.js` (Djinn Warrior vs Dagger Dancer, 6 min, seeds 1 to 3): one KO per 36 to 51 s, 193 to 214 damage at KO, a median 23 to 26 hits per KO (hit counts from a scratch copy of `pace.js` that also counts hits).
- Distance 0.5 s after the hit, grounded victim at mid-stage, no victim input (scratch harness built on the same `Sim.match`):

| Move (Djinn Warrior) | 0 | 50 | 100 | 150 | 200 | Reference |
|---|---|---|---|---|---|---|
| Neutral light (slot 0) | 2.3 | 2.8 | 3.1 | 3.4 | 3.8 | under 1 at all damage |
| Side light (slot 1) | 3.0 | 3.8 | 4.6 | 5.5 | 6.4 | mid: 2 to 4 |
| Side heavy (slot 5) | 4.9 | 6.8 | 8.8 | 10.7 | 12.7 | 2 to 3, 3 to 4, 4 to 6, 7 to 10, 10 to 13 |
| Up heavy (slot 6) | 4.7 | 6.4 | 8.0 | 9.6 | 11.2 | mid: 2 to 5 |

The problem in one line: our lights travel 3 to 5 times too far at every damage and barely grow, and our heavies start too far (5 bodies at 0) and grow too little (2.6 times from 0 to 200, the reference is about 4 to 5 times). The top end (10 to 13 bodies at 150 to 200) and the decay rate are already right.

## Proposed tuning

Three knobs plus a per-class scaling of the move data. All numbers were tried in a scratch copy of the sim (no game code was edited).

### Engine knobs (`FEEL` in `game/sim.js`)

| Knob | Now | Proposed | Why |
|---|---|---|---|
| `growthFrom` (new) | none (growth from 0) | **60**: `l = kb + kg * max(0, dmg - 60) / growthDiv` | Makes the big-hit curve flat until about 80 and steep after, like the reference. |
| `hitstunBase` (new, replaces the hard-coded 6) | 6 | **8** | Lights now launch so little that hitstun would drop to 7 frames; 8 keeps light hitstun at 10 to 11 frames, the 10 to 11 frame flash seen on small hits. |
| `kbMul`, `growthDiv`, `hitstunDiv`, `hitDecay` | 350, 14, 168, 4 | unchanged | The top end and the deceleration already match. |

### Move data, by class (all fighters)

| Class | Slots | `kb` | `kg` |
|---|---|---|---|
| Light: jab, down light, neutral air | 0, 2, 4 | **x 0.3** | **x 0.5** |
| Mid: side light, up light, up heavy, down air | 1, 3, 6, 8 | **x 0.6** | unchanged |
| Heavy: side heavy, down heavy, down-air heavy | 5, 7, 9 | **x 0.6** | **x 1.75** |

Djinn Warrior, before and after (`kb`, `kg`):

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| Now | 330, 12 | 380, 26 | 430, 16 | 410, 18 | 380, 20 | 560, 58 | 520, 32 | 520, 50 | 380, 24 | 520, 40 |
| Proposed | 99, 6 | 228, 26 | 129, 8 | 246, 18 | 114, 10 | 336, 102 | 312, 32 | 312, 88 | 228, 24 | 312, 70 |

### Expected effect (Djinn Warrior, same harness, distance 0.5 s after the hit)

| Move | 0 | 50 | 100 | 150 | 200 | Reference |
|---|---|---|---|---|---|---|
| Neutral light | 0.3 | 0.3 | 0.4 | 0.6 | 0.7 | under 1 |
| Side light | 1.3 | 1.3 | 2.2 | 3.2 | 3.9 | mid: 2 to 4 |
| Up heavy | 1.3 | 1.4 | 3.1 | 4.8 | 6.4 | mid: 2 to 5 |
| Side heavy | 2.4 | 2.9 | 6.0 | 9.4 | 12.9 | 2 to 3, 3 to 4, 4 to 6, 7 to 10, 10 to 13 |
| Down heavy | 2.0 | 2.1 | 5.5 | 9.1 | 12.6 | same as side heavy |

Hitstun becomes 10 to 11 frames for lights at any damage, 23 frames for a heavy at 100 and 31 at 150 (now 12 to 16 and 27 to 32).

`tests/feel.mjs` with the proposal: side heavy kills **155** at the ledge (target 130 to 165, now ok instead of LOW) and **225** mid-stage (target 200 to 290). Other fighters: Dagger Dancer and Sea Siren 160 / 225 (now 130 / 250 to 255), Fennec Host 120 / 170 (now 85 / 165, still the earliest, it weighs 82), Clockwork Elephant 165 / over 300 (now 135 / over 300).

### Targets to update in `docs/design/feel-targets.json`

- `launchLight50` (side light at 50): from 0.2 to 0.35 down to **0.08 to 0.15** bodies per frame (reference small hits move under 0.1 per frame). The proposal gives 0.124.
- Add: neutral light distance at 200 under **1 body** at 0.5 s; side heavy distance at 0 between **2 and 3**, at 150 between **8 and 10**.

### Side effects to watch

- **Pace.** With the bots, KOs come faster: one per 26 to 30 s instead of 36 to 51 s, at a similar 184 to 210 damage and a similar median 24 to 28 hits per KO. The victims stay in range, so the bots simply land more hits per second (about 0.9 instead of 0.6; the reference is about 0.6). This is a bot problem (they never dodge out of a string), not a knockback one; adding knockback back would undo the reference shape. Cutting light damage by 2 did not change the rate. Re-check with people playing before touching damage.
- **Strings.** A light now leaves the victim about 0.3 bodies away with about 10 frames of stun, so jab into jab or jab into heavy can chain. The reference does the same (strings of 3 to 4, then an ender), but keep `dodgeInvFrom` 3 so a victim can always dodge out between hits, and watch for infinite jab locks in the mechanics test.
- **Hit pause.** No change needed: 4 frames on lights already matches. Optional: cap the freeze on launchers at 4 to 5 (now up to 7), since the reference victim leaves on the next frame.

### Cues to add (cheap, high readability)

- Tint the victim's hit flash by damage tier (white, yellow, orange, red) for about 10 frames.
- Only spawn the smoke trail when launch speed is above about 0.25 bodies per frame. With the proposal that means heavies from about 80 and never lights, matching the reference.
- Keep the camera pan and zoom-out on long launches and the off-screen bubble.

## Confidence and gaps

- **High:** hit times, damage tier at each hit, KO times and damage at KO (read from the HUD on every frame); the "small hits stay under 1 body" rule (4 strips at 60 fps plus 15 tracked starter hits); the "hold, then launch" pattern (15 of 17 tracked).
- **Medium:** distances in bodies, plus or minus about 30%. They are read by eye from half-size sheets, against stage landmarks, with the camera panning and zooming; the body height used is 35 to 40 px per half-size sheet and changes with zoom. Distances after about 0.5 s include the victim's own drift and jumps.
- **Medium:** the damage numbers between tier anchors. The ring is continuous, but the conversion between anchors is linear, so "130" could be 115 to 145.
- **Low:** attack names and wind-up lengths. Attack size is judged from the pose, the effect and the ring step, not from frame data. Who was grounded is sometimes unclear in scrambles.
- **Gaps:** only one fighter pair in the footage; weight differences cannot be read. Few clean small hits at white were read (3), and the mid class at red has one sample. Hit pause was measured on 6 hits only. Down-air (slot 8) could not be tested in the grounded harness, so its tuning follows the mid class without a measured check.

## Applied (lead)

Implemented in `game/sim.js` as class multipliers on the move data (`FEEL.kbClass`, `FEEL.kgClass`), so all twelve fighters follow the same rule without editing their files, plus `growthFrom` 60 and `hitstunBase` 8. Heavy growth uses x 1.6 instead of x 1.75: at 1.75 the side heavy travelled 10.6 bodies at 150, just over the 8 to 10 band.

| Metric (Saif) | Reference | Now |
|---|---|---|
| Jab travel at 200 | under 1 body | 0.72 |
| Side heavy travel at 0 | 2 to 3 | 2.38 |
| Side heavy travel at 150 | 8 to 10 | 9.8 |
| Side heavy kill at the ledge | 150 to 165 | 165 |
| Mid-stage kill | 200 to 290 | 240 |

Bots now buffer a dodge out of strings and edge-guard (chase an off-stage opponent with a jump in reserve). Bot matches run one KO per 36 s (reference about 40 s), but the median KO lands at about 236 against the reference's 162: the bots seldom land a launcher near the ledge once the victim is red. That is bot skill, not physics, and is left as is so the per-hit feel stays true to the reference. `tests/mechanics.js` checks that a victim mashing dodge escapes a jab string.
