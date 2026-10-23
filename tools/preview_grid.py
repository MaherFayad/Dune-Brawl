"""Build an animated GIF grid of every sprite sheet under assets/fighters/*/anim-test.

usage: python3 tools/preview_grid.py out.gif [fighter-id ...]
"""
import json, pathlib, sys
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "fighters"
NAMES = {"djinn-warrior": "Saif", "dune-ghoul": "Abu Sarab", "falcon-rider": "Nawaf",
         "sea-siren": "Dana", "dagger-dancer": "Marjana"}
ORDER = ["idle", "run", "jump", "fall", "land", "hurt", "tumble", "jab", "side_light", "down_light",
         "up_light", "nair", "side_heavy", "down_heavy", "dair", "recovery", "victory", "taunt"]
ONLY = sys.argv[2:]
TILE, LABEL, COLS, STEPS = 240, 20, 5, 48
SCALE = 0.75  # one scale for every sheet, so fighters and moves compare at true size
ANCHOR = (90, TILE - 8)  # where each sheet's foot pivot lands in its tile

items = []
for fid, name in NAMES.items():
    if ONLY and fid not in ONLY:
        continue
    d = ROOT / fid / "anim-test"
    hooks = sorted(p.stem for p in d.glob("hook_*.png"))
    for n in ORDER + hooks:
        p = d / f"{n}.png"
        if p.exists():
            im = Image.open(p)
            size = im.height
            meta = json.load(open(p.with_suffix(".json")))
            px, py = meta.get("pivot", [size * 5 // 16, size - 6])
            frames = []
            for i in range(im.width // size):
                f = im.crop((i * size, 0, (i + 1) * size, size))
                f = f.resize((round(size * SCALE), round(size * SCALE)), Image.LANCZOS)
                tile = Image.new("RGBA", (TILE, TILE))
                tile.paste(f, (round(ANCHOR[0] - px * SCALE), round(ANCHOR[1] - py * SCALE)), f)
                frames.append(tile)
            items.append((f"{name}  {n.replace('_', ' ')}", frames))

rows = (len(items) + COLS - 1) // COLS
out = []
for t in range(STEPS):
    c = Image.new("RGBA", (COLS * TILE, rows * (TILE + LABEL)), (34, 22, 52, 255))
    d = ImageDraw.Draw(c)
    for k, (label, frames) in enumerate(items):
        x, y = (k % COLS) * TILE, (k // COLS) * (TILE + LABEL)
        c.alpha_composite(frames[t % len(frames)], (x, y))
        d.text((x + 6, y + TILE + 4), label, fill=(246, 239, 230, 255))
    out.append(c.convert("P", palette=Image.ADAPTIVE, colors=255))
out[0].save(sys.argv[1], save_all=True, append_images=out[1:], duration=50, loop=0, disposal=2)
print(f"{len(items)} animations -> {sys.argv[1]}")
