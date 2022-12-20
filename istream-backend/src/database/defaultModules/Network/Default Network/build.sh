#!/bin/bash
arguments=$1
# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
DIR="$(dirname -- "$0")"
python3 "${DIR}/Build/createNginxConfigFile.py" "${arguments}"

docker build -q "${DIR}/Build" -t network_image
