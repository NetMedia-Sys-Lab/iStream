#!/bin/bash
DIR="$(dirname -- "$0")"

serverIP=$(jq -r '.serverIP' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=mininet-server-container" | grep -q . &&
    echo "Remove previous network docker container" && docker rm -fv mininet-server-container

docker create --name mininet-server-container --rm --privileged -e DISPLAY --net customnetwork --ip ${serverIP} \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet-server-image

docker cp "${DIR}/Run" mininet-server-container:/
docker cp "${DIR}/Run/Videos/." mininet-server-container:/usr/local/nginx/html/
docker start mininet-server-container
# docker exec mininet-server-container python Run/Topology.py
