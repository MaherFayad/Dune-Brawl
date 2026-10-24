"""Make the in-game copy of each sheet: the fighter colour grade baked in, saved as WebP.

usage: python3 tools/sheet-webp.py [sheet.png ...]   (default: every fighter sheet)

The game used to apply saturate(1.15) contrast(1.05) with a canvas filter at load, a full-size
redraw of every sheet. This applies the same CSS filter maths once, offline. Output is
<name>.webp (quality 92, about 3x smaller than PNG) or <name>.game.png when the sheet is wider
than WebP allows (16383 px). The original PNG stays as the master; the sheet JSON gets
"file" (what the game loads) and "inked": true.
"""
import glob, json, os, sys
import numpy as np
from PIL import Image

S, C = 1.15, 1.05
SAT = np.array([[0.213 + 0.787 * S, 0.715 - 0.715 * S, 0.072 - 0.072 * S],
                [0.213 - 0.213 * S, 0.715 + 0.285 * S, 0.072 - 0.072 * S],
                [0.213 - 0.213 * S, 0.715 - 0.715 * S, 0.072 + 0.928 * S]], dtype=np.float32)

paths = sys.argv[1:] or sorted(glob.glob("assets/fighters/*/anim-*/*.png"))
saved = 0
for p in paths:
    if p.endswith("_64px.png") or p.endswith(".game.png"): continue
    meta_path = p[:-4] + ".json"
    if not os.path.exists(meta_path): continue
    im = np.asarray(Image.open(p).convert("RGBA")).astype(np.float32) / 255
    rgb = np.clip(im[..., :3] @ SAT.T, 0, 1)             # CSS saturate()
    rgb = np.clip((rgb - 0.5) * C + 0.5, 0, 1)            # CSS contrast()
    out = Image.fromarray((np.dstack([rgb, im[..., 3:]]) * 255 + 0.5).astype(np.uint8), "RGBA")
    base = p[:-4]
    if out.width <= 16383:
        file = os.path.basename(base) + ".webp"
        out.save(base + ".webp", "WEBP", quality=92, method=6, alpha_quality=100)
    else:
        file = os.path.basename(base) + ".game.png"
        out.save(base + ".game.png", optimize=True)
    meta = json.load(open(meta_path)); meta["file"] = file; meta["inked"] = True
    json.dump(meta, open(meta_path, "w"), indent=2)
    saved += os.path.getsize(p) - os.path.getsize(os.path.join(os.path.dirname(p), file))
print(f"{len(paths)} sheets, {saved / 1e6:.1f} MB smaller in game")
