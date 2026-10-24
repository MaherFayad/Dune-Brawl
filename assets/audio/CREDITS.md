# Audio credits

Every sound in this folder is a recording released under CC0 (public domain) or, for the announcer
voice only, CC-BY 4.0. Nothing comes from a commercial game or from the reference footage. The files
were cut, layered, filtered, levelled and re-encoded for Dune Brawl (mono 96 kbps MP3 for effects,
80 kbps for the voice, stereo 128 kbps for music).

## Announcer (CC-BY 4.0, attribution required)

Voice clips recorded and performed by **Aimee Smith** (www.aimeesmithva.com), uploaded by WinterWalrus,
licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: trimmed, high-passed
at 90 Hz, level set; "three", "two" and "one" were tightened with a pitch-preserving tempo change to fit
under 0.56 s.

| File | Source clip | Pack |
|---|---|---|
| voice/vo_three.mp3, vo_two.mp3, vo_one.mp3, vo_winner.mp3 | three, two, one, winner | [Announcer Voice Pack (Racing, Female)](https://opengameart.org/content/announcer-voice-pack-racing-female) |
| voice/vo_fight.mp3, vo_ko.mp3, vo_game.mp3 | fight, ko, game | [Announcer Voice Pack (Fighting, Female)](https://opengameart.org/content/announcer-voice-pack-fighting-female) |

No CC0 voice pack had a "KO" line (Kenney's CC0 Voiceover Pack: Fighter has 3, 2, 1, fight and game
but no KO), so one CC-BY voice covers every line to keep a single announcer. None of the packs has a
"Brawl" line; "Fight!" is the go word.

## Music (CC0)

All three tracks are by **RandomMind**, CC0.

| File | Track | Use |
|---|---|---|
| music/battle.mp3 | [Medieval: Minstrel Dance](https://opengameart.org/content/medieval-minstrel-dance) (the loop version) | in-match bed |
| music/results.mp3 | [Medieval: Victory Theme](https://opengameart.org/content/medieval-victory-theme) | results screen |
| music/menu.mp3 | [Medieval: Rejoicing](https://opengameart.org/content/medieval-rejoicing) (the loop version) | menu |

Loudness-normalised to -16 LUFS (the game sets the playing level); loop seams crossfaded over 6 ms.

## Effects (CC0)

| Source | Author | License | Used in |
|---|---|---|---|
| [Punch](https://opengameart.org/content/punch) (qubodupPunch01, 03, 04, 05) | qubodup (Iwan Gabovitch) | CC0 | sfx/hit1 to hit4 (the punch) |
| [Impact Sounds](https://kenney.nl/assets/impact-sounds) (impactSoft_heavy, impactPunch_heavy, impactSoft_medium, footstep_snow) | Kenney | CC0 | hit (low body), heavy (body), ko (punch), parry (thump), land, dash (sand scuff) |
| [40 wet towel club/pound/hit/attack sounds](https://opengameart.org/content/40-wet-towel-clubpoundhitattack-sounds) (12, 29, 32, 39) | qubodup | CC0 | sfx/heavy1 to heavy4 and ko1, ko2 (the crack) |
| [Muffled Distant Explosion](https://opengameart.org/content/muffled-distant-explosion) | NenadSimic | CC0 | heavy (sub swell), ko (the low boom, slowed down) |
| [Swishes Sound Pack](https://opengameart.org/content/swishes-sound-pack) (swish-3, 6, 7, 9, 10, 11, 12, 13) | artisticdude | CC0 | swing, swingHeavy2, dodge, dash, v_swing |
| [Battle Sound Effects](https://opengameart.org/content/battle-sound-effects) (swish_4) | artisticdude | CC0 (also offered as CC-BY 3.0, CC-BY-SA 3.0, GPL; used under CC0) | swingHeavy1 |
| [20 Sword Sound Effects (Attacks and Clashes)](https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes) (sword_clash 2 and 4, sword 3, 4, 6) | StarNinjas | CC0 | parry (the clang), v_swing (the faint blade shing) |
| [Fantasy Weapons and Apparel SFX Library](https://opengameart.org/content/fantasy-weapons-and-apparel-sfx-library) (sword-knife-clash-14, 15, 16) | Vehicle | CC0 | v_edge (Vespera's faint rapier edge) |
| [Large Wings Flap](https://opengameart.org/content/large-wings-flap) | AntumDeluge | CC0 | v_flutter (one flap, sped up and repeated into a bat flutter) |
| [RPG Audio](https://kenney.nl/assets/rpg-audio) (cloth1 to cloth4) | Kenney | CC0 | jump (high-passed cloth puff), v_parasol (the canopy fwump) |
| [Interface Sounds](https://kenney.nl/assets/interface-sounds) (select_002, pluck_002) | Kenney | CC0 | uiMove, uiConfirm |

The build steps (layering, filters, envelopes, trims and levels) are described per sound in
docs/design/REFERENCE-SFX.md.
