#!/bin/bash
username=$1
experimentId=$2
firstRun=$3

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverConfigName=$(jq -r '.Server.configName' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverAdvanceConfig=$(jq -r '.Server.advanceConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${serverName}" == "" ]]; then
    echo "No server module selected. Please select a module first."
    exit
else
    serverContainerPort=$(jq -r '.Server.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)

    arguments=$(jq -n \
        --arg serverContainerPort "$serverContainerPort" \
        '{serverContainerPort: $serverContainerPort}')

    if [[ "${firstRun}" == "true" ]]; then
        sh src/database/scripts/Common/prepareForRun.sh "${username}" "${experimentId}" "Server" "${serverName}" "${serverType}" "${serverMachineId}" "${serverAdvanceConfig}" "${serverConfigName}"
    fi

    sh src/database/scripts/Common/run.sh "${username}" "Server" "${serverName}" "${serverType}" "${serverMachineId}" "${arguments}"
fi
