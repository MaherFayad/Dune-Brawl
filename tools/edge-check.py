"""Find sprites that are cut off: opaque pixels touching a frame or image border.

usage: python3 tools/edge-check.py [paths...]   (default: every sheet and effect sprite)

For a sheet, each frame (cell) is checked on all four sides; the floor row is skipped because
feet sit on it by design. Prints sheet, side, number of bad frames and the worst run of opaque
border pixels, so a hard straight cut (long run) stands out from a stray speck.
"""
import glob, json, pathlib, sys
import numpy as np
from PIL import Image

def runs(edge):
    best = cur = 0
    for v in edge:
        cur = cur + 1 if v else 0
        best = max(best, cur)
    return best

def check(path, size=None, skip_floor=True):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[..., 3] > 128
    size = size or im.height
    n = max(1, im.width // size)
    out = {}
    for k in range(n):
        c = a[:, k * size:(k + 1) * size]
        sides = {"left": c[:, 0], "right": c[:, -1], "top": c[0, :]}
        if not skip_floor: sides["bottom"] = c[-1, :]
        for side, e in sides.items():
            r = runs(e)
            if r >= 6:
                f, w = out.get(side, (0, 0)); out[side] = (f + 1, max(w, r))
    return n, out

paths = sys.argv[1:] or sorted(glob.glob("assets/fighters/*/anim-*/*.png")) + sorted(glob.glob("assets/vfx/*.webp"))
bad = 0
for p in paths:
    if p.endswith("_64px.png"): continue
    meta = pathlib.Path(p).with_suffix(".json")
    size = json.load(open(meta)).get("frameSize") if meta.exists() else None
    n, out = check(p, size, skip_floor=size is not None)
    if out:
        bad += 1
        print(p, f"{n} frames:", ", ".join(f"{s} {f} frames (run {w}px)" for s, (f, w) in out.items()))
print(f"{bad} sprites with cut edges")
