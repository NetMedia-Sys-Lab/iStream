#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

${defaultConfig}docker exec network_container tcset eth0 ${delay} ${bandwidth} ${packetLoss} ${corruptPacket}

${manualConfig}if [ -f "${DIR}/config.sh" ]; then
   ${manualConfig}docker cp "${DIR}/config.sh" network_container:/
${manualConfig}elif [ -f "${DIR}/Run/config.sh" ]; then
   ${manualConfig}docker cp "${DIR}/Run/config.sh" network_container:/
${manualConfig}fi

${manualConfig}docker exec network_container chmod 777 ./config.sh
${manualConfig}docker exec network_container sh ./config.sh
