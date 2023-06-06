#!/bin/bash

arguments=$1

DIR="$(dirname -- "$0")"
clientContainerPort=$(jq -r '.clientContainerPort' <<<${arguments})
clientContainerCpus=$(jq -r '.clientContainerCpus' <<<${arguments})
clientContainerMemory=$(jq -r '.clientContainerMemory' <<<${arguments})
serverContainerPort=$(jq -r '.serverContainerPort' <<<${arguments})
serverMachineIP=$(jq -r '.serverMachineIP' <<<${arguments})

dockerCupConfig=""
dockerMemoryConfig=""

if [ ${clientContainerCpus} != 0 ]; then
   dockerCupConfig="--cpus=${clientContainerCpus}"
fi

if [ ${clientContainerMemory} != 0 ]; then
   dockerMemoryConfig="--memory=${clientContainerMemory}g"
fi

MPDName=$(jq -r '.MPDName' "${DIR}/Run/config.json")

docker ps -a -q --filter "name=istream_player_container" | grep -q . &&
   echo "Remove previous headless player docker container" && docker stop istream_player_container && docker rm -fv istream_player_container

python3 "${DIR}/Run/createEnvConfig.py"

docker create --name istream_player_container ${dockerCupConfig} ${dockerMemoryConfig} istream_player_image:latest --config-file /Run/config.json --env /Run/env.yaml --run-dir /Run --target http://${serverMachineIP}:${serverContainerPort}/${MPDName}
docker cp "${DIR}/Run" istream_player_container:/

sleep 7
docker start istream_player_container
docker logs -f istream_player_container

docker cp istream_player_container:/Run/. "${DIR}/Results/"
