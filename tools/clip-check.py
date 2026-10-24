"""Reject a clip whose art touches the video border: that part is cut and no fade can fix it.

usage: python3 tools/clip-check.py clip.mp4 [more.mp4 ...]
Prints the frames per side where the fighter or an effect reaches the edge, and exits 1 if any
clip is cut. The screen colour (green or magenta) is read from the clip's corners.
"""
import subprocess, sys
import numpy as np

W = H = 160
cut = False
for path in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    c = a[:, :4, :4].reshape(-1, 3).mean(axis=0)
    spill = (np.minimum(r, b) - g) if (c[1] < c[0] and c[1] < c[2]) else (g - np.maximum(r, b))
    solid = spill < 40
    sides = {"left": solid[:, :, 1], "right": solid[:, :, -2], "top": solid[:, 1, :], "bottom": solid[:, -2, :]}
    hits = {k: int((e.sum(axis=1) >= 3).sum()) for k, e in sides.items()}
    hits = {k: v for k, v in hits.items() if v}
    if hits: cut = True
    print(("CUT  " if hits else "ok   ") + path, f"({len(a)} frames)", ", ".join(f"{k} {v} frames" for k, v in hits.items()))
sys.exit(1 if cut else 0)
