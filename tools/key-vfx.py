"""Key a green-screen effect sheet to transparency and split it into separate sprites.

usage: python3 tools/key-vfx.py sheet.png out_dir name [--single]

Pieces laid out in a row with empty columns between them become name1.webp, name2.webp, ...;
--single keeps the whole keyed image as name.webp. Keying matches tools/video2sprite.py.
"""
import pathlib, sys
import numpy as np
from PIL import Image

src, out, name = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3]
a = np.asarray(Image.open(src).convert("RGB")).astype(np.int32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
spill = g - np.maximum(r, b)
alpha = np.clip((90 - spill) * 255 // 60, 0, 255)
alpha[g < 120] = 255
g2 = np.where(spill > 0, np.maximum(r, b), g)  # despill the edges
img = Image.fromarray(np.dstack([r, g2, b, alpha]).astype(np.uint8), "RGBA")
out.mkdir(parents=True, exist_ok=True)


def save(im, path):
    im = im.crop(im.getchannel("A").getbbox())
    im.thumbnail((512, 512), Image.LANCZOS)  # effects are drawn at 0.5 to 3 bodies
    im.save(path, quality=90)
    print(path, im.size)


if "--single" in sys.argv:
    save(img, out / f"{name}.webp")
else:
    cols = (alpha > 128).sum(axis=0) > 2
    runs, start = [], None
    for x, on in enumerate(list(cols) + [False]):
        if on and start is None: start = x
        if not on and start is not None:
            if x - start > 20: runs.append((start, x))
            start = None
    for k, (x0, x1) in enumerate(runs, 1):
        save(img.crop((x0, 0, x1, img.height)), out / f"{name}{k}.webp")
