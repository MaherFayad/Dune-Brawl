# Dana (sea-siren) clip log

Kling 3.0, std, 1:1, sound off, from margin start frame `efa3642d-b997-476d-9866-16e7831e2dbc` (also the end frame unless noted). Shell is a code prop: every clip has empty hands and nothing thrown.

| Sheet | Job ID kept | Takes | Result | Note |
|---|---|---|---|---|
| side_light | (earlier session) | - | pass | Made before this log. |
| side_heavy | (earlier session) | - | pass | Made before this log. |
| jab | a32a2f38-5a06-453b-9810-fada19027a02 | 1 | pass | Clean palm push with a big foam burst; converted at 384 so the foam is not cut by the cell. |
| up_light | 9984cf97-165d-41b5-be23-343a7eb9f75c | 1 | pass | Crouch, wide two-arm overhead arc with a curling water crest, clean return. |
| down_light | 56818016-e6a0-458e-9239-65d7e6232202 | 2 | pass | Take 1 was a static lunge with the wave behind her. Take 2: squat, low forward sweep, wave curls up in front; the wave tip touches the clip's right edge at its peak (body inside). Converted at 384. |
| nair | ae0fcc4e-710f-4345-a94b-a4ba5c3a45bd | 1 | pass | Hop, one spin with a water ring at the waist (back view for 2 to 3 frames mid-spin), lands in stance. Long slow squat fills about half the sheet; trim in retiming. |
| down_heavy | 028450fc-2656-4d07-bca2-fc489fc97b68 | 1 | pass | Palms raised high and held (standing, not crouched), slams down into a crouch, splash and flat water ring to both sides, rises back. |
| dair | 7d0cd6dc-4de1-4636-b0e1-60bef43c1657 | 3 | pass | Take 1 (f6043970) passed the old check but its strike was just landing upright in a splash (failed the new strike-size rule). Take 2 (ec08c776) kicked forward like a flying sit kick. Take 3: high hop, tight tuck, then a vertical pencil plunge, arms up and boots straight down, with a splash crown at the heels; apex 22 px from the top of the clip but inside. |
| recovery | 8859f6e2-3558-4e52-ae46-1e7b6c351c11 | 1 | pass | Crouch with palms together, arms pressed straight overhead, short rise in a swirling water column (reads as a water aura more than separate bubbles), lands in stance. Stays clear of the top edge. The rise is only about 6 of 48 frames; long crouch and settle to trim in retiming. |
| idle | 291beabb-0b9d-4f8c-89e0-7b3764587b73 | 1 | pass | Gentle breathing sway, 1 to 3 px at sheet scale, headwrap tail moves a little; first and last frames match so it loops cleanly. Start and end frame both set. |
| hook_call | 815dbdae-b00d-492f-a327-7cc706c9f5a2 | 2 | pass | Take 1 grew a dark ground shadow and had no cupped hand. Take 2: front hand cupped at the mouth while she sings, back hand open with sea mist curling off it. The open hand reaches back and down rather than forward toward the shell; mirror or re-anchor the summon hand in code if the shell is in front. |
| run | 04cf79d7-a88f-413f-b8f4-9f4ebede2e9a | 1 | pass | Centered treadmill run, two strides per cycle. The clip spends its first second getting from stance into the run, so the sheet is one clean loop cut from source frames 33 to 61 (29 frames, not 32), scaled from the clip's ready frame like every other sheet. |
| jump | 5c31a8d6-bb88-4a60-8714-40c4be6a6087 | 1 | pass | Crouch, straight rise with arms up and tail flaring, fall, crouched landing, back to stance; stays well inside the frame. Airborne part is short (about 12 of 73 source frames), so rise and fall get only a few frames each when split in code; slight motion blur at the apex. |
| land | 6d84f6b2-96fd-40d9-98ed-0f0b4254fb94 | 1 | pass | Clip is a small hop then a toes-first landing into a deep, balanced knee bend with arms out, then a rise. Sheet built from source frames 34 to 63 only (falling into touchdown, then settle), scaled from the clip's ready frame. |
| hurt | e1276d46-159d-47d7-9366-e875b36fa626 | 1 | pass | Snaps into a tight diver's tuck (one knee down, arms pulled to the chest, head bowed), holds, recovers. Matches the bible's curl; little backward knockback, so the push comes from code. Middle held frames make the hitstun loop. |
| tumble | 764b5659-0c36-41a7-8dbf-29fbe1429fe5 | 1 | pass | Knocked back, then a tight heels-over-head tuck spinning in place. Sheet is one clean rotation, source frames 33 to 48 (16 frames, not 24), scaled from the ready frame; a few frames are soft from motion blur. |
| victory | de70623b-d970-4a99-bd32-478dfbe111b3 | 1 | pass | 5 s, start frame only. Raises an open hand into a swirling ring of water, brings the palm to her shoulder, bows her head with bubbles rising, holds. She shuffles a couple of steps in place in the first second (sheet frames 1 to 10); start the game sheet after that if it looks odd. Ring stays 32 px inside the top edge. |
| taunt | 65e96b20-6f8f-4f8e-9f93-634fdfba7e95 | 1 | pass | 5 s. Cups her front hand at her mouth, chin up, sings with blue mist curls rising from the hand, returns to stance. The heel-to-toe rocking is subtle. Same pose family as hook_call, which keeps them consistent. |

Notes:
- After the coordinator's "bigger attacks" update, every attack sheet made in this session (jab, down_light, up_light, nair, down_heavy, dair, recovery) was reconverted with `--trim --motion`. side_light and side_heavy are from the earlier session and were not touched.
- Cells: 384 for jab and down_light (the water effect is cut at 256), nair, down_heavy, recovery and victory; 256 for the rest.
- run, land and tumble were cut to a source span (logged per row): the ready frame was prepended for scale and then dropped from the sheet, so the scale and pivot match every other sheet.
- Credits this session: 18 clips x 3.75 + 2 x 6.25 = 80.
