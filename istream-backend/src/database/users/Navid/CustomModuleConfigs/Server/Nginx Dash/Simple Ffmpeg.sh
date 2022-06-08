#!/bin/bash
ffmpeg -i ./usr/local/nginx/html/Navid_360.mp4 -codec copy -f dash -min_seg_duration 30 -use_template 1 -use_timeline 1 output.mpd
