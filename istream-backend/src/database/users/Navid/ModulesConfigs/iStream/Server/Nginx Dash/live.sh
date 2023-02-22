#!/bin/bash

SOURCE=$( dirname ${BASH_SOURCE[0]} )
cd $SOURCE

ffmpeg -y \
    -re \
    -stream_loop 1 -i ./video.y4m \
    -c:v libx264 -x264opts "keyint=24:min-keyint=24:no-scenecut" -r 24 \
    -b:v 250k -filter:v "scale=-2:240" \
    -f dash \
    -seg_duration 1 -streaming 1 -window_size 5 -remove_at_exit 0 \
    ./live.mpd