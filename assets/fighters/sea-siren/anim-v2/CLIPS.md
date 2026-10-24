# Dana (sea-siren) v2 clip log

- Concept (Nano Banana Pro request, server ran Nano Banana 2, 16:9 2k): `75df8307-5a84-41de-964c-89d141968aa3` (take 2). Take 1 `7626ade1-28ce-4e65-b561-e61ba42127fa` rejected: three-quarter sleeves in the side view, neck uncovered, open collar. Take 2 note: the hero view shows a second shell on her back as well as the one in her hand; the side view (used for the start pose) is correct.
- Start pose (1:1 2k, magenta, concept as reference): `1f0e2460-82ed-4b67-9831-45d4b925373a`, 1 take.
- Clips: Kling 3.0 std, 3 s, 1:1, sound off, start pose as start image (and end image except run). Converted with `--magenta`.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| idle | 8e689758-7f80-4139-9086-e55c72c0cea9 | 1 | pass | Calm sway, pushes the wooden nose clip back into place mid-loop, returns to the start pose; shell on her back in every frame. 24 x 256. |
| run | 73331728-8229-4762-900e-4679ed16f65d | 1 | pass | Centered treadmill run, shell on her back throughout. First 0.6 s is the step-off from the stance, so converted with `--skip=0.6`. A few frames are soft from motion blur on the feet. 16 x 256. |
| hurt | b266f4b2-3929-445b-9a2c-352902ad5d9f | 1 | pass | Head snaps back with eyes shut and arms up, then a grimacing stagger back a step, recovers to the start pose. Readable but not huge; backward push should come from code. 16 x 256, --trim. |
| jump | a27cdeab-7a62-4cc2-87c4-cc15e3b4bba6 | 2 | pass | Take 1 (8aa89246-8af6-4592-aa4d-c2c299736d53) failed: mid-air the shell shrank and vanished and she morphed into a sprawled split. Take 2: crouch, upright rise, knee tuck, drop, crouched landing, back to stance; shell on her back throughout. Height is modest (about a third of her body), one rise frame slightly blurred. 16 x 384, --trim. |
| jab | 10734a30-58be-461a-89a9-046ac1fdf3aa | 1 | pass | Short chamber, then a straight open-palm strike at full extension, back to stance. The foam burst is tiny and tinted pink by the magenta screen (add a hit spark in code); the extension is held about 1 s, which --motion compresses. 16 x 256, --trim --motion. |
| side_light | c255dd0c-48df-45bc-a02d-c1a3fd7ecd8a | 1 | pass | Crouch, then a high straight front kick at full extension with a white spray smear that curls back down, returns to stance. Anticipation crouch is long (about 1.2 s; --motion spends few frames on it) and the forward step is small, so the lunge should come from code movement. 24 x 384, --trim --motion. |
| side_heavy | 98fa8db6-0799-4b4f-9f6a-78ca913b0009 (pending) | 1 | missing | Shell pulled off the back and swung overhead into a forward bash. Normal start frame, not the wide one. Job still "in_progress" about 45 min after submit (later jobs from other agents finished) when the round was ended; not downloaded, no sheet. When it lands: run tools/clip-check.py, and reshoot from the wide start (media 5c2eed32-c069-40ee-9cf9-50eb89131938) if CUT. |
| nair | - | 0 | missing | Not shot (round ended by the lead). Use the wide start frame. |

clip-check.py: idle, run, jump (both takes), hurt, jab, side_light all ok (no CUT).
edge-check.py on anim-v2/*.png: 0 sprites with cut edges. feather-cuts.py: 0 sheets changed.
Wide start frame for future attacks: `wide_sea-siren.png` (--magenta --height 0.34 --x 0.3), uploaded as media 5c2eed32-c069-40ee-9cf9-50eb89131938.
Credits: 3 images x 2 + 8 clips x 3.75 (including the pending side_heavy) = 36.
