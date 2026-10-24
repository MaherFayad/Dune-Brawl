# Finjan (fennec-host) clips, v2

Concept job: `e5e6cb28-233a-4dcb-b6ff-a3508de9ee90` (docs/characters/concepts/finjan.jpg).
Start pose job: `7ed85160-559c-4a3a-86f7-adaf3c454cb7` (Nano Banana Pro requested, 1:1 2k; server ran Nano Banana 2). Take 2 of 2: take 1 (`c7dfcce0-3120-4ea3-bfe0-175279e8d6a3`) matched the design but dropped the dallah. Take 2 holds the dallah over his shoulder, spout back. The figure fills about 75% of the frame height rather than 55%, which leaves too little room for the pot swings (see jab and side_light).

Kling 3.0, std, 3 s, 1:1, sound off, start and end image = the start pose (run: start only). Pure magenta, converted with `--magenta`. Clips and contact sheets: scratch folder `art-b/finjan/`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | 9b5e80f6-a733-4531-91d4-01986276f656 | 2 | pass, clip-check ok | Re-shoot from the wide idle frame (tools/wide-start.py --height 0.36 --x 0.5, uploaded media `c767564c-9a0d-4e92-b286-4b966db27f24`). Bounces, ears twitch, pats the pot, smug grin; turns slightly toward camera for a few frames. Take 1 (`907fe036`) was CUT: steam from the pot left the top edge (54 frames). 24 f, 256 cell. |
| run | 7f15449a-0327-4a36-ab1a-024da4e817d9 | 1 | pass, clip-check ok | Treadmill scamper, centered, side view; faint foot shadow and some leg ghosting. First 1 to 2 frames are the stance-to-run transition. 16 f, 256 cell. |
| hurt | 6b8b89fd-1ba1-43cf-99ef-4747b86cdcae | 1 | flagged, clip-check ok | Stays in frame, but the flinch is small: a lean back with eyes squeezed shut that reads close to a smug grin. Wants a bigger retake. 16 f, 256 cell, --trim. |
| jump | (none kept) | 1 | missing | Take `c04a632e-2267-4fe4-94e7-40efd2a02ec6` was CUT (ears through the top, 11 frames); sheet removed. Re-shoot from the wide start frame next round. |
| jab | (none kept) | 1 | missing | Take `9a6f507f-88db-40ea-8744-6f1c51c58642` was CUT (pot past the left and right edges) with a mushy smear frame; sheet removed. |
| side_light | (none kept) | 1 | missing | Take `dd26cdcb-b5cb-4d4d-9628-cc3a3cc8482b` was CUT (finial through the top, 22 frames) and never struck forward (lifted the pot overhead); sheet removed. |
| side_heavy | (none kept) | 1 | missing | Take `7e9d17e7-40a1-47e7-8ead-8a13de6d7f4d` was CUT (steam and pot past the top and left) and punched empty-handed while the pot stayed on his shoulder; sheet removed. |
| nair | (none kept) | 1 | missing | Take `11f47c49-4484-469d-ab51-b0016d64eb94` was CUT (head and ears through the top, 22 frames), though the spin itself was good (pot whirls in a ring smear); sheet removed. Best candidate for a wide-frame re-shoot. |

Next round: shoot every attack and the jump from the wide frame `wide_fennec-host.png` (tools/wide-start.py --height 0.36). The start pose holds the pot slung over the shoulder with the spout back, so attack prompts must say clearly that he lifts the pot off the shoulder and swings it forward.

Checks after this round: tools/edge-check.py 0 sprites with cut edges; tools/feather-cuts.py 0 sheets softened.
