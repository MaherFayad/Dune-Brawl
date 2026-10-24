# Reference measurements

Source: the reference video Maher shared (a 1v1 platform fighter tournament broadcast, 1280x720 at 59.94 fps, 14 min 40 s, 4 games). The footage is copyrighted, so frames and clips stay out of the repo; only the numbers below are kept.

Units: **bodies** (one fighter's standing height) and **frames at 60 fps**. Bodies cancel out the broadcast camera's constant pan and zoom, so a number taken at one zoom compares directly with our sim.

Confidence: **High** means a direct count or a repeated measurement. **Medium** means read from 15 fps strips, about ±10%. **Low** means a single sample or an inference.

## Results and what we set

| Metric | Reference | How it was measured | Conf. | Dune Brawl now (Saif) |
|---|---|---|---|---|
| Game length | 180 to 245 s (mean 214 s) | Set score changes and stage transitions | High | not tested yet |
| Stocks | 3 each | Stock digit in the top-right HUD | High | 3 |
| KO rate | about one per 40 s | Stock decrements against time, game 1 | High | one per 42 s (16 bot matches, `tests/pace.js`) |
| Damage at KO | mostly red ring (150+), some orange (100 to 150) | Ring colour at each stock loss; the reference game's community wiki gives most KOs at 150 to 200 | High | mean 184% across 16 matches |
| Side heavy kill near ledge | 150 to 200 band | Wiki band plus ring colour | Medium | 110 to 140% single hit (traded for match-level pacing, see round 2) |
| Main stage width | 13.6 to 15.5 bodies | Stage ends against body height, two stages | Medium | 14.1 |
| Soft platform | 5 bodies wide, 3.3 above the main stage, one or none per stage | Same frames | Medium | two platforms, 4.4 wide, 3.0 up |
| Full jump | about 2 bodies high, about 34 frames airtime | 15 fps strip of a jump, game 2 | Medium | 1.98, 33 frames |
| Jumps | ground jump plus 2 air jumps, plus a recovery move | Observed chains off-stage | High | same |
| Hit pause | about 4 frames on a typical hit, 6 to 8 on a big one; projectiles keep moving | Freeze-run histogram (peak at 4 frames) checked against 60 fps strips | Medium | 4 light, 6 heavy |
| Dodge and dash | about 2 to 3 bodies per dodge, long smoke trail on dashes | 10 fps strips | Low | 1.8 |
| Fighter size on screen | 8 to 10% of screen height up close, about 6% when spread | Body height against frame height | Medium | up to 11.4% body (about 12.5% silhouette; the reference silhouettes run 12 to 13%), camera frames the pair |
| Where fights happen | mostly off the ledge: edge guarding, recovery, wall play | Strips of games 1 and 2 | High | wall slide and wall jump added, collision follows the island art |
| Sky value | luminance 97 to 190 (typical 157), saturation 0.18 to 0.30 | Top 60% of six frames, mean of 320x180 | High | 141, 0.31 (was 79, 0.41), stage mass darker than the sky |
| Match opening | fighters spawn mid-air on pads, 3, 2, 1, BRAWL, then drop in | 3 fps strip, game 2 | High | same: spawn pads 150 px up, drop lands on the go |

## What changed in round 1, and why

1. **Stage scale.** The main stage grew from 11 to 14 bodies, and the platforms moved up to 3 bodies so reaching them takes a double jump, as in the reference.
2. **Jump arc.** Gravity went from 72 to 100 and jump speed was lowered. The arc stays about 2 bodies high but lands sooner and snappier.
3. **Hit pause.** Cut from 6 to 12 frames down to 4 to 6. The reference freezes the victim briefly; it does not stop the game.
4. **Kill timing.** Knockback growth is now its own knob (`FEEL.growthDiv`, 10 to 16). Side-heavy ledge kills moved from 85% into the reference band.
5. **Recovery.** We added a wall slide, and up to 3 wall jumps per airtime. Landing now counts any overlap with the ledge. The island collision is a V matching its art (60 px deep at the lips, 250 at the keel), replacing a flat 90 px slab, so fighters no longer drift under the visible rock.
6. **Bot bug.** In demo mode the two bots shared one parity counter, so one held Jump and never jumped. That alone caused one KO every 9 s, all off the bottom at 0 to 70%.
7. **Camera and value.** The camera zoom is clamped to the reference framing. The sky is now high-key and low-saturation, and the island darkens so its lit top edge carries the play plane.

## What changed in round 2, and why

A side by side of our demo against 10 s of the reference showed three gaps: our camera sat wide on the whole island, the frame was one pastel value, and the bots fought on the ground while the reference fights in the air.

1. **Camera.** It frames the two fighters, not the stage: a window at least 10 bodies wide that follows them off the ledge and upward, with only a light pull toward centre. At match end it pushes in on the winner.
2. **Value.** The stage and platforms are darker and higher-contrast against the high-key sky, like the reference's dark stage blocks.
3. **Bots.** They hop in from mid range, chase a launched foe upward and use aerials, so the demo plays in the air. Knockback growth was retuned (`growthDiv` 14) against 16 bot matches rather than one test hit.
4. **Opening.** Fighters hang on glowing spawn pads through 3, 2, 1, then drop in on FIGHT!.
5. **Effects.** Hit sparks sit at the contact point instead of covering the victim. Launches leave smoke-puff trails and dodges leave short streaks.
6. **Victory.** The winner now plays its victory sheet. Round 2 art retook the three flagged victories (Saif, Abu Sarab, Marjana).

## Known gaps

- **Dodge distance** and **run speed** are low-confidence. A clean ground run never appeared at a stable zoom in the sampled games. Round 2 should take a 60 fps track from a training-mode style clip if one exists.
- **Mid-stage single-hit kills** read 245 to 290%, above the ledge band. Full matches still average 160 to 215% at KO, matching the reference. The single-hit target is a soft 200 to 290.
