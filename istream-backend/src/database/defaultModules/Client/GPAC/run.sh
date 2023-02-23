#!/bin/bash
arguments=$1

DIR="$(dirname -- "$0")"
clientContainerPort=$(jq -r '.clientContainerPort' <<<${arguments})
clientContainerCpus=$(jq -r '.clientContainerCpus' <<<${arguments})
clientContainerMemory=$(jq -r '.clientContainerMemory' <<<${arguments})

dockerCupConfig=""
dockerMemoryConfig=""

if [ ${clientContainerCpus} != 0 ]; then
   dockerCupConfig="--cpus=${clientContainerCpus}"
fi

if [ ${clientContainerMemory} != 0 ]; then
   dockerMemoryConfig="--memory=${clientContainerMemory}g"
fi


docker ps -a -q --filter "name=istream_gpac_container" | grep -q . &&
   echo "Remove previous gpac docker container" && docker stop istream_gpac_container && docker rm -fv istream_gpac_container

docker run -it --name istream_gpac_container ${dockerCupConfig} ${dockerMemoryConfig} -d gpac_image
docker cp "${DIR}/Run/config.sh" istream_gpac_container:/
docker exec istream_gpac_container bash ./config.sh
