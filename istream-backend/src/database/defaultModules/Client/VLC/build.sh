#!/bin/bash

DIR="$(dirname -- "$0")"
cd "${DIR}/Build"

docker build -t vlc_image .
