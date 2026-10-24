# Reference: match flow, UI and per-player effects (1440p footage)

Source: a second reference video, 10 min 22 s of casual 4-player free-for-all at 2560x1440 and 60 fps (three matches, three stages), studied from 1 fps overview sheets, 10 fps sequences and full-resolution crops. Frames stay in the scratch folder, never in the repo. This complements `REFERENCE-VFX.md` and `REFERENCE-MEASUREMENTS.md` (1v1 broadcast footage); where they overlap, the numbers agree.

## Match flow, in order

| Step | What the reference shows | Timing | Ours now |
|---|---|---|---|
| Lobby | Players wait on a stage with a "match begins in 3, 2, 1" note | about 5 s | Menu (no lobby) |
| Loading | One tall card per player in a row: arched frame, name in caps, a title line, the player's tag, full-body art, four stat bars with icons, a weapon icon pair; a "Loading..." bar on top; one gameplay tip along the bottom | about 6 s | Versus cards: arched frame, team gem, name, the bible title, full-body base pose, four stat bars (power, speed, air, weight), "LOADING..." bar, a tip; at least 1.6 s |
| Stage reveal | Camera fully zoomed out on the whole stage, fighters hanging on their carriers | about 3 s before the first numeral | Camera holds the whole stage through the countdown |
| Countdown | Italic numerals with a yellow to red gradient, dark red extrusion and thick outline. Each one ghosts in oversized and pale pink, slams to size within about 7 frames, holds, then cuts with a 1 frame gap | 42 frames per numeral | Same, `FEEL.countdown` 126 |
| Go word | The game's name word, arched, same style; ghosts in, holds, tilts and fades out | about 45 frames | "BRAWL!" arched, same timing |
| Fight | HUD in the top-right corner only: timer, then a round portrait per player with a damage-coloured arc and a stock or score digit | n/a | Same (already matched) |
| KO | Edge splash and cloud bank (see `REFERENCE-VFX.md`), plus a KO feed plate at top centre: scorer's portrait, scorer's name on a navy plate, an arrow, the fallen player's portrait | the plate stays about 3 s | KO feed plate, 170 frames, drops in and out |
| End | The last KO or the timer; the screen cuts to results about 3 s later | n/a | "GAME!" for 110 frames, then results |
| Results | "X WINS!" bar on top, a button row, one stone pillar per player (the winner's tallest) with the fighter standing on a glowing disc in a victory or idle pose, and a stats card with a rank tab: portrait, name, title, score, KOs, falls, accidents, damage done, damage taken | until a button | Same layout in our desert palette: sandstone pillars, team-colour disc, KOs, falls, accidents, damage done and taken |

## Per-player effects (the hook for custom fighter flair)

- **Weapon smears carry the weapon's colours.** Light-attack crescents are white on plain weapons and tinted on cosmetic ones.
- **The KO a player scores can end in their own emblem.** Seen at 2:44: instead of only the white splash, coloured paint streaks shoot up from the edge, then a giant emblem (a skull in headphones) rises over the cloud bank, holds about a second, and dissolves. The shared splash and cloud still play underneath.
- Everything else stays shared: white sparks, the damage-colour victim flash, the cloud trail, the off-screen bubble.

So a fighter's personality goes into four places: smear tint, small accents on their own hits and movement, their signature moves, and the KO they score. `game/flair.js` holds this per fighter. Vespera is the first: rose-tinted smears, a few petals on her hits (light pinks only, so they never read as drops of anything; CANON section 2), a parasol canopy on a parry, bats on dodges and on Bat Swarm, a shade ring when Nightfall lands, and her crest (parasol, bat wings, moon) over the KO cloud.

## Sound

Measured separately in `REFERENCE-SFX.md`. All of our sounds are synthesized in `game/audio.js`; nothing is taken from the reference.
