"""Turn a green-screen animation clip into a sprite sheet.

usage: python3 video2sprite.py clip.mp4 out_prefix frame_count [frame_size] [--trim]

The clip must be shot on flat pure green (#00FF00), starting from the fighter's ready pose, so the
first frame sets one scale and foot pivot shared by every sheet. --trim drops the held frames
before and after the motion (use it for attacks).

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
trim = "--trim" in sys.argv
if trim:
    # keep only the span where the pose differs from the first frame (drop the held start and end)
    small = [np.asarray(Image.open(p).convert("L").resize((96, 96))).astype(np.int32) for p in src]
    d = [np.abs(s - small[0]).mean() for s in small]
    moving = [i for i, v in enumerate(d) if v > 4]
    lo, hi = (max(0, moving[0] - 2), min(len(src) - 1, moving[-1] + 2)) if moving else (0, len(src) - 1)
    src = src[lo:hi + 1]
pick = [src[round(i * (len(src) - 1) / max(1, count - 1))] for i in range(count)]


def key(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    # fully green -> 0, clearly not green -> 255, soft ramp between
    alpha = np.clip((90 - spill) * 255 // 60, 0, 255)
    alpha[(g < 120)] = 255
    # despill: pull green down to the max of red and blue on remaining pixels
    g2 = np.where(spill > 0, np.maximum(r, b), g)
    out = np.dstack([r, g2, b, alpha]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


frames = [key(p) for p in pick]
# fixed scale from the ready pose (first frame of the clip): every sheet of a fighter gets the same
# body height and the same foot pivot, so animations line up in game
BODY = 150                     # ready-pose height in px inside the cell
PIVOT = (size * 3 // 8, size - 6)  # feet slightly left of center: the fighter faces right
ref = key(sorted(tmp.glob("f*.png"))[0]).getchannel("A").getbbox()
scale = BODY / (ref[3] - ref[1])
foot_x = (ref[0] + ref[2]) / 2
cells = []
for f in frames:
    big = f.resize((round(f.width * scale), round(f.height * scale)), Image.LANCZOS)
    cell = Image.new("RGBA", (size, size))
    cell.alpha_composite(big, (round(PIVOT[0] - foot_x * scale), round(PIVOT[1] - ref[3] * scale)))
    cells.append(cell)
w = h = 0
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
