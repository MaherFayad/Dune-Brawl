# Starting roster

Five fighters, each designed by its own agent against `docs/design/CANON.md`, with the world from `docs/lore/LORE.md`. Each fighter has a full bible in this folder and draft move data in `assets/fighters/<id>/moves.draft.json`.

All five moves files pass the balance check: valid JSON, integers only, 10 moves in slot order, launch vectors close to 100, startups and totals inside the CANON budget.

## At a glance

| ID | Name | Title | Archetype | Weapon | Hook |
|---|---|---|---|---|---|
| `djinn-warrior` | Saif (سيف) | The Bound Blade (النصل المقيد) | All-rounder | Scimitar | **Sand Stride** (خطوة الرمل): a directional ground dodge that becomes a 90 px dash and leaves a sand trail that trips grounded opponents |
| `dune-ghoul` | Abu Sarab (أبو سراب) | Ghoul of the Dunes (غول الكثبان) | Heavy grappler | Bare claws | **Sand Hide** (درع الرمل): armor on two heavies that absorbs a hit of 12 damage or less, then regrows over 240 frames. Side heavy is the command grab Lost Road |
| `falcon-rider` | Nawaf (نواف), with the falcon Muzna (مزنة) | Falconer of the Heights (صقار الأعالي) | Air specialist | Spear | **The Stoop** (الانقضاض): Down + Jump in the air spends one of 3 air jumps on a dive that cancels into any aerial |
| `sea-siren` | Dana (دانة) | Bride of the Sea (عروس البحر) | Zoner | Thrown pearl oyster shell | **Homecoming Shell** (محارة القفال): a thrown shell that flies out, hangs, and returns, hitting on both legs |
| `dagger-dancer` | Marjana (مرجانة) | Bane of the Forty (قاهرة الأربعين) | Rushdown | Twin curved daggers | **Rhythm** (الإيقاع): hits with varied moves build up to 4 beats that shorten recovery; 2 beats buy a Dance Step cancel |

## Numbers

Physics are percentages of the baseline. Weight is mass: knockback taken is `floor(l * 100 / weight)`.

| Fighter | Damage sum | Side heavy K | Run | Air speed | Jump | Gravity | Fall | Air jumps | Weight | Sheets |
|---|---|---|---|---|---|---|---|---|---|---|
| Saif | 98 | 1140 | 100 | 100 | 100 | 100 | 100 | 2 | 100 | 17 |
| Abu Sarab | 105 | 1320 | 80 | 88 | 88 | 112 | 110 | 2 | 115 | 18 |
| Nawaf | 93 | 1080 | 90 | 115 | 115 | 105 | 120 | 3 | 90 | 17 |
| Dana | 92 (plus up to 10 per shell throw) | 1080 | 92 | 96 | 104 | 88 | 90 | 2 | 94 | 18 |
| Marjana | 90 | 1020 | 120 | 105 | 95 | 110 | 110 | 2 | 90 | 17 |

Budget: damage sum 90 to 108, side heavy K 1000 to 1350, stats 85 to 115 with one identity stat allowed at 80 or 120, weight 90 to 115, at most 18 sheets.

Combo windows in each bible are in prototype units, checked against the live `sim.js` where the agent could, and will shift once the global game feel multiplier lands. Treat them as starting values for the training room, not final frame data.

## Sim work, ordered by build cost

Shared by every fighter (build these first, in phase 1):

1. Per-fighter `stats`, `hook` and `moves` loaded from hashed `moves.json`, plus a fighter id field.
2. Per-fighter physics from percentages, converting jump height to velocity with an integer square root at load.
3. Weight as mass, applied before hitstun.
4. Shared hook entry points: on hit landed, on hit taken, every frame, can cancel. All hits of a frame resolve before any reset, so player order never matters.
5. Fix: moves with `endOnLand` are exempt from the fall speed cap (today the ground pound's 2100 dive is clipped to 1050).
6. `hook` and `projectile` blocks included in the handshake hash.

Per fighter, cheapest first:

| Fighter | Extra sim work | Cost |
|---|---|---|
| Nawaf | 3 air jumps, two Stoop fields, landing lag | Low |
| Saif | `STRIDE` state, a sand trail hitbox that belongs to no move | Low |
| Marjana | Beat meter fields, recovery computed from beats, `STEP` state | Medium |
| Abu Sarab | Armor windows, a full command grab system (hold, back throw, clash rule), hurtbox width | High |
| Dana | Projectile slot (10 fields), terrain and blast zone checks, swat and clash, hook move at index 10 | High |

## Decisions for Maher

1. **Launch pair.** The plan ships 2 fighters.
   - A. Saif and Abu Sarab: the plan's pair, the strongest contrast, but the grab and armor are the most sim work.
   - B. Saif and Marjana (recommended): the lore's central rivalry, Ending B's two leads, and medium sim work. Abu Sarab follows as the first drop.
   - C. Saif and Nawaf: the least sim work, but two mobile fighters give less contrast.
2. **Names.** Approve or swap the five recommended names; each bible lists 2 alternatives.
3. **Dana's title.** In Arabic, عروس البحر is the everyday word for a mermaid, which pulls the art toward a fish tail (the canon bans it for readability). Options: keep it, or use حارسة المغاص (Keeper of the Pearl Beds) or ابنة الغوص (Daughter of the Dive).
4. **Hejaz Ruins.** The lore recommends renaming it Salt Road Ruins (أطلال طريق الملح), since Hejaz is the real region of the holy cities.
5. **Season ending.** LORE.md section 9: Ending A (Saif claims the oath) or Ending B (Marjana claims the Captain).
6. **UI Arabic.** The development plan's string table uses dialect and loanwords (أونلاين، البوت، كيبورد); the canon and these documents use Modern Standard Arabic. LORE.md suggests replacements.

## Playtest watch list

- Abu Sarab's Lost Road beats ground dodge: check that it does not dominate defensive play.
- Dana's shell return into Tidal Ring links with only 1 to 2 frames to spare: may be too strict, or need a wider window.
- Saif's sand trail trips at any percent: check that it does not make his neutral game too safe.
- Nawaf's Stoop into down air spike: check offstage kill rates at low percent.
- Marjana at 4 beats: check that her recovery floor of 3 frames does not create true infinites.
