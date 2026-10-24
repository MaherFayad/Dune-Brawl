# Reference visual effects

Source: the reference video (a 1v1 platform fighter tournament broadcast, 1280x720 at 59.94 fps, 4 games). Studied from 60 fps and 30 fps contact sheets with tight crops, about 30 sheets in all, plus camera tracking by phase correlation. Frames and clips stay in the scratch folder, never in the repo. The broadcast overlays (bottom scoreboard, top-center name banner after a KO) are ignored.

Units: **bodies** (one fighter's standing height; our body is 64 world px) and **frames at 60 fps**. Confidence: **High** = seen in 3 or more instances at 60 fps. **Medium** = 1 or 2 instances, or read at 30 fps. **Low** = a single ambiguous sample.

## Top 8 findings

1. **The hit victim turns into a flat silhouette in their own damage colour.** The whole sprite is filled with one flat colour that matches their HUD damage ring at that moment: yellow at low damage, orange at mid, deep red at high (checked against the ring 4 times). It holds through the hit pause and the first 10 to 20 frames of a launch. This one effect does the work of a damage meter, a hit flash and a "this hit was big" cue at once. It is the strongest feel effect in the footage.
2. **Strong hits stretch the victim into a smear.** On a launch the coloured silhouette is drawn stretched 1 to 1.5 bodies back along the flight line, with ragged trailing edges, for about 5 to 10 frames. The attacker's own body often turns into a white stretched smear in the same frames. The picture reads as "speed", not as "explosion".
3. **Launches leave a thick, continuous, cel-shaded cloud column.** White puffs with light grey shading on the underside, no glow, packed so tightly they read as one rope 0.4 to 0.7 bodies thick, 3 to 6 bodies long. It billows bigger for about 15 frames, holds to about 30, then breaks into loose puffs and is gone by 45 to 60 frames. It is drawn behind the victim.
4. **Everything is flat and opaque.** Sparks, smears, smoke and KO bursts are cartoon cels: white or one flat colour with one grey shade, sometimes a thin dark edge. No additive glow, no bloom, no full-screen flash, no vignette pulse, no slowdown. Colour comes from the victim flash, not from the spark.
5. **Sparks are small and white.** A jagged white starburst about 0.4 to 0.6 bodies across at the contact point, popping in at full size and gone in 6 to 10 frames. Heavy hits do not get a bigger fireball; they get the smear, the colour flash and the trail.
6. **KO happens at the screen edge, not across the screen.** The camera stops following the victim; an off-screen bubble tracks them; then a flat splash bursts at the edge (white ink shape, straight coloured speed lines, small stars) and becomes a giant cartoon cloud bank about a third of the screen tall that lingers over 60 frames. The splash colour is a per-player cosmetic (cyan in one KO, magenta in another), so for us: the attacker's team colour.
7. **Camera is calm.** Ordinary hits move the camera by at most 0.05 to 0.1 bodies for 2 to 4 frames. A KO burst gets about 0.1 bodies of jitter for 5 to 10 frames. No zoom punch was seen. Our shake is 2 to 3 times stronger.
8. **Movement puffs are small white splashes that stay where they were made.** Dash take-off: swept-back white tongues 0.6 bodies tall that dissolve upward in about 17 frames. Air jump: a ring of small puffs under the feet, 0.5 bodies wide, about 20 frames. Landing: a V splash 1 body wide. Wall jump: a short yellow streak on the wall that turns into a cream puff.

## Full catalog

| Effect | Trigger | Shape | Colour | Size (bodies) | Duration (frames) | Animation | Layer | Blend | Conf. |
|---|---|---|---|---|---|---|---|---|---|
| Victim colour flash | Any hit taken | Whole sprite filled flat, inner lines faintly kept | Victim's current damage colour: yellow, orange, red (same as HUD ring) | Sprite size | Hit pause plus hitstun on light hits (multi-hit strings hold it 20 to 25 frames); on launches it lasts the first 10 to 20 frames of flight, then normal colours return | Instant on, instant off; no fade | Fighter layer | Flat, slightly translucent fill | High |
| Victim launch smear | Strong hit / launch | The coloured silhouette stretched back along velocity, ragged trailing tail, a second detached colour blob lagging behind | Damage colour, darker at the tail | 1 to 1.5 long, plus a detached blob up to 2 bodies back | 5 to 10 | Stretch on frame 1, tail shrinks as the trail takes over | Behind victim | Flat | High |
| Attacker heavy smear | Heavy or signature attack, active frames | The attacker's body becomes a white horizontal streak, or a white sphere for spinning moves | White with pale grey inner edge | 1.2 to 1.4 long | 4 to 6 | Pops in, holds, cuts | In front of attacker | Flat | High |
| Light swing trail | Light attack swing (hit or miss) | Crescent arc around the limb or weapon, thick at the leading edge, tapering | White, pale grey inside edge | About 1 across | 3 to 5 | Appears full, thins and cuts | In front | Flat | High |
| Weapon disc smear | Spinning weapon move | Full tilted ellipse ring around the fighter | The weapon's colours (blue and cyan for the blue scythe), white rim | 1.3 across | About 9 | Spins, then cuts | In front, fighter visible through it | Flat | Medium |
| Weapon glint | Startup of a weapon move | Bright edge along the blade | Cyan | Blade length | 3 to 4 | On, off | On weapon | Flat | Low |
| Hit spark | Contact | Jagged starburst with 6 to 10 uneven points, slight pink or cream tint in the core | White | 0.4 to 0.6 | 6 to 10 | Pops in at full size, points shrink, may shed 2 or 3 tiny flecks | In front of both fighters | Flat | High |
| Punch speed lines | Fast strikes | 3 to 5 straight thin lines along the strike direction | White | 0.5 long | 2 to 4 | Static, cut | In front | Flat | Medium |
| Hit pause | Every hit | Both fighters freeze; effects keep animating | n/a | n/a | About 4 typical, 6 to 8 big (see REFERENCE-MEASUREMENTS.md) | No visible victim shake seen | n/a | n/a | Medium |
| Launch cloud trail | Victim flying fast after a launch | Chain of round cumulus puffs that overlap into one continuous column; starts as small separated elongated puffs for 3 to 4 frames | White with light cool grey shading on the underside, thin grey edge | 0.4 to 0.7 thick, 3 to 6 long | Column at full size by about 15, holds to about 30, breaks into separate puffs, gone 45 to 60 | Each puff grows about 1.5x after spawning, then shrinks and drifts slightly; spawned every frame while speed is high | Behind the victim, in front of the stage background | Flat | High |
| Off-screen bubble | Fighter outside the camera | Circle at the screen edge on the line to the fighter, dark 3 px rim, grey translucent fill, fighter drawn inside at reduced scale (keeps their flash colour) | Grey glass, dark rim | 1.3 to 2 across on screen (about 18% of screen height) | As long as off-screen; fades over about 10 when they die | Slides along the edge | Top of the play field | Translucent | High |
| KO edge burst | Victim crosses the blast zone | White ink splash shape anchored to the screen edge, a dark jagged core, straight thin speed lines radiating inward, small 4-point stars | White plus one cosmetic colour (cyan, magenta); for us the attacker's team colour | 1.5 to 3 tall at the edge | About 15 | Bursts out, lines streak, stars drift | Top of the play field | Flat | High |
| KO cloud bank | Follows the burst | Huge cumulus mass pushing in from the edge | White with grey shading, some colour flecks | About a third of screen height, 2 to 4 bodies across | Over 60; still large 70 frames later, thins slowly | Billows outward, then thins | Top of the play field | Flat | High |
| KO camera | KO | Camera does not chase the victim; keeps framing the survivor; mild jitter on the burst | n/a | Jitter 0.06 to 0.1 | 5 to 10 | Random offsets | n/a | n/a | Medium |
| KO screen effects | KO | None: no flash, no slowdown, no vignette | n/a | n/a | n/a | n/a | n/a | n/a | Medium |
| KO HUD stamp | KO | Stock digit drops, ring resets to white, a red stamp icon slams onto the victim's portrait | Red | Portrait size | 2 frame blur in, then holds over 60 | Slam in with a motion smear | HUD | Flat | Medium |
| Final KO banner | Last stock lost | "GAME!" in a warm gradient (yellow to red) with a thick dark outline, arched | Warm gradient | Large, about a quarter of screen width | Shows as the burst starts, holds about 2 s, then a white fade to the next stage | Ghost-in slam like the countdown | HUD | Flat | High |
| Countdown numerals | Match start | Italic 3, 2, 1 with an extruded dark-red underside and dark outline | Yellow to orange to red vertical gradient | About a third of screen height | About 42 per number; ghost entry about 8, hold about 32, hard cut | Enters oversized (about 1.6x) and translucent white-pink, slams to size in about 6, holds still, cuts with no fade | HUD | Flat | High |
| "BRAWL" go word | Countdown ends | Huge arched word | Same gradient | About half the screen width | About 35 | Ghost entry, hold, exits by tilting and fading over about 6 | HUD | Flat | High |
| Spawn carrier | Match start and respawn | A small winged creature holds the fighter in mid-air | Its own colours | About 0.8 | Hangs through the countdown; on respawn appears about 115 frames after the KO and holds up to about 150 frames; after release it flies up and shrinks out over about 90 | Bobs while holding, flies off on release | Behind fighter | Flat | High |
| Dash take-off splash | Ground dash start | Swept-back white tongues rising from the floor behind the fighter | White, pale blue-grey shading | 0.6 tall, 0.5 wide | About 17 | Grows over 3, stays in place, thins and dissolves upward | Behind fighter | Flat | High |
| Dash ground streak | Ground dash | A low thin white wisp along the floor behind the feet | White | About 1 long | About 10 | Fades | Behind | Flat | Medium |
| Landing splash | Landing | V of white tongues splashing out both ways | White | 1 wide, 0.5 tall | 16 to 20 | Bursts out, breaks into flecks | Behind | Flat | Medium |
| Ground jump puff | Jump from the ground | Same splash as landing, smaller | White | 0.7 wide | About 16 | Same | Behind | Flat | Medium |
| Air jump ring | Double or triple jump | A ring (horseshoe) of 6 to 8 small round puffs under the feet | White, turning grey as it fades | 0.5 to 0.6 across | About 20 | Stays where made, expands about 10%, greys and fades | Behind | Flat | High |
| Wall jump mark | Jump off a wall | Thin vertical streak on the wall face, then a puff cluster | Yellow, the puff cream fading to white then grey | 0.7 tall streak, 0.4 puff | Streak 4 to 6, puff about 18 | Streak flashes, puff drifts off the wall | Behind | Flat | Medium |
| Dodge | Dodge | No afterimages seen; spinning moves turn the body into a white ball for 2 to 4 frames | White | Body | 2 to 4 | n/a | n/a | Flat | Low |
| Damage tier on fighter | Damage level | No persistent smoke, fire or tint on the fighter; damage shows only through the hit flash colour and the HUD ring | n/a | n/a | n/a | n/a | n/a | n/a | High |
| Ground pound | n/a | Not isolated in the footage | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| Camera on ordinary hits | Hit | Small jitter at most | n/a | 0.05 to 0.1 | 2 to 4 | Random | n/a | n/a | Medium |
| Zoom punch | n/a | None seen; the camera only reframes smoothly (for example zooming in over about 40 frames after a drop-in) | n/a | n/a | n/a | n/a | n/a | n/a | Medium |

### What carries the most feel

In order: the damage-colour victim flash, the launch smear, the cloud trail, and the hit pause. Together they make every hit say how hard it was and how close the victim is to dying, without any big sparks or screen effects. The KO burst and off-screen bubble carry the payoff and the readability of off-stage play. Sparks, shake and movement puffs are supporting detail.

## Our game now (from game/main.js and assets/vfx)

- Hit: painted orange-yellow comic starburst (`spark`, 0.6 to 0.9 bodies) on light hits; on heavy hits a larger orange burst (`heavy`, 1.2 to 1.6 bodies with long rays) plus a cyan `slash` sprite and 10 embers, and a zoom kick up to 0.08. Victim gets a white tint at 0.6 for 3 frames and a 2 px jitter during the freeze.
- Shake: 1.5 + 0.35 x knockback screen px, capped at 14 (about 0.18 bodies), decaying 0.85 per frame; KO 22 px (about 0.3 bodies) plus a 0.3 alpha warm full-screen flash.
- Launch trail: sandy `dust` sprites every 2 frames with random rotation, 0.35 to 0.9 bodies, life 30, plus faint circles at 0.35 alpha. On screen it reads as a thin wavy zig-zag ribbon about 0.2 bodies thick. It is drawn in front of the fighters.
- KO: a 9.7 body long `ko` beam from the KO point aimed at stage center, plus a `heavy` burst and 40 particles. The camera recenters on the survivor right away. No off-screen indicator.
- Swing trails: painted into the attack animation frames (cyan arcs on the djinn); no separate smear on a whiff, no body stretch on heavies.
- Movement: the same sandy `dust` cloud for landing (1.15 bodies), jump (0.8) and ground dodge; dodge also leaves ghost afterimages and puffs. No air jump ring, no wall jump mark.
- Spawn: a glowing team-colour ellipse under the hanging fighter during the countdown only; respawn drops from the top with no pad, 75 frames after the KO.
- Countdown: white italic numerals, 30 frames each, then "FIGHT!" in yellow. Win: dark band with "X WINS".
- HUD: the damage ring jiggles for 8 frames when hit; no KO stamp.
- Always on: sand motes and a 0.22 vignette.

## Gap list, ranked by impact on feel

| # | Change | Why | Effort |
|---|---|---|---|
| 1 | Replace the 3-frame white hit tint with a flat fill in `dmgColor(victim.dmg)` held through the hit pause and hitstun (cap about 25 frames), and on launches for the first 12 to 18 frames of flight | The single biggest feel cue in the reference, and it doubles as a damage readout on the fighter | Code only (the tint buffer in `drawSprite` already does a flat fill) |
| 2 | Launch smear: on launch, draw the tinted victim stretched 1 to 1.5 bodies back along velocity (scale along the flight axis plus 2 trailing copies at 0.5 and 0.25 alpha) for 6 to 10 frames; on heavy attacks draw the attacker as a white stretched copy for 4 to 6 frames | Sells speed and power without fireballs | Code only |
| 3 | Rebuild the launch trail as a thick cloud column: spawn a round puff every frame while speed is high, 0.4 to 0.7 bodies, grow 1.5x over 12 frames, hold to 30, then shrink and drift, gone by 50 to 60; no random rotation; draw behind fighters | The reference trail is the most recognisable look of the genre; ours reads as a thin ribbon | New art: puff set |
| 4 | Swap the warm sparks for small flat white starbursts (0.45 bodies light, 0.6 heavy, 6 to 10 frames, pop at full size then shrink); drop the orange `heavy` fireball and embers from normal hits | Colour should come from the victim flash; our sparks are 2 to 3 times too big and too warm | New art: white starburst set |
| 5 | KO at the edge: freeze camera follow on the victim, show an edge burst plus a cloud bank in the attacker's team colour where they crossed the blast line, 0.1 body shake for 8 frames, no full-screen flash; retire the inward beam | Payoff of the whole stock; the beam crosses the screen and points away from where the KO happened | New art: KO splash and cloud bank |
| 6 | Off-screen bubble: when a fighter leaves the view, draw a 1.5 body circle at the edge with a dark rim, translucent grey fill and the fighter at about 0.5 scale inside | Fights happen off the ledge; without it the player loses their fighter | Code only |
| 7 | Tone down shake: about 0.05 bodies for 2 frames on light hits, 0.1 for 4 on heavy, 0.1 for 8 on KO; keep or drop the zoom kick (the reference has none) | Our camera rattles more than the reference; the hit pause should carry impact | Code only |
| 8 | Light swing trail on every light attack (hit or miss): white crescent about 1 body, 3 to 5 frames | Makes whiffs readable and attacks snappy | New art: white crescent set (or reuse `slash` desaturated to white, code only) |
| 9 | Movement puffs in white instead of sand: dash take-off splash (0.6 tall, 17 frames, stays in place), landing V splash, air jump puff ring (0.5 wide, 20 frames), wall jump streak plus puff | Small, but gives every movement a crisp signature | New art: kick-off splash and puff ring (the ring can be built in code from the new puff set) |
| 10 | Respawn on a carrier: reuse the spawn pad (or a new flying carpet) for respawns, appear about 115 frames after the KO, hang up to 150 frames or until input; drop the dodge ghost afterimages | Respawn reads as a deliberate return; matches the opening | Code only with the pad; new art for a carpet |
| 11 | Countdown and finish: gradient numerals with a ghost slam entry, about 42 frames each, hard cut; a "GAME!" slam on the last KO; red stamp on the KO'd portrait | Polish; the structure is already right | Code only |

## Generation briefs for new art (each painted on pure black, for converting to transparency)

- **Puff set (gap 3, 9):** "Four separate cartoon cumulus smoke puffs, round and lumpy, flat white fill with one soft cool-grey shade on the lower right, thin grey outline, cel-shaded game effect style, evenly spaced on a pure black background, no glow."
- **White starburst set (gap 4):** "Three comic hit-spark starbursts, jagged with 6 to 10 uneven sharp points, flat white with a faint cream core, thin dark edge, cel-shaded 2D fighting game style, separate on a pure black background, no glow, no orange."
- **KO edge splash (gap 5):** "A flat white ink-splash burst bursting out from the left edge of the frame, dark jagged core, straight thin speed lines and small four-point stars in one bright accent colour, cartoon fighting game KO effect, on pure black, no glow." (Paint the accent in a neutral light grey so code can tint it to the attacker's team colour.)
- **KO cloud bank (gap 5):** "A huge cartoon cumulus cloud mass pushing in from the left edge, flat white with two grey cel shades, thin grey outline, 2D game effect style, on pure black, no glow."
- **White crescent smear (gap 8):** "Three white attack swing smears, thick crescent arcs tapering to a point, pale grey inner edge, flat cel-shaded fighting game style, separate on pure black, no glow."
- **Kick-off splash (gap 9):** "A white dust splash of swept-back flame-like tongues rising from the ground at an angle, pale blue-grey shading, flat cartoon fighting game style, side view, on pure black, no glow."
- **Flying carpet carrier (gap 10, optional):** "A small ornate flying carpet seen from the side, gently rippling, desert reds and gold with tassels, cel-shaded 2D game sprite with a dark outline, on pure black."
