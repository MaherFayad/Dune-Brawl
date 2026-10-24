# Brrr (`melting-yeti`)

**Brrr (برر)**, The Homesick Snow (الثلج المشتاق). Move data: `assets/fighters/melting-yeti/moves.draft.json`. Concept: `docs/characters/ROSTER-V2.md`.

## Who

Brrr is a homesick yeti dropped from a mountain top into the desert, always melting. Sweat drops, a tiny clip-on fan, and a scarf he refuses to take off. His ice hammer slides frost along the floor. Ice white with pale blue.

## How they play

Mid-heavy zoner. He controls the floor at long range: Frost Slide and Ice Floor send ice along the ground well past baseline reach, and Hammer Poke and Glacier Swing out-range most swords. He wants the opponent to come to him and to jump, then he answers with Snow Flurry. As he takes damage he melts, and (once the system exists) gets lighter and faster, so the longer a stock lasts the more dangerous he becomes.

**Strengths**
1. Longest floor coverage: Ice Floor reaches 152 px along the ground.
2. Strong side heavy (K 1220) with long reach.
3. Weight 106 at 0%: he survives well early in a stock.

**Weaknesses**
1. Wide body (46 px) and below-average speed until he melts.
2. Ground-focused tools: aerial fighters (Rukhayy, Vespera) fly over the ice.
3. Once melting lands, he gets lighter as he gets more dangerous, so late stocks end early.

## Stats (percent of the baseline, Saif = 100; hurtW and height in world px)

| run | airSpeed | jump | gravity | fallSpeed | airJumps | weight | hurtW | height |
|---|---|---|---|---|---|---|---|---|
| 90 | 92 | 94 | 104 | 100 | 2 | 106 | 46 | 70 |

Damage sum 97. Side heavy K (kb + kg x 10) 1220.

## Moves

Frames are startup/active/recovery at 60 fps. kb/kg are base knockback and growth. Armor and parry windows count frames like `p.t` in the sim (the first frame of the move is 1). `charge` means the move can be held on the ground for up to 30 extra frames for up to +50% damage and knockback.

| # | Slot | Move | Arabic | su/ac/re | Dmg | kb/kg | Extras | What it is for |
|---|---|---|---|---|---|---|---|---|
| 0 | Jab | Mitten Pat | ربتة القفاز | 3/2/8 | 5 | 330/12 |  | Mitten pat; fast close check. |
| 1 | Side light | Hammer Poke | نكزة المطرقة | 5/3/11 | 8 | 380/24 | ix 200 | Long hammer poke; his main spacing tool. |
| 2 | Down light | Frost Slide | زلقة الصقيع | 5/5/12 | 7 | 420/16 |  | Slides ice along the floor in front; long, low, pops up. |
| 3 | Up light | Snow Flurry | زخة الثلج | 4/5/11 | 7 | 410/18 |  | Shakes snow overhead; anti-air. |
| 4 | Neutral air | Snowball Spin | دوران كرة الثلج | 4/6/10 | 8 | 380/20 | away | Rolls into a snowball in the air. |
| 5 | Side heavy | Glacier Swing | ضربة الجليد | 13/5/24 | 16 | 560/66 | charge, ix 300 | Huge hammer swing, chargeable. His kill move. |
| 6 | Recovery | Fan Lift | رفعة المروحة | 5/10/20 | 10 | 480/28 | ix 200, iy -1600 | The clip-on fan spins up and lifts him. |
| 7 | Down heavy | Ice Floor | بساط الجليد | 13/8/24 | 14 | 520/48 | charge, away | Hammer smash that lays ice along the floor, mostly forward; chargeable. |
| 8 | Down air | Icicle Drop | سقطة الجليدة | 5/4/12 | 9 | 380/24 |  | Drops an icicle under himself; spike. |
| 9 | Ground pound | Avalanche | الانهيار الثلجي | 9/40/15 | 13 | 520/40 | iy 2200, endOnLand | Avalanche ground pound into his down heavy. |

## Pacing check

Bots from `game/main.js`, 16 seeds of 6 minutes against Saif (`djinn-warrior`): one KO per 45 s, Brrr dies at 234% on average (65 stocks lost), Saif dies at 187% (64 stocks lost). The Saif mirror on the same sim gives 213 to 216%.

## TODO and sim notes

- TODO melting (stand-in: none, he plays at fixed stats today). Proposed hook in `moves.draft.json`: every `meltStepPct` 30 damage is one melt step, up to `meltMaxSteps` 4. Each step changes weight by `weightPerStep` -4, run by `runPerStep` +4, air speed by `airSpeedPerStep` +3 and jump by `jumpPerStep` +2 (percent points). At 120% and above he plays at weight 90, run 106, air speed 104, jump 102. It is a pure function of `p.dmg`, so it is deterministic and rollback safe with no new state, and it resets on respawn.
- Rebalance once melting lands: the pacing below was measured without it, so his late-stock deaths will move earlier. Expect to raise base weight by about 4.

## Canon changes requested

- Stats are inside the budget today. Melting will push weight down to 90 and run up to 106 at 120% damage, still inside the budget.
