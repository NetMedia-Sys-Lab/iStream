#!/bin/bash
arguments=$1

# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
DIR="$(dirname -- "$0")"
networkDockerPort=$(jq -r '.networkContainerPort' <<<${arguments})

docker ps -a -q --filter "name=istream_network_tc_container" | grep -q . &&
    echo "Remove previous network docker container" && docker stop istream_network_tc_container && docker rm -fv istream_network_tc_container

python3 "${DIR}/Run/setupNetworkConfigs.py"

docker run --cap-add NET_ADMIN --name istream_network_tc_container -p ${networkDockerPort}:8080 -d istream_network_tc_image

sh "${DIR}/Run/applyNetworksConfig.sh"
