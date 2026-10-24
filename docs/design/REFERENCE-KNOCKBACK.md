# Reference knockback: when a hit sends far

Status: IN PROGRESS (partial table, analysis and tuning still being filled in).

Source: the reference tournament video (copyrighted; no frames or clips are kept in the repo). Units: **bodies** (fighter standing height in that frame) and **frames at 60 fps**. Damage is read from the HUD ring colour, converted to a continuous scale (white 0, yellow 50, orange 100, red 150, dark red 200).

## Summary rules (draft)

- Damage is the master switch. Below yellow (under ~50) almost nothing travels more than 2 to 3 bodies, even big committed moves.
- Light hits stay short at every damage. At red, a light poke still moves the victim under 1 body; that is how a combo string holds a red-ring victim in place.
- Only the finishing hit of a string launches. At orange and red one committed hit sends the victim 5 to 12 bodies in about half a second.
- Launches are fast and front-loaded: the victim leaves on the first frame after contact, then decelerates; most of the distance is covered in the first 0.25 s.
- KOs come from position as much as damage: a launcher that starts near a blast zone or below ledge height kills at orange (even 80 once), while the same hit from centre stage at red is survived.

## Hit table (partial)

| # | Time | G | Attacker | Att. | Attack size | Victim | Dmg (ring) | Victim state | Bodies 0.5 s | Bodies 1 s | Angle | Hit pause (f) | KO | Cues | Conf. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0:31.6 | 1 | Sandstorm | air | mid (string ender) | Pavelski | 95 yellow | air | 5 | 6.5 | flat | - | no | smoke trail, camera pans | M |
| 2 | 0:41.7 | 1 | Sandstorm | air | big side swing | Pavelski | 134 orange | air | 7 | 9+ | flat | 4 to 5 before contact, 0 after | no | red flash, smoke trail, camera pans | M |
| 3 | 0:51.6 | 1 | Sandstorm | air | small poke | Pavelski | 164 red | ground | <0.5 | <0.5 | none | - | no | none | M |
| 4 | 0:53.7 | 1 | Sandstorm | air | small (1st of 2) | Pavelski | 171 red | air | 0.1 | - | none | 5 | no | red flash | H |
| 5 | 0:53.9 | 1 | Sandstorm | air | mid kick (2nd of 2) | Pavelski | 175 red | air | 6 | 9+ (off screen) | flat | 0 (victim moves next frame) | no | red flash, long smoke, camera pans | M |
| 6 | 0:58.8 | 1 | Sandstorm | air | side swing | Pavelski | 198 red | air, near left edge | KO | - | flat | - | KO 0.33 s | smoke, off-screen bubble | M |
| 7 | 1:27.9 | 1 | Pavelski | ground | mid swing | Sandstorm | 79 yellow | ground at ledge | 4 | 3 (recovering) | down-diagonal | - | no | none | L |
| 8 | 1:42.5 | 1 | Sandstorm | air | down attack | Pavelski | 80 yellow | air off stage | 5 | 5 | down (spike) | - | no | none | L |
| 9 | 1:48.6 | 1 | Sandstorm | air | side (string ender) | Pavelski | 143 orange | air, 7 bodies past ledge | 5+ | KO | flat | - | KO 0.5 s | red flash, smoke, KO burst | M |
| 10 | 2:03.7 | 1 | Pavelski | ground | 2-hit swing | Sandstorm | 136 orange | ground near ledge | 4.5 | 7 | down-diagonal | - | no | red flash | M |
| 11 | 2:05.8 | 1 | Pavelski | air | side air | Sandstorm | 150 red | air off stage | 5 at 0.25 s | KO | down-diagonal | - | KO 0.93 s | red flash, smoke | M |
| 12 | 2:16.0 | 1 | Pavelski | air | big spinning special | Sandstorm | 10 white | air | 3 to 4 | ? | diagonal | - | no | none | L |
| 13 | 2:20.7 | 1 | Sandstorm | air | mid | Pavelski | 2 white | air | 2 to 3 | - | down | - | no | none | L |
| 14 | 2:41.0 | 1 | Pavelski | air | big spinning special | Sandstorm | 90 yellow | air | 3 | 3.5 | down-diagonal | - | no | smoke trail | M |
| 15 | 2:44.6 | 1 | Pavelski | ground | mid swing | Sandstorm | 111 orange | air | 3 | 3 | up-diagonal | - | no | orange flash | M |
| 16 | 2:49.5 | 1 | Pavelski | air | up attack | Sandstorm | 153 red | air | off top in 0.12 s | KO | up | - | KO 0.62 s | red flash, smoke column | M |
| 17 | 3:03.3 | 1 | Sandstorm | air | side | Pavelski | 130 orange | air off ledge | 6+ | 8+ | flat | - | no | red flash, smoke | M |
| 18 | 3:13.7 | 1 | Sandstorm | ground | up attack | Pavelski | 157 red | air | 4 | 4 | up | - | no | red flash | M |
| 19 | 3:25.4 | 1 | Sandstorm | air | grab-like hold, then side launch | Pavelski | 169 red | air | 12 (at 0.7 s) | - | flat | held 20 f, then 0 | no | red flash, very long smoke, camera pans | M |
| 20 | 3:36.7 | 1 | Sandstorm | air | multi-hit, then launch | Pavelski | 181 red | air off stage | - | off screen | flat | - | KO 1.05 s | smoke, off-screen bubble | M |
| 21 | 4:06.7 | 2 | Pavelski | ground | string of small hits | Sandstorm | 64 yellow | ground | <1 | <1 | none | - | no | yellow flash | H |
| 22 | 4:19.5 | 2 | Pavelski | ground | big swing | Sandstorm | 130 orange | ground | 4 | 0 (landed) | up | - | no | red flash, small puffs | M |
| 23 | 4:28.9 | 2 | Sandstorm | ground | up attack | Pavelski | 119 orange | ground at ledge | 2.5 | - | up | - | no | red flash | M |
| 24 | 4:32.3 | 2 | Sandstorm | air | down attack | Pavelski | 136 orange | air below ledge | off bottom | KO | down (spike) | - | KO 0.54 s | red flash | M |
| 25 | 4:47.1 | 2 | Pavelski | air | side air | Sandstorm | 169 red | air below ledge height | 5 at 0.25 s | KO | down-diagonal | - | KO 0.6 s | red flash, smoke | M |
| 26 | 4:56.1 | 2 | Sandstorm | ground | string | Pavelski | 13 white | ground | 1.5 | 1 | up | - | no | none | M |
| 27 | 5:02.6 | 2 | Pavelski | air | down air | Sandstorm | 12 white | air | 2 at 0.25 s | - | up-diagonal | - | no | pale flash | L |
| 28 | 5:10.5 | 2 | Pavelski | air | big spinning special | Sandstorm | 80 yellow | air, already near top-left corner | off screen in 0.25 s | KO | up-diagonal | - | KO 0.51 s | orange flash | M |
| 29 | 5:40.8 | 2 | Sandstorm | ground | big slide | Pavelski | 127 orange | air (low) | 10 | off screen | up-diagonal (30 deg) | - | no | red flash, smoke, zoom out | M |
| 30 | 5:53.0 | 2 | Sandstorm | ground | big swing | Pavelski | 151 red | air (low) | 6.5 | 7 | up-diagonal | - | no | red flash, smoke | M |
| 31 | 6:03.3 | 2 | Sandstorm | air | string of 3 small hits | Pavelski | 168 red | air | <1 per hit | - | none | - | no (KO 0.8 s later by the ender) | red flash on every hit | M |
| 32 | 6:25.1 | 2 | Pavelski | ground | side heavy | Sandstorm | 152 red | ground | 7.5 | 9.5 | flat | - | no | red flash, smoke | M |
| 33 | 6:31.3 | 2 | Pavelski | air | side/down air | Sandstorm | 161 red | air | 5+ | off screen | down-diagonal | - | no | red flash, smoke | M |
| 34 | 6:50.1 | 3 | Pavelski | ground | up attack (big) | Sandstorm | 10 white | ground | 3 | 0 (landed) | up | - | no | white flash | M |
| 35 | 6:58.2 | 3 | Sandstorm | ground | up attack | Pavelski | 9 white | air | 1.5 | - | up | - | no | none | M |
| 36 | 7:14.9 | 3 | Sandstorm | ground | string | Pavelski | 81 yellow | ground | 1.5 | - | up | - | no | orange flash | M |
| 37 | 7:22.3 | 3 | Pavelski | air | big spinning special (2nd hit) | Sandstorm | 137 orange | air | 3+ at 0.25 s | off screen | flat | - | no | red flash, smoke | M |
