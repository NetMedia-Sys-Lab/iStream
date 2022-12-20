#!/bin/bash
username=$1
experimentId=$2
firstRun=$3

mainDir=$(pwd)

networkName=$(jq -r '.Network.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkConfigName=$(jq -r '.Network.configName' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkAdvanceConfig=$(jq -r '.Network.advanceConfig' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkType=$(jq -r '.Network.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkMachineId=$(jq -r '.Network.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
iStreamNetworkManualConfig=$(jq -r '.Network.manualConfig' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
configFileExtention=${networkConfigName##*.}

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else
    networkContainerPort=$(jq -r '.Network.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")

    arguments=$(jq -n \
        --arg networkContainerPort "$networkContainerPort" \
        '{networkContainerPort: $networkContainerPort}')

    if [[ "${firstRun}" == "true" ]]; then
        bash "${mainDir}/src/database/scripts/Common/prepareForRun.sh" "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${networkAdvanceConfig}" "${networkConfigName}"
    fi

    bash "${mainDir}/src/database/scripts/Common/run.sh" "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${arguments}"
fi
