# Art manifest

Higgsfield job IDs for every source image kept in `assets/fighters/<id>/source/`. The repo holds compressed copies (model sheet as 1600 px JPG, base pose as a trimmed 768 px PNG). Full-resolution originals stay in the Higgsfield library under these IDs; pass a job ID as a reference image to reuse one.

Style anchor: every fighter's model sheet was generated with Saif's sheet (`e15dac77`) attached as a style reference, so the roster shares one line weight, shading and saturation.

| Fighter | Model sheet (Nano Banana Pro, 16:9, 2k) | Base pose (FLUX 3, 1:1, 2k) | Cutout (background removed, AutoSprite input) |
|---|---|---|---|
| `djinn-warrior` | `e15dac77-9951-45e7-b978-f7568d86b5ab` | `fdf177ba-c6d0-4c15-9bf1-181fb10cc2c5` | `cc6fff0b-7462-4c8f-8043-acc9c31fcb60` |
| `dune-ghoul` | `29226d73-3a15-4c28-98b2-849b4c709142` | `084ac799-3c4a-4570-9581-8233fbb1a28c` | `c3beae2b-73e4-4aa9-b52b-f5a15f077244` |
| `falcon-rider` | `65aa4690-4ae2-4ff9-859d-3bdd22c676cf` | `7d549f14-b8d3-467a-9125-d94439da8a3b` | `ffd94789-23e0-4701-ba01-a19a9060549f` |
| `sea-siren` | `9de256a9-e308-428b-8394-51dcb064d5c7` | `87a642fb-6785-4ad2-9725-f9184638f6bb` | `19d8cc7a-a5d5-4310-bda7-4c9c5ab2e2f5` |
| `dagger-dancer` | `db29dac5-3666-4cfb-aad6-22ceea66f26d` | `1b07b50c-2274-42bf-888f-f6fdb83fc11f` | `820ce6c2-f764-4fab-a545-af326d8f54b4` |

## Selection notes

- Saif: 4 drafts. Picked the only one with the turban kept on in all 4 expressions and long sleeves as specified; two drafts drew him bald in the expression row and one sleeveless.
- Abu Sarab: 3 drafts. Picked the strongest boulder back and donkey ears. None of the drafts is truly wider than tall; the base pose prompt pushes the hunch further.
- Nawaf: 3 drafts. Picked the cleanest rear-shoulder falcon with the gold hood on the belt.
- Dana: 3 drafts. Picked the one with the shell-shaped hem and the shell shown alone from the front and the edge.
- Marjana: 3 drafts. Two drafts leaked Saif's turquoise glowing eyes into the expression row; picked the one without it.

## Costs (credits)

Nano Banana Pro 2k image: 2. FLUX 3 2k image: 3. AutoSprite sheet: 2 turbo, 3 pro.
