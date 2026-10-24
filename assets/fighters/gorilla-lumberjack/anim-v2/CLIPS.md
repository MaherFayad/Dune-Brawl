# Timber (gorilla-lumberjack) clip log, v2

- Concept: `7b681a37-7795-43f9-9f43-71724d57c123` (Nano Banana, 16:9). `source/concept.jpg` is the 1600 px copy from `docs/characters/concepts/timber.jpg`.
- Start pose: `a1eb7b7c-cf43-4b41-b271-064d72adeb7d` (Nano Banana Pro, 1:1, 2k, concept attached; take 1). Red plaid, as the v2 brief says. Upright on two legs, with the axe on his right shoulder and his left knuckles hanging low.
- Margin start frame (Kling start and end image): media `79e13183-1d1c-4967-9d03-bb7b5f418a94`. This is the start pose scaled to 0.66 and centered on its own green (the take filled 80% of the height and the brief asks for 55%; now 53%). The scaling was done locally and cost no credits.
- Wide start frame (start and end image for side_heavy and jab): media `1cd620fa-d9b2-4265-b487-8c2aeabcfba6`, built with `tools/wide-start.py source/base-pose.png --height 0.36` (fighter at x 0.36). A centered copy (`--x 0.5`) was uploaded as media `883f9ad7-8093-4cde-985b-1bf2ddea3490` for run but was not needed, since run passed clip-check from the normal start.
- Kling 3.0, std, 3 s, 1:1, sound off. Green screen, so no `--magenta` flag.

| Sheet | Kept job ID | Takes | Result | Note |
|---|---|---|---|---|
| idle | 7c07cc10-c74a-4a4f-9865-1d5dc88ab3c5 | 1 | pass | 24 f, 256 cell. Heavy breathing, the twig bobs, and he scratches his chin with his free knuckles. The axe stays on his shoulder. clip-check: ok. |
| run | dfbce4d8-d89b-4fb9-a146-39acbd4d18c1 | 1 | pass | 16 f, 256 cell, --skip=0.4 (drops the start from the ready pose). Start image only (normal margin frame 79e13183). Heavy lumbering in-place gorilla run, axe stays on his shoulder in every frame, side view, stays centered. clip-check ok. |
| side_heavy | 4c26c4a7-6326-4f88-a32d-7e30c1768560 | 2 | flagged | 40 f, 384 cell, --trim --motion, wide start frame. Axe raised overhead, step, huge overhead chop at full extension with a wood-chip burst and smear, back to ready; mostly profile. Flagged: the overhead hold is long (about 10 of 40 frames) and the axe head turns lilac and briefly double-bladed after the impact. Take 1 (33d6717a-4c13-48c0-95ad-79f65e53e0bd) turned his back to the camera through the wind-up. clip-check ok. |
| jab | 6675a69b-0f02-4678-8559-6e9d73d0047a | 1 | flagged | 16 f, --trim --motion, wide start frame, cell grew 256 -> 320. Quick forward axe chops with smear and spark bursts, side view, back to ready. Flagged: he chops twice instead of once, and in one frame a white burst hides the axe head. No credits left for a retake. clip-check ok. |

Missing: hurt, jump, side_light and nair. The fix round's credit cap ran out after run, side_heavy and jab (the game uses stand-ins).
Final checks (after the fix round): `tools/edge-check.py` finds 0 cut sprites, and `tools/feather-cuts.py` softened 0 sheets.
Credits for this fighter: 2 (start pose) + 3.75 (1 clip) = 5.75 in round 1; fix round 4 clips = 15 (run 1, side_heavy 2, jab 1).
