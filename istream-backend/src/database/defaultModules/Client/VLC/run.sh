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


docker ps -a -q --filter "name=istream_vlc_container" | grep -q . &&
   echo "Remove previous gpac docker container" && docker stop istream_vlc_container && docker rm -fv istream_vlc_container

docker run -it --name istream_vlc_container ${dockerCupConfig} ${dockerMemoryConfig} -d vlc_image
docker cp "${DIR}/Run/config.sh" istream_vlc_container:/
docker exec istream_vlc_container bash ./config.sh
