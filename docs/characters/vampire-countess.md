# Vespera (`vampire-countess`)

**Vespera (فيسبيرا)**, The Countess in the Shade (كونتيسة الظل). Move data: `assets/fighters/vampire-countess/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Vespera is a vampire countess from the cold north who answered the storm's sand-letter and now regrets it, because the desert has sun. She fights inside the shade of a huge parasol whose tip is a rapier blade, bites a whole pomegranate between rounds (no juice, no drips), and complains about sand in her shoes. No blood, ever: she is offended by the idea.

## How they play

A floaty spacing duelist. She lives at the tip of her rapier: Rapier Lunge and Countess Thrust reach farther than any baseline move, so she pokes from outside the opponent's range and drifts away. Her low gravity and high jump keep her in the air a long time, which lets her wait out commitments and land on the whiff. The parasol opening (Shade Snap) is a real parry, but it is a read: six frames, then a long recovery.

**Strengths**
1. Long, thin pokes: her side heavy reaches 130 px, the longest side heavy after Hirba's.
2. Floaty air control (air speed 106, gravity 82) lets her pick when to land.
3. Shade Snap parry stuns an attacker for 40 frames when she reads a hit.

**Weaknesses**
1. Light (weight 96) and floaty, so she dies early off the top.
2. Thin, high hitboxes: low sweeps and small fighters slip under her thrusts.
3. A whiffed Shade Snap leaves 20 recovery frames to punish.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 95 | 106 | 110 | 82 | 86 | 2 | 96 | 32 | 70 |

Damage sum 97. Side heavy K (kb + kg x 10) 1190.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Parasol Tap | نقرة المظلة | 3/2/7 | 5 | 320/12 |  | Fast close check with the closed parasol; string starter. |
| 1 | Side light | Rapier Lunge | اندفاعة الشيش | 5/3/10 | 9 | 370/28 | ix 380 | Her main poke: long thin thrust with a small step in. |
| 2 | Down light | Shade Snap | صدة الظل | 5/4/20 | 6 | 420/14 | parry 2 to 7 | Parry on frames 2 to 7 (the parasol snaps open). A hit landing then deals her no damage and stuns the attacker. Long recovery: a read, not a habit. |
| 3 | Up light | Rising Point | الطعنة الصاعدة | 4/4/10 | 8 | 410/20 |  | Anti-air jab straight up; tall and narrow. |
| 4 | Neutral air | Cape Twirl | دوامة الرداء | 3/6/9 | 8 | 370/20 | away | Cape spin around her body; her safe landing tool. |
| 5 | Side heavy | Countess Thrust | طعنة الكونتيسة | 13/4/22 | 16 | 530/66 | charge, ix 520 | Kill move. Long lunge thrust, chargeable on the ground. Spaced, it beats almost every side heavy. |
| 6 | Recovery | Bat Swarm | سرب الخفافيش | 5/14/18 | 9 | 460/28 | ix 260, iy -1650 | She bursts into bats and rises. Long active, low damage: gets her home, not kills. |
| 7 | Down heavy | Parasol Pirouette | دوران المظلة | 12/6/22 | 14 | 500/52 | charge, away | Open parasol spin on both sides; chargeable; covers rolls. |
| 8 | Down air | Tip Drop | غرزة الطرف | 5/4/11 | 10 | 360/28 |  | Rapier tip straight down; a narrow spike off stage. |
| 9 | Ground pound | Nightfall | حلول الليل | 9/40/14 | 12 | 480/42 | iy 1900, endOnLand | Slow parasol-first drop, softer than baseline; lands into her down heavy. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 42 s, Vespera dies at 191% on average (71 stocks lost), Saif dies at 192% (66 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- The parry is live in `sim.js` (`parry: [2, 7]`, `FEEL.parryStun` 40). Watch that bots and new players do not find it oppressive; if so, cut the window to 5 frames before touching the stun.

## Canon changes requested

- Gravity 82 is her one identity stat (CANON allows one stat down to 80).
