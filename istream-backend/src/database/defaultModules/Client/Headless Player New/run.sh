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

docker ps -a -q --filter "name=headless_player_container" | grep -q . &&
   echo "Remove previous headless player docker container" && docker stop headless_player_container && docker rm -fv headless_player_container

python3 "${DIR}/Run/createEnvConfig.py"

echo "http://${serverMachineIP}:${serverContainerPort}/${MPDName}"

docker create --name headless_player_container ${dockerCupConfig} ${dockerMemoryConfig} headlessplayernew:latest --config-file /Run/config.json --env /Run/env.yaml --run-dir /Run --target http://${serverMachineIP}:${serverContainerPort}/${MPDName}
docker cp "${DIR}/Run" headless_player_container:/

sleep 5
docker start headless_player_container
docker logs -f headless_player_container

docker cp headless_player_container:/Run/. "${DIR}/Results/"
