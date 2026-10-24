# Saif (djinn-warrior) v2 clip log

- **Concept:** `a0afaec0-2b80-471b-b977-e40f33637ebd` (Nano Banana Pro request, the server ran Nano Banana 2; 16:9 2k). Take 1 of 2. Broad heroic build, long trailing indigo scarf, confident grin, Wahaj as a blue-flame face with two small flame arms rising from the saffron sash. The model wrote 4 expression labels under the heads; they were painted out locally (plain grey) before saving `source/concept-v2.jpg`. This sheet's side view has no Wahaj, so the start pose prompt names him explicitly. Take 2 `b388c88b-9122-4007-9e4e-01824d3bbbe9` was rejected: it still had labels, and it had bare arms and no sword in the side view.
- **Start pose:** `67d14cc2-2ed9-4316-ac66-ca7b62e791f6` (1:1 2k, green, take 1). Matches the concept: lunging ready stance, scimitar forward, Wahaj on the sash (on his back side in this view), scarf and sash ends trail behind. The figure came out too large (the blade almost touched the right edge), so it was scaled to 0.76 and re-centred on the same flat green locally, and uploaded as media `934414ae-ec10-4a50-96ce-4c3f00285d89`. **That upload is the start (and end) frame of every clip.** `source/base-pose-v2.png` and `source/portrait-v2.png` are cut from the full-size job output.

Kling 3.0, std, 3 s, 1:1, sound off, green screen. Preset `24bae836-2c4a-48e0-89b6-49fcc0b21612` declined on every clip.

| Sheet | Kept job ID | Takes | Result | Note |
|---|---|---|---|---|
| idle | 2212370d-8d30-447e-a39f-1ad117985335 | 1 | pass | 24 f, 256 cell. Gentle breathing bob; Wahaj laughs and Saif glances at it with a grin. Subtle, but design holds in every frame. |
| run | d6683c9d-a24f-43af-b90d-290456dbe64b | 1 | pass | 16 f, 256 cell, start frame only. Treadmill run, body centered, scarf and sash stream back, blade forward. Slight leg blur in 2 or 3 frames. |
| jump | 578b933d-0f3c-4444-b14a-fc539733ca03 | 1 | pass | 16 f, 384 cell, --trim. Crouch, straight-up hop with a knees-tucked peak, scarf flips up on the fall, lands in the ready stance; stays in frame (48 px top margin at the peak in the 960 px clip). Sheet frame 5 (launch) has a blurred blade. |
