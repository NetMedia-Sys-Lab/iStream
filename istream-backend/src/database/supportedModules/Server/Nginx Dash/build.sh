#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

# docker build -t server_image -f "Build/Dockerfile" . --build-arg configExist=true

# what should be done about the sudo? should we put sudo