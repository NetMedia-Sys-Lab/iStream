#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

sudo docker build -t gpac_image -f "Build/Dockerfile" . 

# what should be done about the sudo? should we put sudo