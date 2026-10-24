# Finjan (fennec-host) clips, v2

Concept job: `e5e6cb28-233a-4dcb-b6ff-a3508de9ee90` (docs/characters/concepts/finjan.jpg).
Start pose job (round 3): `061f77db-7b52-441d-add0-85a1c87e07b4` (Nano Banana Pro requested, 1:1 2k, concept attached; server ran Nano Banana 2). One take: side view facing right, springy stance, the brass dallah held in front of his chest by the handle with the spout forward, ears upright. Keyed and saved as source/base-pose.png (replaced; portrait.png and concept.jpg unchanged). It fills 77% of the frame height, so attacks and the jump use the wide frame built from it: tools/wide-start.py --height 0.36 --magenta, uploaded as media `01a9beda-0c2a-4b4f-a9dd-93a5ad36158f` (start and end image for every round-3 clip).
Old start pose job: `7ed85160-559c-4a3a-86f7-adaf3c454cb7` (pot slung over the shoulder, spout back). idle, run and hurt still come from it (credits ran out before re-shooting them), so in those three sheets the pot sits on his shoulder.

Kling 3.0, std, 3 s, 1:1, sound off. Pure magenta, converted with `--magenta`. Round-3 clips and contact sheets: scratch folder `fix-e/finjan/`; older ones in `art-b/finjan/`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | 9b5e80f6-a733-4531-91d4-01986276f656 | 2 | pass, clip-check ok | Old start pose (pot on shoulder); not re-shot in round 3 (no credits left). Bounces, ears twitch, pats the pot, smug grin; turns slightly toward camera for a few frames. 24 f, 256 cell. |
| run | 7f15449a-0327-4a36-ab1a-024da4e817d9 | 1 | pass, clip-check ok | Old start pose; not re-shot. Treadmill scamper, centered, side view; faint foot shadow and some leg ghosting. 16 f, 256 cell. |
| hurt | 6b8b89fd-1ba1-43cf-99ef-4747b86cdcae | 1 | flagged, clip-check ok | Old start pose; not re-shot. The flinch is small. 16 f, 256 cell, --trim. |
| jump | 19f7c28b-164d-41e2-b65a-054fcc0229a5 | 1 (round 3) | pass, clip-check ok | Wide frame. Crouch, straight hop, tuck with the pot hugged in front, lands on the same spot; ears well inside the frame. One blurry takeoff frame. 16 f, 384 cell, --trim. |
| jab | ab8c2d3e-8bf4-49f7-9946-0f844d09ee17 | 1 (round 3) | pass, clip-check ok | Wide frame. Short forward thrust of the pot at arm's length with a thin trail; side view. The first half is a small rocking anticipation, the thrust lands late. 16 f, 256 cell, --trim --motion. |
| side_light | c3317d23-93da-48ce-b6eb-2057ebc9b79f | 1 (round 3) | pass, clip-check ok | Wide frame. Big lunge step, pot swung forward to full extension at chest height, back to ready. Turns three-quarter toward the camera for about 4 frames in the wind-up. 24 f, 384 cell, --trim --motion. |
| side_heavy | (none kept) | 3 (round 3) | missing | All three takes CUT on the right edge by a detached impact effect, even with "no visual effects" in the prompt: `f85a6981-14ec-4706-85bb-e705380207e0` (smear ring, 8 frames; also turned to camera), `2e8057a4-0209-40d8-ac68-4d238745d0cc` (wind streak, 5 frames), `9248f700-bd2d-460f-9d92-5c50405c77de` (white puff, 2 frames). The swing itself was good in takes 2 and 3 (pot overhead, smashed forward). Older take `7e9d17e7` also CUT. |
| nair | 63a8e086-0efb-4979-b83a-146a4eae2581 | 1 (round 3) | flagged, clip-check ok | Wide frame. Hop, full mid-air spin with the pot whirling in a ring smear, lands in place. Spin frames are soft and ghosted, he shows his back for a few frames and the pot is hidden in 2 to 3 frames. 24 f, 384 cell, --trim --motion. |

Next round: side_heavy (try --x 0.3 or a lower-energy prompt such as a "downward pot slam" so Kling stops adding a flying impact puff), then re-shoot idle, run and hurt from the new pose (idle and run from the new keyed pose at 55%, hurt from the wide frame) so the pot matches across sheets.

Checks after round 3: tools/edge-check.py 0 sprites with cut edges; tools/feather-cuts.py 0 sheets softened.
