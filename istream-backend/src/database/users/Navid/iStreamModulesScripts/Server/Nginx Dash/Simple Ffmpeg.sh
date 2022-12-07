#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

#ffmpeg -i test.mp4 -codec copy -f dash -min_seg_duration 30 -use_template 1 -use_timeline 1 output.mpd

ffmpeg -codec:a libvo_aacenc -ar 44100 -ac 1 -codec:v libx264 -profile:v baseline -level 13 -b:v 2000k output.mp4 -i test.mp4

