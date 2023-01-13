#!/bin/bash
DIR="$(dirname -- "$0")"

clientIP=$(jq -r '.clientIP' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=mininet-client-container" | grep -q . &&
    echo "Remove previous client docker container" &&  docker rm -fv mininet-client-container

docker create --name mininet-client-container --rm --privileged -e DISPLAY --net customnetwork --ip ${clientIP} \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet-headless-player-image

docker cp "${DIR}/Run" mininet-client-container:/dash-emulator-different-ABR
docker start mininet-client-container

sleep 10
docker exec mininet-client-container python Run/Topology.py &
