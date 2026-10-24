# Finjan (`fennec-host`)

**Finjan (فنجان)**, The Host Who Pours First (المضيف الذي يصب أولا). Move data: `assets/fighters/fennec-host/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Finjan is a tiny fennec fox coffee host with giant ears and a dallah (coffee pot) used as a mace. Hospitality as violence: he always serves the guest first, by pouring on them. His victory is one sip from a tiny cup. Saffron with cardamom green. The design works as a boy or a girl.

## How they play

Rushdown. The fastest, smallest and lightest fighter: run 120, three air jumps and a body only 40 px tall that many high pokes sail over. He wins by staying in the opponent's face: fast lights (most start on frame 3 or 4), a dash-in tail sweep, then a juggle with Ear Flick and Saucer Spin. Steam Pour is a short arc of steam, his main way to finish a stock.

**Strengths**
1. Fastest run and air speed; 4 jumps in total make his recovery very safe.
2. Tiny hurtbox (40 px tall, 26 wide): high moves whiff over him.
3. Every light starts on frame 3 or 4 with short recovery.

**Weaknesses**
1. Weight 82: the lightest in the cast. A side heavy kills him 45 to 70 points earlier than it kills Saif.
2. Shortest reach: he has to get in, and zoners (Brrr, Hirba) make that hard.
3. Low damage per hit; he needs strings, not single reads.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 120 | 112 | 108 | 112 | 115 | 3 | 82 | 26 | 40 |

Damage sum 97. Side heavy K (kb + kg x 10) 1180.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Cup Flick | نقرة الفنجان | 3/2/5 | 5 | 300/12 |  | Flick from the tiny cup; frame 3, 5 frames of recovery. |
| 1 | Side light | Dallah Swing | ضربة الدلة | 4/3/8 | 9 | 340/26 | ix 600 | Dallah swing with a hop forward; his main approach. |
| 2 | Down light | Tail Sweep | كنسة الذيل | 4/3/8 | 8 | 400/16 | ix 1100 | Fast dash-in tail sweep that pops up; starts juggles. |
| 3 | Up light | Ear Flick | نفضة الأذن | 3/4/8 | 8 | 380/22 |  | The giant ears flick up; anti-air and juggle tool. |
| 4 | Neutral air | Saucer Spin | دوران الصحن | 3/5/7 | 8 | 340/22 | away | Spins like a saucer in the air; safe on landing. |
| 5 | Side heavy | Steam Pour | صبة البخار | 11/6/16 | 15 | 480/70 | charge, ix 500 | The pour: a short arc of steam in front, chargeable. His kill move. |
| 6 | Recovery | Spout Rocket | انطلاقة الدلة | 4/10/16 | 9 | 440/34 | ix 360, iy -1600 | Rides a jet of steam from the spout; fast startup. |
| 7 | Down heavy | Coffee Ring | دائرة القهوة | 11/5/18 | 13 | 480/62 | charge, away | Spins and splashes a ring of coffee on both sides; chargeable. |
| 8 | Down air | Lid Drop | سقطة الغطاء | 4/3/9 | 9 | 340/28 |  | Drops the dallah lid; small spike. |
| 9 | Ground pound | Cardamom Drop | سقطة الهيل | 8/40/12 | 13 | 480/48 | iy 2300, endOnLand | Cannonball drop scattering cardamom; fast ground pound. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 36 s, Finjan dies at 159% on average (82 stocks lost), Saif dies at 194% (80 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- Optional later: an ear glide (hold jump while falling to cap fall speed). Not needed for balance; three air jumps already carry his recovery.

## Canon changes requested

- Weight 82 is below the CANON range (90 to 115). The brief asked for about 75; 75 to 78 made him lose 60 to 70% of stocks to Saif in bot pacing, so 82 is the lightest value that stays even. Request: allow weight 80 to 140.
- 3 air jumps (CANON gives 3 only to the air specialist). Run 120 is his identity stat.
- Side heavy K 1180 is above the rushdown 'near the low end' guidance, to offset his low weight.
