# Vespera (vampire-countess) clip log, v2

- Concept: `fac85560-b04b-465a-b95e-fc7cde8b2a42` (Nano Banana, 16:9). `source/concept.jpg` is the 1600 px copy from `docs/characters/concepts/vespera.jpg`.
- Start pose: `31169c4b-61bd-485a-adf3-19647fdd2683` (Nano Banana Pro, 1:1, 2k, concept attached; take 2). Take 1 `beb5672b-11ae-4fe9-8fd8-94be2f599145` had the fixes but faced left, so it was rejected.
  Brief fixes applied: whole red pomegranate in her left hand (no goblet or glass), high-necked bodice closed to the collar, one furled black lace parasol whose tip is the silver rapier blade, with a swept cup guard at the handle.
- Margin start frame (Kling start and end image): media `d4a2e785-42d9-4cdf-a41d-38505fb86542`. This is the start pose scaled to 0.66 and centered on its own green (the take filled 76% of the height and the brief asks for 55%; now 50%). The scaling was done locally and cost no credits.
- Kling 3.0, std, 3 s, 1:1, sound off. Green screen, so no `--magenta` flag.

| Sheet | Kept job ID | Takes | Result | Note |
|---|---|---|---|---|
| idle | 68858f13-72e8-4a84-9d71-75219952514b | 1 | pass | 24 f, 256 cell. She wafts the furled parasol by her face like a fan, twice, and sighs. The cape sways, and the pomegranate and blade are visible throughout. |
| run | ed8cf987-1bb7-4546-9f98-b1aae1fc4e48 | 1 | pass | 16 f, 256 cell, start image only, `--skip=0.4` (drops the step out of the ready pose). Gliding treadmill run with the gown and cape billowing. Slight softness on the hem in a few frames. |
| jump | 0c2a05ea-4e31-4d84-8d1f-e997112d7207 | 1 | flagged | 16 f, 384 cell, `--trim`. Crouch, straight-up hop, tuck, land, all inside the frame. In the airborne frames the parasol disappears into the cape, the pomegranate switches to her right hand, and one rising frame is a motion-blur ghost. |
| hurt | 80d9ed4e-1044-4d34-8393-904c162953ee | 1 | pass | 16 f, 256 cell, `--trim`. Head snaps back, body bends backward, eyes squeezed shut, then a huff back to ready. The flinch is medium-sized rather than huge, with light blur on the two snap frames. |
| jab | 1ab1c946-0a16-49b2-8526-2ad17fbcda91 | 1 | pass | 16 f, 256 cell, `--trim --motion`. Small pull-back, then a straight thrust with the arm fully extended and the blade level. It holds the extension for about 1 s (retime in code if needed) and has no smear. |
| side_light | 670305ad-9595-4e49-8dd4-8fc141774b86 | 1 | pass | 24 f, 384 cell, `--trim --motion`. Raises the parasol, then a deep fencer's lunge with a step, full extension and a thin smear along the blade, then back to ready. One transition frame is blurred, and the extension is held for about 1 s. |
| side_heavy | d3024cab-f541-4222-bc6b-d0340b906ac6 | 1 | flagged | 40 f, 384 cell, `--trim --motion`. The wind-up is long (about 0.9 s), and during it she turns toward the camera (the cape swings in front of her). The strike is a level thrust at about jab height with a crimson smear at the tip, not the big overhead arc and lunge. |
| nair | 24e5db92-4ca7-453b-b8a1-0fac2cfdb310 | 1 | pass | 24 f, 384 cell, `--trim --motion`. Hop, then a full white slash ring around her, landing centered. She faces the camera briefly mid-spin, and the parasol smears in two frames. |
