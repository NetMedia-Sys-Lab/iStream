#!/bin/bash
DIR="$(dirname -- "$0")"

docker build "${DIR}/Build" -t mininet-network-image

