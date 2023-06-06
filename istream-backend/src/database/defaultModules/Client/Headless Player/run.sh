#!/bin/bash
arguments=$1

# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
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
AdaptationAlgorithm=$(jq -r '.AdaptationAlgorithm' "${DIR}/Run/config.json")

adaptationAlgorithmMap=$(jq -n \
    --arg buffer "--abr buffer-based" \
    --arg hybrid "--abr hybrid" \
    --arg bandwidth " " \
    '{"Buffer-based ABR": $buffer, "Hybrid ABR": $hybrid, "Bandwidth-based ABR": $bandwidth}')

selectedAdaptation=$(echo $(jq --arg model "${AdaptationAlgorithm}" '.[$model]' <<<${adaptationAlgorithmMap}) | tr -d '"')

docker ps -a -q --filter "name=headless_player_container" | grep -q . &&
    echo "Remove previous headless player docker container" && docker stop headless_player_container && docker rm -fv headless_player_container

sleep 5
docker run --name headless_player_container ${dockerCupConfig} ${dockerMemoryConfig} headless_player_component \
    scripts/dash-emulator.py ${selectedAdaptation} --dump-results results/result http://${serverMachineIP}:${serverContainerPort}/${MPDName}

index=1
printf -v dirpath "Results/result-%03d" $index
echo "${DIR}/${dirpath}"
while [ -d "${DIR}/${dirpath}" ]; do
    index=$((index + 1))
    printf -v dirpath "Results/result-%03d" $index
done
mkdir -p "${DIR}/${dirpath}"

docker cp headless_player_container:dash-emulator-different-ABR/results/. "${DIR}/${dirpath}"
exit 0