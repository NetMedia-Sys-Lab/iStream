#!/bin/bash
# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
DIR="$(dirname -- "$0")"
docker build -q "${DIR}/Build" -t headless_player_component
