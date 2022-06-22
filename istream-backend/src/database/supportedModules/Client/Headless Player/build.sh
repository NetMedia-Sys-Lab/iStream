#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker build -q "${DIR}/Build" -t client_image

# echo "building client"