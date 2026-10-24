# Tiktak (clockwork-elephant) clips, v2

Concept job: `9fc3c11d-278a-420b-bacd-504ca4ef10ba` (docs/characters/concepts/tiktak.jpg).
Start pose job: `1af56d8d-34b9-4469-ba7d-0a7558c2f621` (Nano Banana Pro requested, 1:1 2k; server ran Nano Banana 2). One take: upright on two legs, matching the concept's side view (gong ears, gear dome, monkey on its head, fists raised); the chest clock is hidden in profile, so no numerals show. It filled 82% of the frame height, so it was keyed and shrunk locally to 55% on a #FF00FF canvas (no generation) and uploaded as media `573ceba4-75cd-41d4-b5d1-81c5dcd22503`; that upload is the start (and end) image for every clip below. source/base-pose.png and portrait.png come from the unshrunk job image.

Kling 3.0, std, 3 s, 1:1, sound off. Pure magenta, converted with `--magenta`. Clips and contact sheets: scratch folder `art-b/tiktak/`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | d07fcf6f-e3ab-4f56-ad4e-5493820ec596 | 1 | pass, clip-check ok | Weight sway, trunk sway, the monkey turns and points forward; the gear tick is subtle at sprite size. Loops. 24 f, 256 cell. |
| run | f25d8c91-bdbe-48de-a474-762a3e005c45 | 1 | flagged, clip-check ok | Heavy in-place run, stays in frame, but the clip zooms in about 25% after the first frame, so the sheet draws Tiktak larger than its other sheets, and it swings toward three-quarter view in several frames. Start image only. 16 f, 256 cell. |
| jump | 72756281-ea8f-486b-84ea-0c7c86567c2a | 1 | pass, clip-check ok | Crouch, low hop with ears flapping, heavy landing on the same spot; squares toward the camera at the apex. 16 f, 384 cell, --trim. |
| jab | 32a08d63-9c96-4241-b5d9-bcfbdaafc74c | 1 (round 3) | pass, clip-check ok | From the wide frame (tools/wide-start.py --height 0.4 --magenta on source/base-pose.png, uploaded media `4baeb8d5-ccde-4fdf-8ba2-e7475f994655`). Upright on two legs, side view, a straight punch with the front fist at full extension, trunk and monkey visible, no chest numerals. Long-ish small anticipation before the punch. 16 f, 256 cell, --trim --motion. |
| side_heavy | (none kept) | 1 (round 3) | missing | Take `09ce46cb-fa04-4356-a8ac-c3d8904c9df7` was CUT (a white impact burst flew off the right edge, 7 frames) despite "no visual effects" in the prompt; the punch with the trunk whip was otherwise good. No credits for a retake. |
| hurt, side_light, nair | (not made) | 0 | missing | Credit cap reached in round 3. Shoot from the same wide frame media `4baeb8d5-ccde-4fdf-8ba2-e7475f994655`. |

Round 3 clips and contact sheets: scratch folder `fix-e/tiktak/`.

Checks after round 3: tools/edge-check.py 0 sprites with cut edges; tools/feather-cuts.py 0 sheets softened.
