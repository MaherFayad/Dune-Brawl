"""Soften hard straight cuts inside sprite sheet frames (an effect that left the source clip).

usage: python3 tools/feather-cuts.py [--dry] [sheet.png ...]   (default: every fighter sheet)

A cut is a straight boundary at least 22 px long between solid art and empty space where the
art has no dark outline (drawn edges always have one). The art fades out over a few pixels
toward the cut instead of ending in a hard line. Writes the sheet in place and lists each fix.
"""
import glob, json, sys
import numpy as np
from PIL import Image

MIN_RUN, DEPTH, FADE = 22, 10, 28
dry = "--dry" in sys.argv
paths = [p for p in sys.argv[1:] if not p.startswith("--")] or sorted(glob.glob("assets/fighters/*/anim-*/*.png"))


def cuts(rgba):
    """yield (axis-flip name, column, row0, row1) for bright straight right-side boundaries"""
    o = rgba[..., 3] > 128
    lum = rgba[..., :3].astype(np.int32).mean(axis=2)
    H, W = o.shape
    for x in range(DEPTH, W - 1):
        edge = o[:, x] & ~o[:, x + 1] & o[:, x - DEPTH + 1:x + 1].all(axis=1)
        y = 0
        while y < H:
            if not edge[y]: y += 1; continue
            y0 = y
            while y < H and edge[y]: y += 1
            if y - y0 >= MIN_RUN and lum[y0:y, x].mean() > 95:  # bright at the edge: no outline, a cut
                yield x, y0, y


def fix(cell):
    changed = []
    # check all four sides by flipping or transposing so the cut is always on the right
    views = {"right": lambda a: a, "left": lambda a: a[:, ::-1], "bottom": lambda a: a.transpose(1, 0, 2), "top": lambda a: a.transpose(1, 0, 2)[:, ::-1]}
    for side, view in views.items():
        v = view(cell)  # numpy views: writes go back into cell
        for x, y0, y1 in list(cuts(v)):
            ys = slice(max(0, y0 - 3), min(v.shape[0], y1 + 3))
            ramp = np.linspace(1, 0, FADE) ** 1.2
            x0 = max(0, x - FADE + 1)
            a = v[ys, x0:x + 1, 3].astype(np.float32) * ramp[-(x + 1 - x0):][None, :]
            v[ys, x0:x + 1, 3] = a.astype(np.uint8)
            changed.append(f"{side}@{x}:{y1 - y0}px")
    return changed


total = 0
for p in paths:
    if p.endswith("_64px.png"): continue
    size = json.load(open(p[:-4] + ".json"))["frameSize"]
    sheet = np.asarray(Image.open(p).convert("RGBA")).copy()
    report = []
    for k in range(sheet.shape[1] // size):
        cell = sheet[: size - 8, k * size:(k + 1) * size]  # leave the floor band alone
        c = fix(cell)
        if c: report.append(f"f{k} " + " ".join(c))
    if report:
        total += 1
        print(p, "|", "; ".join(report[:6]), "..." if len(report) > 6 else "")
        if not dry: Image.fromarray(sheet, "RGBA").save(p, optimize=True)
print(f"{total} sheets {'would change' if dry else 'softened'}")
