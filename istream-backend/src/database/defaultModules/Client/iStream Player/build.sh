#!/bin/bash
DIR="$(dirname -- "$0")"

# rm -rf "${DIR}/Build"

# git clone https://gitlab.cpsc.ucalgary.ca/mohdakram.ansari/beta-emulator-quic.git "${DIR}/Build"
cd "${DIR}/Build"
# git checkout dev
# git submodule init
# git submodule update --recursive

docker build -t headlessplayernew .