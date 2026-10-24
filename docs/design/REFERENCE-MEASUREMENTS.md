# Reference measurements

Source: the reference video Maher shared (Brawlhalla, Valencia Elimination Top 16, 1280x720 at 59.94 fps, 14 min 40 s, 4 games). The footage is copyrighted, so frames and clips stay out of the repo; only the numbers below are kept.

Units: **bodies** (one fighter's standing height) and **frames at 60 fps**. Bodies cancel out the broadcast camera's constant pan and zoom, so a number taken at one zoom compares directly with our sim.

Confidence: **High** means a direct count or a repeated measurement. **Medium** means read from 15 fps strips, about ±10%. **Low** means a single sample or an inference.

## Results and what we set

| Metric | Reference | How it was measured | Conf. | Dune Brawl now (Saif) |
|---|---|---|---|---|
| Game length | 180 to 245 s (mean 214 s) | Set score changes and stage transitions | High | not tested yet |
| Stocks | 3 each | Stock digit in the top-right HUD | High | 3 |
| KO rate | about one per 40 s | Stock decrements against time, game 1 | High | one per 36 to 40 s (bot vs bot, `tests/pace.js`) |
| Damage at KO | mostly red ring (150+), some orange (100 to 150) | Ring colour at each stock loss; the Brawlhalla wiki gives most KOs at 150 to 200 | High | mean 162 to 164% across pairings |
| Side heavy kill near ledge | 150 to 200 band | Wiki band plus ring colour | Medium | 130 to 160% for all five fighters |
| Main stage width | 13.6 to 15.5 bodies | Stage ends against body height, two stages | Medium | 14.1 |
| Soft platform | 5 bodies wide, 3.3 above the main stage, one or none per stage | Same frames | Medium | two platforms, 4.4 wide, 3.0 up |
| Full jump | about 2 bodies high, about 34 frames airtime | 15 fps strip of a jump, game 2 | Medium | 1.98, 33 frames |
| Jumps | ground jump plus 2 air jumps, plus a recovery move | Observed chains off-stage | High | same |
| Hit pause | about 4 frames on a typical hit, 6 to 8 on a big one; projectiles keep moving | Freeze-run histogram (peak at 4 frames) checked against 60 fps strips | Medium | 4 light, 6 heavy |
| Dodge and dash | about 2 to 3 bodies per dodge, long smoke trail on dashes | 10 fps strips | Low | 1.8 |
| Fighter size on screen | 8 to 10% of screen height up close, about 6% when spread | Body height against frame height | Medium | zoom clamped to 5.5 to 9.8% |
| Where fights happen | mostly off the ledge: edge guarding, recovery, wall play | Strips of games 1 and 2 | High | wall slide and wall jump added, collision follows the island art |
| Sky value | luminance 97 to 190 (typical 157), saturation 0.18 to 0.30 | Top 60% of six frames, mean of 320x180 | High | 152, 0.24 (was 79, 0.41) |
| Match opening | fighters spawn mid-air on pads, 3, 2, 1, BRAWL, then drop in | 3 fps strip, game 2 | High | 3, 2, 1, FIGHT! on the ground |

## What changed in round 1, and why

1. **Stage scale.** The main stage grew from 11 to 14 bodies, and the platforms moved up to 3 bodies so reaching them takes a double jump, as in the reference.
2. **Jump arc.** Gravity went from 72 to 100 and jump speed was lowered. The arc stays about 2 bodies high but lands sooner and snappier.
3. **Hit pause.** Cut from 6 to 12 frames down to 4 to 6. The reference freezes the victim briefly; it does not stop the game.
4. **Kill timing.** Knockback growth is now its own knob (`FEEL.growthDiv`, 10 to 16). Side-heavy ledge kills moved from 85% into the reference band.
5. **Recovery.** We added a wall slide, and up to 3 wall jumps per airtime. Landing now counts any overlap with the ledge. The island collision is a V matching its art (60 px deep at the lips, 250 at the keel), replacing a flat 90 px slab, so fighters no longer drift under the visible rock.
6. **Bot bug.** In demo mode the two bots shared one parity counter, so one held Jump and never jumped. That alone caused one KO every 9 s, all off the bottom at 0 to 70%.
7. **Camera and value.** The camera zoom is clamped to the reference framing. The sky is now high-key and low-saturation, and the island darkens so its lit top edge carries the play plane.

## Known gaps

- **Dodge distance** and **run speed** are low-confidence. A clean ground run never appeared at a stable zoom in the sampled games. Round 2 should take a 60 fps track from a training-mode style clip if one exists.
- **Mid-stage single-hit kills** read 245 to 290%, above the ledge band. Full matches still average 160 to 215% at KO, matching the reference. The single-hit target is a soft 200 to 290.
- **The reference spawns** fighters in the air during the countdown. We spawn on the ground. This is cheap to copy if you want it.
