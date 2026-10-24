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

## Stage: Dune Island (`assets/stages/dune-island/`)

| File | Higgsfield job | Notes |
|---|---|---|
| `background.jpg` | `0e36b250-a446-4c5a-9de0-aabb0095cb39` | Nano Banana Pro 21:9, dusk dunes and the storm ring of floating rocks |
| `island.webp` | `3686b097-92fd-405d-8861-d1c263d4abc1` | Main island, keyed from green, top ghost band cropped |
| `platform.webp` | `9edf10cf-72f7-41f7-af10-4cc62b945e52` | Soft platform slab, keyed from green (first try leaked character art and was rejected) |

## Effects (`assets/vfx/`)

Nano Banana Pro on pure black, converted to transparency by un-premultiplying from black (alpha from brightness).

| File | Higgsfield job | Use |
|---|---|---|
| `spark.webp` | `6174bec2-45ac-4c47-9192-0f5365375370` | Light hit spark |
| `heavy.webp` | `4d58ff99-75e1-415d-9b1a-cb9aa0b5bad8` | Heavy hit impact, also part of the KO |
| `ko.webp` | `0a5f1df7-73d6-4f15-a098-3a4876c954a6` | KO blast beam, aimed at stage center |
| `slash.webp` | `faee2a68-364e-4f71-82bd-a1d9adb1d982` | Slash arc behind heavy hits |
| `dust.webp` | `184f2765-71f0-4dd7-92fe-951f95e13e98` | Landing, jump and dodge dust |

### Effects v2: flat white cel set (from docs/design/REFERENCE-VFX.md)

Painted on pure green and keyed with `tools/key-vfx.py` (same keying as the sprite converter), so the grey cel shades stay opaque.

| Files | Higgsfield job | Use |
|---|---|---|
| `star1-3.webp` | `ab0b62ac-b3b3-4fcd-b1a8-810c6c677ebf` | Hit sparks at the contact point (0.45 bodies light, 0.62 heavy) and the parry ring |
| `puff1-4.webp` | `f264879c-2d11-4a0c-aceb-6f9e12d03b0d` | Launch cloud column (drawn under the fighters), landing and air jump puffs |
| `smear1-3.webp` | `8446edab-16d7-4898-92e8-a2435f672e3d` | White swing crescent on every light attack, hit or miss |
| `kick1-3.webp` | `0c68e8a7-1faa-4651-935b-af6325e39e8a` | Jump, dash and dodge take-off splash |
| `ko-splash.webp` | `0ec9ea16-aaa9-4c5d-ac22-ad35166cf8b6` | KO ink splash at the screen edge |
| `ko-cloud.webp` | `e6ca030e-f8d1-47d3-ad80-614a94db41f8` | KO cloud bank at the screen edge |

The v1 painted effects (`spark`, `heavy`, `ko`, `slash`, `dust`) were removed: they had straight cut edges and are replaced by this set.
