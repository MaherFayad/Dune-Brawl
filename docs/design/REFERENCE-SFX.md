# Reference sound, measured, and our recorded match

Source: the 1440p reference footage (10 min 22 s, 3 matches), decoded and measured with numpy (STFT, band envelopes, EBU R128 loudness via ffmpeg, a mid/side split, onset detection over 1,639 onsets); events were tied to video frames by eye. The reference audio was used only for measurement: nothing is copied, sampled or recreated from a specific recording. Every Dune Brawl sound is a freely licensed recording (CC0, the announcer CC-BY 4.0), cut, layered and levelled to these measurements; sources and licenses are in `assets/audio/CREDITS.md`, playback is `game/audio.js`.

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

## Ours (`game/audio.js` and `assets/audio`), measured from offline renders, mean of 8 renders each

Measured the reference's way: 20 ms rms envelope, decay points after its peak, centroid over the first 80 ms, energy share under 150 Hz over the whole sound. Every file starts on its transient (onset 0 to 0.4 ms in the render; no lookahead in the bus).

| Sound | Peak vs light hit (target) | -6 / -12 / -20 dB, ms (target) | Centroid | Built from |
|---|---|---|---|---|
| Light hit (4 variants) | 0 (0); sample peak -6.0 dBFS (-5.4) | 35 / 119 / 190 (35 to 50 / 105 to 180 / about 360) | 359 Hz (340 to 540), 63% under 150 Hz (61%) | A recorded punch, low-passed at 8 kHz so the crack stays small, over a soft low thump 14 dB down. Pitch rises 3% per hit in a string. The tail is shorter than the reference's. |
| Heavy hit (4) | -0.3 (0) | 22 / 108 / 392 (15 to 25 / about 170 / 290 to 420) | 462 Hz, 67% under 150 Hz (72%) | A wet slap as the crack, a recorded punch body 10 dB down, and the low end of an explosion swelling to its peak near +60 ms. Bigger knockback: up to +2 dB and 5% deeper, not louder than that. |
| KO (2) | -0.3 (0) | 34 / 67 / 1,386 (about 55 / about 1,300 / 1,400 to 1,900) | 304 Hz, 78% under 150 Hz | A crack and a punch, then a recorded explosion slowed to 0.7x, swelling to its peak at +240 ms (about 6 dB under the crack) and rumbling out by about 1.6 s. The rumble is lumpy, so the 20 ms envelope dips past -12 dB once around 60 ms before it swells; it then holds near -10 dB until about 1.3 s. The announcer's "K.O.!" follows at +0.3 s. |
| Swing (4) | -5.8 (-6) | 46 / 59 / 78 (sounds 85 to 140 ms) | 1,206 Hz (1,000 to 1,450) | Short recorded swishes, high-passed at 850 Hz |
| Heavy swing (2) | -6.0 (-6) | 55 / 67 / 101 | 1,959 Hz | A longer, slower swish |
| Dodge (3), dash (2) | -6.6, -6.8 (-6, our design) | 27 / 33 / 42 | 1.1 to 1.4 kHz | A quicker, higher swish; the dash adds a faint sand scuff |
| Jump (4), air jump | -13.1, -13.3 (-13) | 54 / 110 / 155 | 4.3 kHz (above 3 kHz) | A cloth flick high-passed at 2.5 kHz: an airy puff. The air jump plays it 8% higher. |
| Landing (4) | -19.7 (-20, near silent) | 46 / 74 / 140 | 301 Hz | A soft step in snow, which reads as sand |
| Parry (2) | -2.0 (our design) | 41 / 68 / 124 | 6.9 kHz | A short blade clang over a small thump |
| Countdown 3, 2, 1 | -7.6 (-8) | 235 / 333 / 456 | 1.3 kHz | A recorded announcer; each word is under 0.56 s, so it ends before the next one 0.7 s later |
| Go ("Fight!"), "Game!", "Winner!" | -8.0, -7.8, -7.6 (-8) | | | The same voice. There is no recorded "Brawl" line. |
| Menu move, confirm | -14.1, -12.4 (our design) | | | A soft select tick and a pluck |

Music (stereo): the in-match bed plays at -28.0 LUFS (target -26 to -30), about 18 dB under a light hit's 20 ms peak; the results theme at -19.8 LUFS, 8.2 dB louder (target 6 to 9); the menu theme at -23.7 LUFS. Loading screens are silent. The bed starts with the countdown, stops on "Game!", and the results theme starts with the results screen. Music joins the mix after the effects, with no compressor, so nothing ducks it.

Variety: each sound has 2 to 4 recorded variants, never the same one twice in a row, with a +-5% pitch jitter and +-1 dB level jitter (the voice is not jittered). Peak spread over 8 renders: 0.9 to 2.4 dB.

Bus: effects and music into one gain stage (M mutes both), then a soft limiter (a waveshaper, linear up to -3 dBFS), so only stacked peaks are touched and no lookahead delays a hit off its contact frame. Pan is capped at 0.3. At most 12 voices (KO tails and announcer lines are never stolen), and a 25 ms retrigger cooldown per sound. Effects are decoded at page load; music on its first request. Sound is off until the first key or click (browser rule); M toggles it and the choice is remembered. `Sfx.musicVolume(v)` sets a separate, remembered music level. `Sfx.render(events, seconds, rate, { music: "battle" })` adds a track under a recording; `{ music: true }` follows the `music` events that the game logs.

## Per-fighter flavour (Vespera)

Light touches only: no layer is louder than the shared sound it sits on.

| Event | Layer |
|---|---|
| Her hits | The shared hit plus a faint rapier edge (a short knife clash high-passed at 2.5 kHz, 12 dB under): centroid 679 Hz against 359 shared, same peak |
| Her swings | A thinner swish (high-passed at 1.4 kHz) with a blade shing 20 dB under, replacing the shared swing |
| Dodge, dash, Bat Swarm (move 6) | A soft bat-wing flutter instead of the swish: one recorded wing flap, sped up and repeated four times, about 10 dB under a hit |
| Parry | The shared clang plus a cloth "fwump" as the parasol canopy opens |

## Not done yet

A per-stage track: one bed serves every stage for now. There is no "Brawl" announcer line, so the go call says "Fight!". The light hit's tail is shorter than the reference's (-20 dB at about 190 ms against 360).
