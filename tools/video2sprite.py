"""Turn a green-screen animation clip into a sprite sheet.

usage: python3 video2sprite.py clip.mp4 out_prefix frame_count [frame_size] [--trim] [--motion] [--magenta] [--skip=SECONDS]

The clip must be shot on flat pure green (#00FF00), starting from the fighter's ready pose, so the
first frame sets one scale and foot pivot shared by every sheet. --trim drops the held frames
before and after the motion (use it for attacks). --motion samples by movement instead of evenly in time (use it for attacks). --magenta keys #FF00FF instead (for green fighters).
The cell grows when a move reaches past it, and content touching the clip's border is faded out
rather than cut. --skip=SECONDS drops the start of the clip (a loop that begins with a transition) but still takes
the scale from the first frame, which is the ready pose.

Writes out_prefix.png (sheet, one row), out_prefix.json (atlas), out_prefix_preview.gif
(on a dark background) and out_prefix_64px.png (all frames at in-game height 64 px).
"""
import json, subprocess, sys, tempfile, pathlib
import numpy as np
from PIL import Image

clip, prefix, count = sys.argv[1], sys.argv[2], int(sys.argv[3])
size = int(sys.argv[4]) if len(sys.argv) > 4 else 256

tmp = pathlib.Path(tempfile.mkdtemp())
subprocess.run(["ffmpeg", "-loglevel", "error", "-i", clip, str(tmp / "f%04d.png")], check=True)
src = sorted(tmp.glob("f*.png"))
skip = next((float(x.split("=")[1]) for x in sys.argv if x.startswith("--skip=")), 0.0)
if skip:
    num, den = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
                               "-of", "csv=p=0", clip], capture_output=True, text=True, check=True).stdout.strip().split("/")
    src = src[round(skip * float(num) / float(den)):]
trim = "--trim" in sys.argv
if trim:
    # keep only the span where the pose differs from the first frame (drop the held start and end)
    small = [np.asarray(Image.open(p).convert("L").resize((96, 96))).astype(np.int32) for p in src]
    d = [np.abs(s - small[0]).mean() for s in small]
    thr = max(1.5, 0.12 * max(d))  # relative, so small or slow fighters are not cut
    moving = [i for i, v in enumerate(d) if v > thr]
    lo, hi = (max(0, moving[0] - 2), min(len(src) - 1, moving[-1] + 2)) if moving else (0, len(src) - 1)
    src = src[lo:hi + 1]
if "--motion" in sys.argv:
    # spend frames where the pose changes: half by time, half by accumulated motion, so a long
    # held wind-up gets a few frames and the fast strike gets most of them
    small = [np.asarray(Image.open(p).convert("L").resize((96, 96))).astype(np.int32) for p in src]
    step = [0.0] + [float(np.abs(b - a).mean()) for a, b in zip(small, small[1:])]
    cum = np.cumsum(step); cum = cum / cum[-1] if cum[-1] else np.linspace(0, 1, len(src))
    w = 0.5 * np.linspace(0, 1, len(src)) + 0.5 * cum
    pick = [src[int(np.searchsorted(w, i / max(1, count - 1), side="left").clip(0, len(src) - 1))] for i in range(count)]
else:
    pick = [src[round(i * (len(src) - 1) / max(1, count - 1))] for i in range(count)]


MAGENTA = "--magenta" in sys.argv  # for green fighters: shoot on #FF00FF instead


def key(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if MAGENTA:
        spill = np.minimum(r, b) - g
        bright = np.minimum(r, b)
    else:
        spill = g - np.maximum(r, b)
        bright = g
    # fully key colored -> 0, clearly not -> 255, soft ramp between
    alpha = np.clip((90 - spill) * 255 // 60, 0, 255)
    alpha[bright < 120] = 255
    # despill the remaining edge pixels
    if MAGENTA:
        r2 = np.where(spill > 0, np.maximum(g, np.minimum(r, b) - spill), r)
        b2 = np.where(spill > 0, np.maximum(g, np.minimum(r, b) - spill), b)
        out = np.dstack([r2, g, b2, alpha])
    else:
        g2 = np.where(spill > 0, np.maximum(r, b), g)
        out = np.dstack([r, g2, b, alpha])
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def feather(im, px):
    """Fade the alpha toward any source-frame border the content touches, so an effect that left
    the clip dissolves instead of ending in a hard straight cut."""
    a = np.asarray(im).copy()
    al = a[..., 3].astype(np.float32)
    H, W = al.shape
    ramp = np.linspace(0, 1, px, endpoint=False) ** 0.8
    if (al[:, 0] > 128).sum() > 3: al[:, :px] *= ramp[None, :]
    if (al[:, -1] > 128).sum() > 3: al[:, -px:] *= ramp[::-1][None, :]
    if (al[0, :] > 128).sum() > 3: al[:px, :] *= ramp[:, None]
    a[..., 3] = al.astype(np.uint8)
    return Image.fromarray(a, "RGBA")


frames = [key(p) for p in pick]
frames = [feather(f, max(8, f.width // 24)) for f in frames]
# fixed scale from the ready pose (first frame of the clip): every sheet of a fighter gets the same
# body height and the same foot pivot, so animations line up in game
BODY = 128                   # ready-pose height in px, the same in every sheet so fighters keep one scale
ref = key(sorted(tmp.glob("f*.png"))[0]).getchannel("A").getbbox()
scale = BODY / (ref[3] - ref[1])
foot_x = (ref[0] + ref[2]) / 2
scaled = [f.resize((round(f.width * scale), round(f.height * scale)), Image.LANCZOS) for f in frames]
# the cell grows to fit every frame, so a big move is never clipped by its cell: measure how far
# the content reaches left, right and up from the feet across all frames
ox, oy = foot_x * scale, ref[3] * scale
boxes = [b for b in (im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox() for im in scaled) if b]
reach_l = max([ox - b[0] for b in boxes] + [0]); reach_r = max([b[2] - ox for b in boxes] + [0])
reach_u = max([oy - b[1] for b in boxes] + [0])
need = max(size, int(-(-max(reach_l / (5 / 16), (reach_r + 4) / (11 / 16), reach_l + reach_r + 8, reach_u + 14) // 32) * 32))
if need > size:
    print(f"cell {size} -> {need}: the move reaches {reach_l:.0f} px back, {reach_r:.0f} forward, {reach_u:.0f} up")
    size = need
PIVOT = (max(size * 5 // 16, int(reach_l) + 4), size - 6)  # feet left of center: the fighter faces right
cells = []
for big in scaled:
    cell = Image.new("RGBA", (size, size))
    cell.alpha_composite(big, (round(PIVOT[0] - ox), round(PIVOT[1] - oy)))
    cells.append(cell)
sheet = Image.new("RGBA", (size * count, size))
for i, c in enumerate(cells):
    sheet.alpha_composite(c, (i * size, 0))
sheet.save(prefix + ".png", optimize=True)
json.dump({"frameSize": size, "frames": count, "pivot": list(PIVOT), "bodyHeight": BODY, "source": pathlib.Path(clip).name,
           "sourceFrames": len(src)}, open(prefix + ".json", "w"), indent=2)

bg = (34, 22, 52, 255)
gif = []
for c in cells:
    d = Image.new("RGBA", c.size, bg); d.alpha_composite(c); gif.append(d.convert("P", palette=Image.ADAPTIVE))
gif[0].save(prefix + "_preview.gif", save_all=True, append_images=gif[1:], duration=1000 // 24, loop=0, disposal=2)

# readability check: character drawn about 64 px tall, as in game
small = max(1, round(size * 64 / BODY))
strip = Image.new("RGBA", (small * count, small), bg)
for i, c in enumerate(cells):
    strip.alpha_composite(c.resize((small, small), Image.LANCZOS), (i * small, 0))
strip.save(prefix + "_64px.png")
print(f"{clip}: {len(src)} source frames -> {count} x {size}px, scale {scale:.3f}")
