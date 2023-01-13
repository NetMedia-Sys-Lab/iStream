#!/bin/bash
DIR="$(dirname -- "$0")"

networkIP=$(jq -r '.networkIP' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=mininet-container" | grep -q . &&
    echo "Remove previous network docker container" && docker rm -fv mininet-container

docker create --name mininet-container --rm --privileged -e DISPLAY --net customnetwork --ip ${networkIP} \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet-network-image

docker cp "${DIR}/Run" mininet-container:/root
docker start mininet-container
docker exec mininet-container bash Run/startRyu.sh
docker exec mininet-container python Run/Topology.py &
