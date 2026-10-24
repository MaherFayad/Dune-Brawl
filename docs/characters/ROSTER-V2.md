# Roster v2: fighters with more character

Status: proposal for Maher. Nothing below replaces the current roster until a direction is picked.

## Why the current five feel flat

Four of the five are robed humans of the same height and build. They hold a blade or a stick in a ready stance, and their palettes sit in nearby lanes. On screen at 64 px, the black-shape silhouette test (CANON section 4) only really separates Abu Sarab.

Strong rosters in the genre differ first in **species, size and silhouette**. Costume comes after that. Each fighter also gets one **gag that shows in the idle**: a vampire shading herself from the sun, or a yeti melting. Personality has to read before the first hit lands.

## Lore fit: the Storm's Guests

The canon already allows outsiders. This year the ring opens wider than ever (LORE section 7), and Ajaj is a guest who was asked to sleep. For the first time, the storm plays host itself. It blows sand-letters across the whole world, and champions answer from everywhere: a countess from the cold north, a lumberjack from the far forests, a yeti dropped from a mountain top. The desert is the stage and the hosts are local, but the guests can be anyone. Hospitality is the Gulf value that makes the whole premise work.

The guardrails still bind (CANON section 2): no blood, modest costumes, no religious symbols, and no named religious figures.

## The concepts

Concept sheets: `docs/characters/concepts/` (one per fighter, plus `board-1.jpg` and `board-2.jpg`). Higgsfield job IDs are at the end. Hue lanes avoid the stage backgrounds (dusk purple and orange, noon sandstone, night amber) and each other.

| Name (recommended, alternatives) | Arabic UI name | What it is | Silhouette and size | Archetype and gimmick | Hue lane | The gag |
|---|---|---|---|---|---|---|
| **Vespera** (Countess Noctura, Madame Ombra) | فيسبيرا | A vampire countess who hates the desert sun | Tall and slim, high collar cape, a huge open parasol | Spacing duelist. Her parasol is a rapier when closed and a shield when open (a short parry). A bat-swarm recovery. Light and floaty. | Black with crimson | She fights in her own shade. She sips pomegranate juice from a goblet and complains about sand in her shoes. No blood, ever. |
| **Timber** (Mossback, Big Bruno) | تيمبر | A silverback gorilla lumberjack with a door-sized double-bit axe | Wider than tall, huge arms, knuckle stance | Heavy bruiser. Armor on his heavy wind-ups (he takes the hit and keeps swinging). The slowest runner and the heaviest. | Charcoal fur with plaid red (moves to cobalt plaid if Vespera ships) | A gentle giant who says sorry before every heavy. He chews a twig and wears a tiny beanie. |
| **Finjan** (Hail, Dallah) | فنجان | A tiny fennec fox coffee host | The smallest fighter, about half height, giant ears | Rushdown. The smallest hurtbox, 3 air jumps and an ear glide. The coffee pot is a mace, and the pour is a short-range arc of steam. | Saffron with cardamom green | Hospitality as violence: he always serves the guest first, by pouring on them. His victory is a sip from a tiny cup. |
| **Tiktak** (Saa'a, Brass Feel) | تك تك | A giant brass clockwork elephant, built by a medieval master clockmaker in the tradition of the water-clock engineers | The biggest fighter: upright, round brass ears, a trunk that whips like a chain | Super heavy. Armor on heavies, and a trunk grab. Slow in the air, but very hard to KO. A tiny monkey automaton on its head points at targets. | Brass gold with teal patina | It ticks in its idle, rings like a gong when hit hard, and puffs steam when hurt. |
| **Brrr** (Frostbite, Thalj) | برر | A homesick yeti stuck in the desert, always melting | Big round fluffball | Zoner with an ice hammer that slides ice along the floor. He melts as damage rises, getting lighter and faster as he gets more dangerous. | Ice white with pale blue | Sweat drops, a tiny clip-on fan, and a scarf he refuses to take off. |
| **Rukhayy** (Bubu, Roc Jr.) | رُخَيّ | A giant baby roc, the Sindbad bird, still wearing half its eggshell like shorts | Round body, huge wings | Air specialist. 4 air jumps, wing hitboxes, and a dive-bomb recovery. Could absorb Nawaf: the falcon becomes the fighter. | Royal blue with gold | Too big to be a baby and too clumsy to be a roc. It loudly wants to prove it can fly. |
| **Hirba** (Slinky, Tango) | حرباء | A chameleon trick-shot who uses her tongue as a grappling hook | Lanky, a curled tail, a wide flat hat | Trickster. A slingshot projectile, a tongue tether recovery, and color shifts when she is hit. | Lime with magenta bands (moves off magenta if Marjana stays) | Always chewing, never in a hurry. Her eyes look two ways at once. |

Keep from the current five:

- **Abu Sarab** already passes the silhouette test, and his lantern gag is strong. Keep him as he is.
- **Saif** stays as the baseline fighter, because every number is tuned around him. Push his personality: let Wahaj, the sash djinn, show a face and talk back in his idle and victory, so he is a double act rather than a guy with a sword.

## Directions (pick one)

| Direction | Launch six | Strength | Cost |
|---|---|---|---|
| **A. Storm's Guests** (recommended) | Saif, Abu Sarab, Vespera, Timber, Finjan, Tiktak | The biggest silhouette spread (tiny, slim, wide, huge, hunched, baseline), the two kept fighters protect the tuning, and the world still reads as the Gulf | 4 new fighters of art; Timber and Tiktak need an armor feature, Finjan needs per-fighter height |
| **B. Full reboot** | Six of the seven new concepts | The strongest personality per slot | All tuning and art restart; the current sheets go unused |
| **C. Folklore, pushed** | Saif, Abu Sarab, Finjan, Tiktak, Rukhayy, plus a reworked Marjana | Stays fully rooted in the region (Gulf coffee, the water-clock heritage, the Sindbad roc) and still breaks the robed-human pattern | 3 new fighters; Rukhayy needs extra air-jump tuning |

**Recommendation: A.** It gives the most character per credit spent. Finjan and Tiktak are local and characterful at the same time, so the Gulf identity survives, and Vespera and Timber are the instant hooks you asked for. Bench Brrr, Rukhayy and Hirba as season 2 guests: each is a ready-made reveal. Nawaf, Dana and Marjana keep their finished sheets; they can return as reworks rather than being thrown away.

Gender balance under A is 2 women (Vespera, plus Finjan if she becomes a girl, which costs nothing at the concept stage), 3 men and 1 machine. Swapping Timber for Hirba makes it 3 to 2, but Hirba needs projectiles and a tether.

## What the sim needs for these gimmicks

| Feature | Who needs it | Size |
|---|---|---|
| Per-fighter body height (today every fighter is 64 px) | Finjan, Tiktak, Brrr | Small: a `height` stat beside `hurtW` |
| Armor frames on a move (take the hit, keep the move) | Timber, Tiktak | Small: a field on the move, checked in hit resolution |
| Parry window | Vespera | Small |
| Damage-scaled stats | Brrr | Small |
| Projectiles | Hirba (and Dana's shell, still missing today) | Medium |
| Tether recovery | Hirba | Medium |

## Character beyond the design

The things that make a fighter feel alive, in order of cost:
1. The idle gag (one sheet per fighter, already in the budget).
2. A hit color and impact effect in the fighter's own hue instead of one shared spark.
3. Victory and taunt poses that show the gag. The game now plays the victory at match end.
4. One short sound per fighter for its jump, hit and KO.

## Concept review notes

- **Vespera:** must fix before the model sheet. The goblet reads as red wine in a stemmed glass, and alcohol imagery is flagged by GCC age ratings (GCAM in Saudi Arabia, plus the other GCC classification boards). Make it a whole pomegranate she bites like an apple (no juice drips), or a tea glass. Close the neckline up to the collar (CANON section 2). Her parasol and rapier came out as two items: merge them into one parasol whose tip is the blade, so the gimmick reads.
- **Timber:** the open vest shows his chest; it is fur on an animal, so it is fine. Plaid red stays only if Vespera does not ship; otherwise cobalt.
- **Finjan:** ready as is. The dallah reads instantly. Decide the gender now; the design works either way.
- **Tiktak:** the hero view is on four legs and the side view stands upright. Fighters must stand upright (feet read on platforms), so use the side view. Keep the chest clock without numerals (no text rule).
- **Brrr:** ready as is. The sweat drops and the fan are the idle.
- **Rukhayy:** ready as is. The wings make it the widest air silhouette; check the hurtbox against the wings.
- **Hirba:** ready as is. The spurs and duster read as western; keep the slingshot, no guns.

## Concept sheet jobs (Higgsfield, 16:9 2k; the server ran them on Nano Banana 2)

| Concept | Job ID |
|---|---|
| Vespera | `fac85560-b04b-465a-b95e-fc7cde8b2a42` |
| Timber | `7b681a37-7795-43f9-9f43-71724d57c123` |
| Finjan | `e5e6cb28-233a-4dcb-b6ff-a3508de9ee90` |
| Tiktak | `9fc3c11d-278a-420b-bacd-504ca4ef10ba` |
| Brrr | `8e43e027-735b-4a8f-8660-047aa697a24a` |
| Rukhayy | `fbfb43e2-9a75-4dd1-9091-78059a8aa376` |
| Hirba | `d78dca77-40e6-491b-a9fb-2b755ac552c8` |
