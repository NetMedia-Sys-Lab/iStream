#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker ps -q --filter "name=network_container" | grep -q . &&
    echo "Remove previous network docker container" && docker stop network_container && docker rm -fv network_container

docker run --cap-add NET_ADMIN --name network_container -p 9090:8080 -d network_image

docker exec network_container tcset eth0    
#docker cp "${DIR}/Config/config.sh" network_container:/
#docker exec network_container chmod 777 ./config.sh
#docker exec network_container ./config.sh
