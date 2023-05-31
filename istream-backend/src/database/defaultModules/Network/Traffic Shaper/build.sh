#!/bin/bash

DIR="$(dirname -- "$0")"

docker build -q "${DIR}/Build" -t istream_network_tc_image
