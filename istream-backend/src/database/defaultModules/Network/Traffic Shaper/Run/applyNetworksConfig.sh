#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

#docker exec istream_network_tc_container tcset eth0 ${delay} ${bandwidth} ${packetLoss} ${corruptPacket}

if [ -f "${DIR}/config.sh" ]; then
   docker cp "${DIR}/config.sh" istream_network_tc_container:/
elif [ -f "${DIR}/Run/config.sh" ]; then
   docker cp "${DIR}/Run/config.sh" istream_network_tc_container:/
fi

docker exec istream_network_tc_container chmod 777 ./config.sh
docker exec istream_network_tc_container bash ./config.sh