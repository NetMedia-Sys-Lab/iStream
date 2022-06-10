#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

docker build -t gpac_image_sonali -f "Build/Dockerfile" . 

# what should be done about the sudo? should we put sudo