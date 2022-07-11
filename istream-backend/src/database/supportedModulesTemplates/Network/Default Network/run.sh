#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker ps -a -q --filter "name=network_container" | grep -q . &&
    echo "Remove previous network docker container" && docker stop network_container && docker rm -fv network_container

docker run --cap-add NET_ADMIN --name network_container -p ${networkContainerPort}:8080 -d network_image

${defaultConfig}docker exec network_container tcset eth0 ${delay} ${bandwidth} ${packetLoss} ${corruptPacket}
${manualConfig}docker cp "${DIR}/Config/config.sh" network_container:/
${manualConfig}docker exec network_container chmod 777 ./config.sh
${manualConfig}docker exec network_container ./config.sh
