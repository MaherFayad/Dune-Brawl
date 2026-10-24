# Saif (djinn-warrior) v2 clip log

- **Concept:** `a0afaec0-2b80-471b-b977-e40f33637ebd` (Nano Banana Pro request, the server ran Nano Banana 2; 16:9 2k). Take 1 of 2. Broad heroic build, long trailing indigo scarf, confident grin, Wahaj as a blue-flame face with two small flame arms rising from the saffron sash. The model wrote 4 expression labels under the heads; they were painted out locally (plain grey) before saving `source/concept-v2.jpg`. This sheet's side view has no Wahaj, so the start pose prompt names him explicitly. Take 2 `b388c88b-9122-4007-9e4e-01824d3bbbe9` was rejected: it still had labels, and it had bare arms and no sword in the side view.
- **Start pose:** `67d14cc2-2ed9-4316-ac66-ca7b62e791f6` (1:1 2k, green, take 1). Matches the concept: lunging ready stance, scimitar forward, Wahaj on the sash (on his back side in this view), scarf and sash ends trail behind. The figure came out too large (the blade almost touched the right edge), so it was scaled to 0.76 and re-centred on the same flat green locally, and uploaded as media `934414ae-ec10-4a50-96ce-4c3f00285d89`. **That upload is the start (and end) frame of every clip.** `source/base-pose-v2.png` and `source/portrait-v2.png` are cut from the full-size job output.

Kling 3.0, std, 3 s, 1:1, sound off, green screen. Preset `24bae836-2c4a-48e0-89b6-49fcc0b21612` declined on every clip.

| Sheet | Kept job ID | Takes | Result | Note |
|---|---|---|---|---|
| idle | 2212370d-8d30-447e-a39f-1ad117985335 | 1 | pass | 24 f, 256 cell. Gentle breathing bob; Wahaj laughs and Saif glances at it with a grin. Subtle, but design holds in every frame. |
| run | d6683c9d-a24f-43af-b90d-290456dbe64b | 1 | pass | 16 f, 256 cell, start frame only. Treadmill run, body centered, scarf and sash stream back, blade forward. Slight leg blur in 2 or 3 frames. |
| jump | 578b933d-0f3c-4444-b14a-fc539733ca03 | 1 | pass | 16 f, 384 cell, --trim. Crouch, straight-up hop with a knees-tucked peak, scarf flips up on the fall, lands in the ready stance; stays in frame (48 px top margin at the peak in the 960 px clip). Sheet frame 5 (launch) has a blurred blade. |
| hurt | c3760fb3-009c-488d-8eca-81ae26563e0c | 3 | pass | 16 f, 416 cell (grew from 256), --trim. Re-shot from the x 0.5 wide start frame (media `96ddaf33-9abe-44dc-9e81-583a3bbe2a08`). Big cartoon recoil: torso thrown back, head snapped back, arm flung up, knee up, mouth open, blade held back behind him, then snaps back to ready. The thrown-back pose is held for about 9 sheet frames; sheet frame 4 is a ghosted crossfade and frame 14 is soft. Take 2 `1937f999` was CUT on the left (scarf, 6 frames) and lost the blade; take 1 `dfd8114e` flinch too small. clip-check ok. |
| jab | 634bc5d3-0df9-47b8-a1bd-9ebefa5af0b3 | 2 | pass | 16 f, 352 cell, --trim --motion. Re-shot from the wide start frame (media `b0e5dfdd-057b-4b6a-a3ec-27bb465f8591`). Quick wrist cock, then a fast forward snap slash with a turquoise smear; blade visible in every frame. One ghosted crossfade frame at full extension. Take 1 `fbac867b` lost the blade for 4 frames. clip-check ok. |
| side_light | f618c981-184c-4f50-80c5-fd8f2d73e19a | 1 | pass | 24 f, 384 cell, --trim --motion. Blade raised, deep lunge, horizontal slash at full extension with a turquoise smear hugging the edge, back to ready. Sheet frame 7 (top of wind-up) is blurred; drop it in retiming. Blade reaches 44 px from the clip's right edge. |
| side_heavy | 48b82ea6-41cb-40ef-a2aa-91f21716465d | 2 | flagged | Unchanged sheet (take 1): 40 f, 384 cell. Overhead wind-up held about 16 frames with his chest turned to the camera; strike itself is big. Re-shoot take 2 `3bace4fc-366a-41f7-ad3c-bfe9225d785c` (wide start frame) had a short wind-up and a big lunge slash, but its smear trail touched the right border in one frame (CUT) and the wind-up still turned toward the camera, so it was not kept. No third take: credit cap. Next try: wide start at --height 0.34 so the smear stays inside. |
| nair | d0505699-8e02-4b75-884b-9167982760cf | 2 | pass | 24 f, 384 cell, --trim --motion. Shot from the wide start frame (media `b0e5dfdd-057b-4b6a-a3ec-27bb465f8591`). Crouch, hop, full overhead-to-front blade circle in mid-air with a turquoise smear, lands in the ready stance; stays in profile, blade visible (ghosted in 2 or 3 swing frames). Take 1 `a7b581a1-51cb-457a-82dd-72738dea1b94` completed and was clip-check ok but rejected: low hop, he spins to face the camera and the blade disappears in the spin frames. clip-check ok. |

## Checks (end of round)

- `tools/clip-check.py`: ok for idle, run, jump, hurt, jab, side_light, side_heavy (no art touches the clip border; the rescaled start frame keeps wide margins).
- `tools/edge-check.py`: idle, run, hurt and jab first touched the left of their cells (long scarf tail behind the pivot). They were re-converted from the same clips with the same flags using the updated converter, which grew the cells: idle, run and hurt to 288, jab to 384. After that: 0 sprites with cut edges.
- `tools/feather-cuts.py`: softened one cut, run.png frame 13 (left edge, 23 px). Edge-check still clean afterwards.

## Fix round (wide start frames)

- Wide start frames (`tools/wide-start.py base-pose-v2.png`, fighter at 40% height): `b0e5dfdd-057b-4b6a-a3ec-27bb465f8591` (x 0.36, attacks and nair) and `96ddaf33-9abe-44dc-9e81-583a3bbe2a08` (x 0.5, hurt, more room behind him). These sheets get scale 0.332 from the wide frame; the converter normalises the ready pose to the same 128 px body height, so they match the older sheets.
- Re-shot: nair, jab, hurt. side_heavy re-shoot was CUT and the old sheet stays.
- `tools/edge-check.py`: 0 sprites with cut edges. `tools/feather-cuts.py`: 0 sheets softened. index.json now lists nair.
- Credits this round: 20.25 (nair take 2 ran with sound on by mistake, 5.25; four more clips at 3.75).
