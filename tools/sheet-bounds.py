"""Store each frame's art bounds in the sheet's JSON, so the game does not have to read every
pixel back at load time (that scan froze the page for about a second per match).

usage: python3 tools/sheet-bounds.py [sheet.png ...]   (default: every fighter sheet)
Matches the game's old scan: alpha above 96, sampled every 2 px; null for an empty frame.
"""
import glob, json, sys
import numpy as np
from PIL import Image

paths = sys.argv[1:] or sorted(glob.glob("assets/fighters/*/anim-*/*.png"))
for p in paths:
    if p.endswith("_64px.png"): continue
    meta_path = p[:-4] + ".json"
    meta = json.load(open(meta_path))
    a = np.asarray(Image.open(p).convert("RGBA"))[..., 3]
    size = meta.get("frameSize") or a.shape[0]
    bounds = []
    for k in range(a.shape[1] // size):
        c = a[0:size:2, k * size:(k + 1) * size:2] > 96
        ys, xs = np.nonzero(c)
        bounds.append(None if len(xs) == 0 else [int(xs.min()) * 2, int(ys.min()) * 2, int(xs.max()) * 2, int(ys.max()) * 2])
    meta["bounds"] = bounds
    json.dump(meta, open(meta_path, "w"), indent=2)
print(f"{len(paths)} sheets")
