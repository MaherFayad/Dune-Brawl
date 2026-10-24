# Nawaf (falcon-rider) v2 clips

- Concept: `da9b219b-0c40-47e9-89c8-79477a5a779c` (Nano Banana Pro, 16:9, 2k, new design, 1 take). Lanky beardless teen in ivory and gold, leaf-blade spear, Muzna perched on top of his head with a smug scowl. The sheet drew a gauntlet on both hands and printed expression labels under the heads; the labels were painted out in `source/concept-v2.jpg` and the start pose prompt fixed the gauntlet to the rear arm only. No retake (credit cap).
- Start pose: `a288db5a-279a-40cc-868d-1ae8c8f2bc8d` (1 take). Clean side view facing right, Muzna on his head, spear diagonal forward. It filled 84% of the frame, so it was padded locally on flat green to 55% height and uploaded as media `cd4d03e9-4e73-4d02-bf72-52afe4d244d9`, the start (and end) frame of every clip. Saved keyed as `source/base-pose-v2.png`, portrait (boy and falcon) as `source/portrait-v2.png`.
- Clips: Kling 3.0, std, 3 s, 1:1, sound off, green screen.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | d33b505b-69ff-4607-be6c-7c53a77e8412 | 1 | pass (spliced) | Raw clip: he breathes, Muzna turns her head and scowls, but at about 1.9 s she hops up off his head for about 0.8 s. The sheet uses source frames 0 to 44 (always perched) played forward then back (`idle_splice.mp4` in the scratch folder), so it loops cleanly; the falcon motion is subtle. 24 f, 256, no trim. |
| run | 764500f3-823c-4875-b64c-10f5fe36d686 | 1 | pass | Gangly treadmill run, centered, profile, spear level; Muzna stays on his head the whole clip (crouches low on the wrap). Kling added a faint ground shadow (keyed out) and a few frames have ghosted legs. Converted with `--skip=0.3`. clip-check ok. 16 f, 256. |

Not made (round ended by the lead before they were shot; the game uses stand-ins): jump, hurt, jab, side_light, side_heavy, nair. A wide start frame for them was built (`tools/wide-start.py --height 0.34`) but its upload failed and was not retried.

Credits: 11.5 for this fighter (1 concept, 1 start pose, 2 clips at 3.75).
