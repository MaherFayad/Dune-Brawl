# Reference sound, measured, and our synthesized match

Source: the 1440p reference footage (10 min 22 s, 3 matches), decoded and measured with numpy (STFT, band envelopes, EBU R128 loudness via ffmpeg, a mid/side split, onset detection over 1,639 onsets); events were tied to video frames by eye. The reference audio was used only for measurement: nothing is copied, sampled or recreated from a specific recording. Every Dune Brawl sound is synthesized in `game/audio.js`.

## What the reference does

| Topic | Measurement |
|---|---|
| Mix | Matches at -13 to -15 LUFS integrated, limited (true peak about +0.5 dBFS). Music under every match at about -26 to -30 LUFS, 15 to 20 dB under hits; results screen music 6 to 9 dB louder; loading screens silent; no ducking; no crowd bed. |
| Panning | None. Every effect is mono, even KOs at the far screen edge. |
| Light hit | Peak -5.4 dBFS. -6 / -12 / -20 dB at 35 to 50 / 105 to 180 / about 360 ms. Centroid 340 to 540 Hz, 61% of energy under 150 Hz. Strings of 2 to 4 hits 100 to 170 ms apart. |
| Heavy hit | Same peak as a light hit. Crack at 0 to 20 ms, sub body peaking near +60 ms, mid crunch gone by 150 ms. -6 / -12 / -20 dB at 15 to 25 / about 170 / 290 to 420 ms. 72% under 150 Hz. |
| Hit scaling | Only about +3 dB from the smallest to the biggest spark. Strength shows as sub weight, a separate crack and a sharper attack. |
| KO | Peak equals a hit. Crack, then a low boom swelling to its peak at +240 ms, then rumble. -12 dB at about 1.3 s, gone by 1.4 to 1.9 s: the only long tail in the game. |
| Swing (miss) | About 6 dB under hits, 85 to 140 ms, centroid 1.0 to 1.45 kHz. The same swish is reused for wall jumps and upward dashes. |
| Jump | About 13 dB under hits, an airy puff above 3 kHz. Landings are effectively silent. |
| Countdown | A recorded voice for 3, 2, 1, go, about 8 LU under hits, 0.65 to 0.75 s apart, in sync with the numerals within 1 to 2 frames. |
| Sync and density | Hit sounds land within about 2 frames of the spark, on the contact frame. 1.9 strong sounds per second, up to 7 in one second; 60% have another within 250 ms. |
| Not isolated | Dodge, weapon pickup, menu clicks. Our versions of these are original designs. |

## Ours (`game/audio.js`), measured from offline renders, mean of 5 renders each

| Sound | Peak vs light hit (target) | -6 / -12 / -20 dB, ms | Notes |
|---|---|---|---|
| Light hit | 0 (0) | 92 / 199 / 340 | Centroid 330 Hz, 70% under 150 Hz. Pitch rises 3% per hit in a string. |
| Heavy hit | 0 (0) | crack first, -20 dB at 406 | 71% under 150 Hz; size adds sub weight and length, not level |
| KO | +1.5 (0) | 195 / 797 / 1,615 | Crack, a boom swelling for 230 ms, a falling sub, a sand-blast hiss as the desert touch |
| Swing | -7.9 (-6) | 32 / 67 / 110 | Band sweeping down from about 2.6 to 0.8 kHz |
| Dodge, dash | -8.7 (-6) | 58 / 98 / 149 | Band sweeping UP, so it never sounds like a swing |
| Jump, air jump | -15 (-13) | 57 / 100 / 157 | Air jump adds a lift and a second flap |
| Landing | -21.7 (-20) | | A soft thud and a sand scuff |
| Countdown | -9.9 (-8) | 158 / 293 / 473 | Pitched stingers D5, E5, F#5 in place of a voice, then an A major go chord |

Bus: SFX at about -6 dB into a compressor and a limiter, as in the reference. Pan is capped at 0.3. At most 12 voices (KO tails are never stolen), and a 25 ms retrigger cooldown per sound. Sound is off until the first key or click (browser rule); M toggles it and the choice is remembered.

## Per-fighter flavour (Vespera)

| Event | Layer |
|---|---|
| Her hits | The shared body 3 dB softer, plus a thin rapier ring (three inharmonic sines from 2.4 kHz) and a click: precise, not blunt |
| Her swings | A thinner, higher blade swish replaces the shared whoosh |
| Dodge, dash, Bat Swarm | A bat-wing flutter: noise gated at 14 to 18 Hz, band rising 600 to 950 Hz |
| Parry | A plate-like clang (shared), plus the parasol canopy snapping open |
| The KO she scores | A short A minor organ chord over the shared KO |

## Not done yet

Music. The reference runs a light orchestral track per stage at 15 to 20 dB under the effects, with a louder results theme. Our game has no music; a procedural or commissioned track is the next audio step.
