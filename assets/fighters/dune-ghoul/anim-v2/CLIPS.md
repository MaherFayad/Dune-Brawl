# Abu Sarab (dune-ghoul) v2 clips

- Concept: `a731d52e-c065-4ec0-a3b8-a2c22e38c445` (Nano Banana Pro, 16:9, 2k, old sheet `29226d73` attached). Take 2; take 1 (`6f19c814`) was nearly identical to the old sheet, not pushed to the new fidelity. Saved as `source/concept-v2.jpg`. Both takes carry a faded ghost bust next to the hero pose (generator artifact, ignore).
- Start pose: `e0a5356f-8404-4339-a9ef-92edeb540e74` (1 take). It came back filling 86% of the frame and in a steep three-quarter facing right (matches the concept's side view), so it was padded locally on flat magenta to 55% height and uploaded as media `6e0ac9c7-a8ec-4197-a1ee-624f58a3e47a`, which is the start (and end) frame of every clip. Saved keyed as `source/base-pose-v2.png`, portrait as `source/portrait-v2.png`.
- Clips: Kling 3.0, std, 3 s, 1:1, sound off, magenta screen, converted with `--magenta`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | 0c597d44-76a0-40c0-a978-7cbd239f7da9 | 1 | pass | Breathing, grin widens, lantern sways and glows; claw tapping is subtle. Loops. 24 f, 256, no trim. |
| run | 0d9c08ee-1ec1-4367-8453-ae37444f6f33 | 1 | pass | Heavy treadmill lope, centered, profile. Converted with `--skip=0.3` to drop the stance-to-run start. Two soft frames. 16 f, 256. |
| jump | 7057a47f-91d3-41b0-aee9-ceb81a638790 | 1 | pass | Crouch, modest straight-up hop with tucked hooves, deep heavy landing, back to stance; stays in frame. One soft frame on take-off. 16 f, 384, `--trim`. |
| hurt | 6b05d429-061b-46ed-a0d9-271582901bbc | 1 | pass | Ducks and cowers with both clawed arms over his face, ears pinned, then recovers. More a cower than a backward rock. One soft frame. 16 f, 256, `--trim`. |
| jab | a93760e2-2720-41d8-9a02-6a8f02a03ba5 | 1 | pass | Clear come-here beckon, then a fast forward claw swipe (two quick extensions) with a white smear; reads more as a claw jab than a backhand. One frame has a detached white flash at the claws. 16 f, 256, `--trim --motion`. |
| side_light | 50bfc403-4f21-45d7-8327-01b25e16f39a | 1 | pass | Palms pulled back, wide step, big two-palm shove at full extension with a sand puff, back to stance; profile throughout. The sand puff is cut by the right clip edge and the claw tips come within a few px of it. 24 f, 384, `--trim --motion`. |
| side_heavy | 8cf79511-9d11-4d7c-8377-027514c66a7b | 1 | flagged | Reads as the grab: hunches with both arms spread wide, lunges a big step and snaps both claws forward, stumbles, back to stance, in profile. But the wind-up is held about 0.8 s, the claws vanish inside a big sand burst for the snatch frames (one motion-blurred frame before it), and the burst is cut by the right clip edge (the body stays inside). No retake: the 70 credit cap for both fighters left no room. 40 f, 384, `--trim --motion`. |
| nair | f481efab-0ef4-422f-908f-dc62ca3b3212 | 1 | flagged | Hop, arms fling wide, curls into a sand-plate boulder spinning inside a white ring smear, uncurls with arms flung wide, lands in stance. But the front claws are cut by the right clip edge in about 12 frames (the arms-wide frames before and after the ball), the ball frames lose his face and claws, and 2 frames are blurry. No retake: credit cap. 24 f, 384, `--trim --motion`. |

Credits: 36 (2 concepts, 1 start pose, 8 clips at 3.75).
