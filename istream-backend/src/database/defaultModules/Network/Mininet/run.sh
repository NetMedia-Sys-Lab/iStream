#!/bin/bash
DIR="$(dirname -- "$0")"

networkIP=$(jq -r '.networkIP' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=mininet-container" | grep -q . &&
    echo "Remove previous network docker container" && docker rm -fv mininet-container

calculate_subnet() {
    local ip=$1
    local subnet=$(echo "$ip" | awk -F. '{print $1"."$2".0.0/16"}')
    echo "$subnet"
}

subnet=$(calculate_subnet "$networkIP")
echo "Subnet: $subnet"

docker network create --subnet=$subnet customnetwork || true

python3 "${DIR}/Run/convertToFile.py"

docker create --name mininet-container --rm --privileged -e DISPLAY --net customnetwork --ip ${networkIP} \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet-network-image

docker cp "${DIR}/Run" mininet-container:/root
docker start mininet-container
docker exec mininet-container bash Run/startRyu.sh
docker exec mininet-container python Run/Topology.py 

