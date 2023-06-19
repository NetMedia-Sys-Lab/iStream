#!/bin/bash
DIR="$(dirname -- "$0")"

serverIP=$(jq -r '.serverIP' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=mininet-server-container" | grep -q . &&
    echo "Remove previous network docker container" && docker rm -fv mininet-server-container



calculate_subnet() {
    local ip=$1
    local subnet=$(echo "$ip" | awk -F. '{print $1"."$2".0.0/16"}')
    echo "$subnet"
}

subnet=$(calculate_subnet "$serverIP")
echo "Subnet: $subnet"

docker network create --subnet=$subnet customnetwork || true

python3 "${DIR}/Run/convertToFile.py"

docker create --name mininet-server-container --rm --privileged -e DISPLAY --net customnetwork --ip ${serverIP} \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet-server-image

find "${DIR}/Run" -maxdepth 1 -type f -exec docker cp {} mininet-server-container:/ \;

docker cp "${DIR}/Run/Videos/." mininet-server-container:/usr/local/nginx/html/
docker start mininet-server-container
docker exec mininet-server-container python Topology.py
