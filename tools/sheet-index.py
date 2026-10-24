"""Write index.json in each fighter art folder, listing the sheets it has, so the game loads
only what exists instead of probing every sheet name.

usage: python3 tools/sheet-index.py [assets/fighters]
"""
import json, pathlib, sys

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "assets/fighters")
for folder in sorted(root.glob("*/anim-*")):
    sheets = sorted(p.stem for p in folder.glob("*.png") if (folder / f"{p.stem}.json").exists() and not p.stem.endswith("_64px"))
    if sheets:
        (folder / "index.json").write_text(json.dumps({"sheets": sheets}) + "\n")
        print(folder, len(sheets))
