#!/bin/bash
arguments=$1

# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
DIR="$(dirname -- "$0")"
networkDockerPort=$(jq -r '.networkContainerPort' <<<${arguments})

docker ps -a -q --filter "name=network_container" | grep -q . &&
    echo "Remove previous network docker container" && docker stop network_container && docker rm -fv network_container

python3 "${DIR}/Run/setupNetworkConfigs.py"

docker run --cap-add NET_ADMIN --name network_container -p ${networkDockerPort}:8080 -d network_image

sh "${DIR}/Run/applyNetworksConfig.sh"
