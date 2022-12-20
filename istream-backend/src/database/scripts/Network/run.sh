#!/bin/bash
username=$1
experimentId=$2
firstRun=$3

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkConfigName=$(jq -r '.Network.configName' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkAdvanceConfig=$(jq -r '.Network.advanceConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
iStreamNetworkManualConfig=$(jq -r '.Network.manualConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
configFileExtention=${networkConfigName##*.}

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else
    networkContainerPort=$(jq -r '.Network.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)

    arguments=$(jq -n \
        --arg networkContainerPort "$networkContainerPort" \
        '{networkContainerPort: $networkContainerPort}')

    if [[ "${firstRun}" == "true" ]]; then
        sh src/database/scripts/Common/prepareForRun.sh "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${networkAdvanceConfig}" "${networkConfigName}"
    fi

    sh src/database/scripts/Common/run.sh "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${arguments}"
fi
