# Timber (gorilla-lumberjack) clip log, v2

- Concept: `7b681a37-7795-43f9-9f43-71724d57c123` (Nano Banana, 16:9). `source/concept.jpg` is the 1600 px copy from `docs/characters/concepts/timber.jpg`.
- Start pose: `a1eb7b7c-cf43-4b41-b271-064d72adeb7d` (Nano Banana Pro, 1:1, 2k, concept attached; take 1). Red plaid, as the v2 brief says. Upright on two legs, with the axe on his right shoulder and his left knuckles hanging low.
- Margin start frame (Kling start and end image): media `79e13183-1d1c-4967-9d03-bb7b5f418a94`. This is the start pose scaled to 0.66 and centered on its own green (the take filled 80% of the height and the brief asks for 55%; now 53%). The scaling was done locally and cost no credits.
- Kling 3.0, std, 3 s, 1:1, sound off. Green screen, so no `--magenta` flag.

| Sheet | Kept job ID | Takes | Result | Note |
|---|---|---|---|---|
| idle | 7c07cc10-c74a-4a4f-9865-1d5dc88ab3c5 | 1 | pass | 24 f, 256 cell. Heavy breathing, the twig bobs, and he scratches his chin with his free knuckles. The axe stays on his shoulder. clip-check: ok. |

Missing: run, jump, hurt, jab, side_light, side_heavy and nair were not made because the lead ended the round before they were shot (the game uses stand-ins).
Final checks: `tools/edge-check.py` finds 0 cut sprites, and `tools/feather-cuts.py` softened 0 sheets.
Credits for this fighter: 2 (start pose) + 3.75 (1 clip) = 5.75.
