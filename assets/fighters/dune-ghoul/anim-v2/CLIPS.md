# Abu Sarab (dune-ghoul) v2 clips

- Concept: `a731d52e-c065-4ec0-a3b8-a2c22e38c445` (Nano Banana Pro, 16:9, 2k, old sheet `29226d73` attached). Take 2; take 1 (`6f19c814`) was nearly identical to the old sheet, not pushed to the new fidelity. Saved as `source/concept-v2.jpg`. Both takes carry a faded ghost bust next to the hero pose (generator artifact, ignore).
- Start pose: `e0a5356f-8404-4339-a9ef-92edeb540e74` (1 take). It came back filling 86% of the frame and in a steep three-quarter facing right (matches the concept's side view), so it was padded locally on flat magenta to 55% height and uploaded as media `6e0ac9c7-a8ec-4197-a1ee-624f58a3e47a`, which is the start (and end) frame of every clip. Saved keyed as `source/base-pose-v2.png`, portrait as `source/portrait-v2.png`.
- Clips: Kling 3.0, std, 3 s, 1:1, sound off, magenta screen, converted with `--magenta`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | 0c597d44-76a0-40c0-a978-7cbd239f7da9 | 1 | pass | Breathing, grin widens, lantern sways and glows; claw tapping is subtle. Loops. clip-check ok. 24 f, 256, no trim. |
| run | 0d9c08ee-1ec1-4367-8453-ae37444f6f33 | 1 | pass | Heavy treadmill lope, centered, profile. Converted with `--skip=0.3` to drop the stance-to-run start. Two soft frames. clip-check ok. 16 f, 256. |
| hurt | 6b05d429-061b-46ed-a0d9-271582901bbc | 1 | pass | Ducks and cowers with both clawed arms over his face, ears pinned, then recovers. More a cower than a backward rock. One soft frame. clip-check ok. 16 f, 256, `--trim`. |
| jump | 4d2d5b5d-81d8-4ba5-aff5-800997946da8 | 2 | pass | Re-shot from the wide start frame after take 1 (`7057a47f`) was CUT at the top. Crouch, launch, tuck, fall, heavy landing back to stance on the spot. Two soft frames (launch stretch and the fall). clip-check ok. 16 f, 384, `--trim`. |
| jab | a93760e2-2720-41d8-9a02-6a8f02a03ba5 | 1 | pass | Clear come-here beckon, then a fast forward claw swipe (two quick extensions) with a white smear; reads more as a claw jab than a backhand. One frame has a detached white flash at the claws. clip-check ok. 16 f, 256, `--trim --motion`. |
| side_light | 51d6d2db-60cb-4d7d-8c5c-34e5a5a4eb3a | 2 | pass | Re-shot from the wide start frame after take 1 (`50bfc403`) was CUT on the right (sand puff). Palms pulled back, step, then a big one-palm thrust at full extension (not the two-palm shove), back to stance, profile. clip-check ok. 24 f, 384, `--trim --motion`. |
| side_heavy | ed7a0209-8ed0-4c6f-bcee-8252874c7bd3 | 2 | pass | Re-shot from the wide start frame after take 1 (`8cf79511`) was CUT on the right (sand burst hid the claws). Arms-wide hunch, big lunging two-claw snatch at full reach with claws visible, stumble, back to stance. He squares toward the camera for the wind-up. clip-check ok. 40 f, 384, `--trim --motion`. |
| nair | 973114f3-0ee8-4f12-ad3d-738af0a4a039 | 2 | flagged | Re-shot from the wide start frame after take 1 (`f481efab`) was CUT on the right (claws). Hop, curls into a sand-plate boulder spinning inside a white ring smear, uncurls, lands in stance, all inside the clip. Flagged because the 3 ball frames hide his face and claws and are soft. clip-check ok. 24 f, 384, `--trim --motion`. |

- Start frames: idle, run, hurt and jab use the 55% start frame `6e0ac9c7`. After the lead's clip-check rule, jump, side_light, side_heavy and nair were re-shot from the wide start frame (`tools/wide-start.py`, fighter at 40% height, media `da9de548-7385-41be-887a-00783abe7bc9`).

Credits: 51 for this fighter (2 concepts, 1 start pose, 8 clips plus 4 re-shots at 3.75).

- Fix round: the planned nair re-shoot from the wide start frame `da9de548` (wide spinning claw swipe, arms out, face in profile) was not made; the shared 22-credit cap for this round ran out on Saif re-shoots. The flagged nair sheet `973114f3` stays.
