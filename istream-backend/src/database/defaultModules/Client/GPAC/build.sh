#!/bin/bash

DIR="$(dirname -- "$0")"
cd "${DIR}/Build"

docker build -t gpac_image .
