#!/bin/bash
arguments=$1

DIR="$(dirname -- "$0")"

networkDockerPort=$(jq -r '.networkContainerPort' <<<${arguments})
networkDockerCpus=$(jq -r '.networkContainerCpus' <<<${arguments})
networkDockerMemory=$(jq -r '.networkContainerMemory' <<<${arguments})
serverMachineIP=$(jq -r '.serverMachineIP' <<<${arguments})
serverContainerPort=$(jq -r '.serverContainerPort' <<<${arguments})

dockerCupConfig=""
dockerMemoryConfig=""

if [ ${networkDockerCpus} != 0 ]; then
    dockerCupConfig="--cpus=${networkDockerCpus}"
fi

if [ ${networkDockerMemory} != 0 ]; then
    dockerMemoryConfig="--memory=${networkDockerMemory}g"
fi

docker ps -a -q --filter "name=istream_network_tc_container" | grep -q . &&
    echo "Remove previous network docker container" && docker stop istream_network_tc_container && docker rm -fv istream_network_tc_container

python3 "${DIR}/Run/createNginxConfigFile.py" "${serverMachineIP}" "${serverContainerPort}"
python3 "${DIR}/Run/setupNetworkConfigs.py"

docker run --cap-add NET_ADMIN --name istream_network_tc_container ${dockerCupConfig} ${dockerMemoryConfig} -p ${networkDockerPort}:8080 -d istream_network_tc_image

docker cp "${DIR}/Run/nginx.conf" istream_network_tc_container:/etc/nginx/nginx.conf
docker exec istream_network_tc_container /etc/init.d/nginx reload

sh "${DIR}/Run/applyNetworksConfig.sh"
