#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

ffmpeg -i test.mp4 -codec copy -f dash -min_seg_duration 30 -use_template 1 -use_timeline 1 output.mpd
