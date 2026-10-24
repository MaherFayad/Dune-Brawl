# Rukhayy (`baby-roc`)

**Rukhayy (رخي)**, The Roc Who Cannot Fly Yet (الرخ الذي لم يطر بعد). Move data: `assets/fighters/baby-roc/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Rukhayy is a giant baby roc, the Sindbad bird, still wearing half its eggshell like shorts. Too big to be a baby and too clumsy to be a roc, it loudly wants to prove it can fly. Royal blue with gold. It could absorb Nawaf's falcon later: the bird becomes the fighter.

## How they play

Air specialist. Four air jumps and the best air speed in the cast (115): it fights above the stage, chases launches upward and edge guards far out, then comes home with jumps to spare. Wing hitboxes are wide (Wing Wheel covers 64 px each side). Dive Bomb falls faster than any other ground pound, and Talon Spike is a strong straight-down spike off stage.

**Strengths**
1. Five jumps in total: the safest recovery and the deepest edge guard.
2. Wide wing hitboxes in the air.
3. Talon Spike (one of the strongest spikes at kill percents) and Dive Bomb punish anyone recovering low.

**Weaknesses**
1. Slow on the ground (run 88), and its ground game is plain.
2. Big body (70 tall, 40 wide): easy to hit and to juggle.
3. Big Flap rises less than baseline; it relies on air jumps, so a stock spent off stage drains them.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 88 | 115 | 104 | 94 | 96 | 4 | 100 | 40 | 70 |

Damage sum 100. Side heavy K (kb + kg x 10) 1160.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Beak Peck | نقرة المنقار | 3/2/7 | 5 | 320/12 |  | Beak peck; fast close check. |
| 1 | Side light | Wing Slap | صفعة الجناح | 5/3/10 | 8 | 370/26 |  | Wing slap with a tall hitbox; ground and air. |
| 2 | Down light | Shell Scoot | زحفة القشرة | 5/4/11 | 7 | 420/16 | ix 800 | Scoots forward on its eggshell; pops up. |
| 3 | Up light | Flap Up | رفرفة صاعدة | 4/5/10 | 9 | 410/24 |  | Flaps both wings overhead; wide anti-air. |
| 4 | Neutral air | Wing Wheel | دولاب الجناحين | 3/6/8 | 9 | 380/24 | away | Wings out, spins; the widest neutral air. |
| 5 | Side heavy | Talon Kick | ركلة المخلب | 12/4/22 | 16 | 540/62 | charge, ix 600 | Lunging talon kick, chargeable. Its kill move. |
| 6 | Recovery | Big Flap | الرفرفة الكبرى | 5/10/20 | 9 | 460/30 | ix 200, iy -1500 | One huge flap upward; modest height, it has jumps for the rest. |
| 7 | Down heavy | Eggshell Spin | دوامة البيضة | 12/5/22 | 13 | 500/52 | charge, away | Spins in its shell on both sides; chargeable. |
| 8 | Down air | Talon Spike | غرزة المخلب | 5/4/12 | 10 | 370/32 |  | Talons straight down; the strongest spike in the cast. |
| 9 | Ground pound | Dive Bomb | انقضاضة الرخ | 9/40/14 | 14 | 520/48 | iy 2500, endOnLand | Dive-bomb ground pound, the fastest fall in the game (iy 2500). |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 50 s, Rukhayy dies at 220% on average (62 stocks lost), Saif dies at 214% (53 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- Four air jumps is live (`airJumps: 4`). If it proves too safe, the next lever is a shorter Big Flap, not fewer jumps (the jumps are the identity).

## Canon changes requested

- 4 air jumps (CANON allows 3 for the air specialist). Air speed 115 is at the cap.
