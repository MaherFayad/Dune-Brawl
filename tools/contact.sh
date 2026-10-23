#!/bin/bash
# usage: contact.sh out.jpg clip1.mp4 clip2.mp4 ...
out=$1; shift; rows=()
for c in "$@"; do ffmpeg -loglevel error -y -i "$c" -vf "select='not(mod(n\,5))',scale=180:180,tile=15x1" -frames:v 1 "${c%.mp4}_row.jpg"; rows+=("${c%.mp4}_row.jpg"); done
python3 -c "
import sys
from PIL import Image
ims=[Image.open(f) for f in sys.argv[2:]]
W=max(i.width for i in ims); c=Image.new('RGB',(W,sum(i.height for i in ims)),'white'); y=0
for i in ims: c.paste(i,(0,y)); y+=i.height
c.save(sys.argv[1],quality=80)" "$out" "${rows[@]}"
