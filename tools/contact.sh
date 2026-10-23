#!/bin/bash
# usage: contact.sh out.jpg clip1.mp4 [clip2.mp4 ...]
# One row of 15 frames per clip, sampled evenly over the whole clip (3 s or 5 s).
out=$1; shift; rows=()
for c in "$@"; do
  n=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$c")
  step=$(( (n + 14) / 15 )); [ "$step" -lt 1 ] && step=1
  ffmpeg -loglevel error -y -i "$c" -vf "select='not(mod(n\,$step))',scale=180:180,tile=15x1" -frames:v 1 "${c%.mp4}_row.jpg"
  rows+=("${c%.mp4}_row.jpg")
done
python3 -c "
import sys
from PIL import Image
ims=[Image.open(f) for f in sys.argv[2:]]
W=max(i.width for i in ims); c=Image.new('RGB',(W,sum(i.height for i in ims)),'white'); y=0
for i in ims: c.paste(i,(0,y)); y+=i.height
c.save(sys.argv[1],quality=80)" "$out" "${rows[@]}"
