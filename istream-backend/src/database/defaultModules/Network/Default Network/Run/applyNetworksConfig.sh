#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker exec network_container tcset eth0    --corrupt 2%

#if [ -f "${DIR}/config.sh" ]; then
   #docker cp "${DIR}/config.sh" network_container:/
#elif [ -f "${DIR}/Run/config.sh" ]; then
   #docker cp "${DIR}/Run/config.sh" network_container:/
#fi

#docker exec network_container chmod 777 ./config.sh
#docker exec network_container sh ./config.sh
