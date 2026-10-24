"""Build a wide start frame: the fighter small in a big flat screen, so moves stay in the clip.

usage: python3 tools/wide-start.py base-pose.png out.png [--height 0.4] [--x 0.36] [--magenta]

base-pose.png is the keyed, trimmed start pose (transparent background). The fighter is scaled
to --height of the frame, feet at 82% of the height, horizontally centered at --x (set back
from the right, the side every attack reaches toward). Upload out.png and use it as the clip's
start and end image for attacks, the jump and anything that travels.
"""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
arg = lambda k, d: float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
height, xc = arg("--height", 0.4), arg("--x", 0.36)
N = 1024
bg = (255, 0, 255) if "--magenta" in sys.argv else (0, 255, 0)
im = Image.open(src).convert("RGBA")
im = im.crop(im.getchannel("A").getbbox())
s = height * N / im.height
im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
canvas = Image.new("RGBA", (N, N), bg + (255,))
canvas.alpha_composite(im, (round(xc * N - im.width / 2), round(0.82 * N - im.height)))
canvas.convert("RGB").save(out)
print(out, f"fighter {im.width}x{im.height} in {N}x{N}")
