# Tiktak (`clockwork-elephant`)

**Tiktak (تك تك)**, The Brass Hour (ساعة النحاس). Move data: `assets/fighters/clockwork-elephant/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Tiktak is a giant brass clockwork elephant built by a medieval master clockmaker in the tradition of the water-clock engineers. It stands upright, ticks in its idle, rings like a gong when hit hard and puffs steam when hurt. A tiny monkey automaton on its head points at targets. The chest clock has no numerals.

## How they play

Super heavy. The biggest and heaviest fighter (84 px tall, weight 130): very hard to KO in the middle of the stage, very slow on the ground and in the air. It holds center, armors through pokes on both heavies, and uses Trunk Snag, a trunk whip that pulls the victim in and up instead of pushing them away, to start its own juggles.

**Strengths**
1. Weight 130: survives side heavies at mid stage past 300.
2. Armor on both heavy wind-ups (frames 4 to 13).
3. Tusk Toss (152 px up) and Escapement Stomp (106 px each side) cover the most space around its body.

**Weaknesses**
1. Slowest run (80, tied with Abu Sarab), lowest jump (86) and a weak recovery: at the ledge it dies as early as Saif.
2. Biggest hurtbox in the cast (84 by 58): everything connects.
3. Every move is a frame or two slower than baseline, and the jab starts on frame 4.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 80 | 85 | 86 | 115 | 112 | 2 | 130 | 58 | 84 |

Damage sum 95. Side heavy K (kb + kg x 10) 1160.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Trunk Tap | نقرة الخرطوم | 4/2/9 | 5 | 350/8 |  | Trunk poke from head height; frame 4, the only slow jab. |
| 1 | Side light | Trunk Snag | خطفة الخرطوم | 5/3/13 | 7 | 420/12 |  | Trunk whip that pulls the victim toward Tiktak and pops them up. Stand-in for the trunk grab. |
| 2 | Down light | Gear Grind | طحنة التروس | 5/5/12 | 7 | 450/12 | ix 400 | Low gear grind along the floor; pops up. |
| 3 | Up light | Tusk Toss | رمية الناب | 5/4/12 | 7 | 430/14 |  | Huge tusk upswing; the tallest anti-air in the game. |
| 4 | Neutral air | Pendulum | البندول | 5/6/12 | 8 | 400/14 | away | Swings its whole body like a pendulum in the air. |
| 5 | Side heavy | Gong Ram | نطحة الصنج | 14/5/28 | 16 | 620/54 | armor 4 to 13, charge, ix 450 | Brass head ram that rings like a gong. Armor frames 4 to 13, chargeable. Its kill move. |
| 6 | Recovery | Steam Lift | رفعة البخار | 6/12/24 | 9 | 500/20 | ix 160, iy -1400 | Steam vents lift it up; slow and short on purpose. |
| 7 | Down heavy | Escapement Stomp | دوسة الميزان | 14/6/26 | 14 | 580/38 | armor 4 to 13, charge, away | Two-foot stomp, widest ground hitbox in the game. Armor frames 4 to 13, chargeable. |
| 8 | Down air | Bell Drop | سقطة الجرس | 5/4/14 | 9 | 420/18 |  | Drops its round body like a bell; slow spike. |
| 9 | Ground pound | Counterweight | الثقل الموازن | 10/40/18 | 13 | 580/32 | iy 2300, endOnLand | Counterweight drop; the heaviest ground pound. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 48 s, Tiktak dies at 262% on average (56 stocks lost), Saif dies at 175% (65 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- TODO trunk grab: a command grab on side light (hold, then throw by direction) like Abu Sarab's Lost Road. Until it exists, Trunk Snag pulls in with `ax: -30`.

## Canon changes requested

- Weight 130 is above the CANON range (90 to 115). The brief asked for about 140; at 135 to 140 it won 60 to 65% of stocks against Saif in bot pacing, so 130 it is. Request: allow weight 80 to 140.
- Run 80 is its identity stat; air speed 85 and jump 86 sit at the 85% floor.
- Jab startup 4 (CANON allows 4 for the heavy). Side heavy K 1160 is mid-budget: a fighter this hard to KO cannot also kill early.
