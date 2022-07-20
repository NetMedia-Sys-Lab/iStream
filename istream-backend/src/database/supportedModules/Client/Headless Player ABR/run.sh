#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker ps -a -q --filter "name=headless_player_container" | grep -q . &&
    echo "Remove previous headless player docker container" && docker stop headless_player_container && docker rm -fv headless_player_container

docker run --name headless_player_container headless_player_component scripts/dash-emulator.py  --dump-results results/result http://192.168.0.22:9090/output.mpd

index=1
printf -v dirpath "Results/result-%03d" $index
while [ -d "${DIR}/${dirpath}" ]; do
    index=$((index + 1))
    printf -v dirpath "Results/result-%03d" $index
done
mkdir -p "${DIR}/${dirpath}"

docker cp headless_player_container:dash-emulator-different-ABR/results/. "${DIR}/${dirpath}"
