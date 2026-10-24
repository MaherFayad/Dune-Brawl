# Timber (`gorilla-lumberjack`)

**Timber (تيمبر)**, The Gentle Feller (الحطاب اللطيف). Move data: `assets/fighters/gorilla-lumberjack/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Timber is a silverback gorilla lumberjack from the far forests with a door-sized double-bit axe, a tiny beanie and a twig he never stops chewing. He is a gentle giant: he says sorry before every heavy swing, and means it. Cobalt plaid if Vespera ships (crimson is hers).

## How they play

Heavy bruiser. He walks forward, takes your poke on his armored wind-up, and answers with an axe swing that hurts. Every light is a frame slower than baseline, so he wins by trading, not by speed: his side heavy and down heavy have armor from frame 4 to 13, so a jab into his wind-up just adds damage to him while the axe keeps coming.

**Strengths**
1. Armor on both heavy wind-ups (frames 4 to 13): he trades through pokes.
2. High damage per hit and kb 600 on his side heavy: an armored trade still sends far.
3. Weight 108 and a wide frame: hard to kill mid-stage.

**Weaknesses**
1. Slow on the ground (run 85) with a short jump: he gets zoned and juggled.
2. Wide hurtbox (48 px): everything hits him, and armor still takes the damage.
3. Recovery (Treetop Climb) is short and slow; edge guards hurt.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 85 | 88 | 90 | 110 | 110 | 2 | 108 | 48 | 72 |

Damage sum 97. Side heavy K (kb + kg x 10) 1180.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Knuckle Bop | لكمة المفاصل | 3/2/9 | 5 | 350/10 |  | Knuckle jab; the fastest thing he has. |
| 1 | Side light | Haft Shove | دفعة المقبض | 5/3/11 | 8 | 400/20 | ix 300 | Axe-handle shove; pushes people off him. |
| 2 | Down light | Stump Sweep | كنسة الجذع | 5/4/11 | 8 | 450/12 | ix 500 | Low knuckle sweep that pops up; starts juggles. |
| 3 | Up light | Branch Lift | رفعة الغصن | 5/4/11 | 7 | 420/16 |  | Two-handed overhead lift; anti-air. |
| 4 | Neutral air | Log Roll | دحرجة الخشبة | 4/6/11 | 8 | 390/16 | away | Curls into a log and rolls in the air; wide hitbox. |
| 5 | Side heavy | Timber Fall | سقوط الشجرة | 14/5/26 | 16 | 600/58 | armor 4 to 13, charge, ix 400 | "Sorry!" then the big axe swing. Armor frames 4 to 13, chargeable. His kill move. |
| 6 | Recovery | Treetop Climb | تسلق الشجرة | 6/10/22 | 10 | 500/22 | ix 200, iy -1600 | Climbs an invisible trunk upward; short reach, slow end. |
| 7 | Down heavy | Splitting Maul | فلق الحطب | 14/5/24 | 14 | 560/40 | armor 4 to 13, charge, away | Overhead split into the floor, both sides. Armor frames 4 to 13, chargeable. |
| 8 | Down air | Bark Stomp | دوسة اللحاء | 5/4/13 | 8 | 400/20 |  | Two-foot stomp; a slow, heavy spike. |
| 9 | Ground pound | Sorry Drop | سقطة المعتذر | 10/40/16 | 13 | 560/32 | iy 2300, endOnLand | Belly drop with an apology; heavy ground pound into his down heavy. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 43 s, Timber dies at 249% on average (65 stocks lost), Saif dies at 203% (70 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- Armor is live (`armor: [4, 13]` on slots 5 and 7). It never covers the first 3 frames, so a fast jab still beats a heavy pressed at point blank.

## Canon changes requested

- Jab startup 3 like everyone else (only Tiktak, the super heavy, uses 4).
- Side heavy K 1180 sits mid-budget, not near the top: his kill power comes from armor and charge (+50% when held) rather than raw K, which kept bot pacing even.
