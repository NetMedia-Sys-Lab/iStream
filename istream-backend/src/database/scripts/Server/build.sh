#!/bin/bash
username=$1
experimentId=$2

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${serverName}" == "" ]]; then
    echo "No server module selected. Please select a module first."
    exit
else
    if [[ "${serverType}" == "iStream" && "${serverName}" == "Nginx Dash" ]]; then
        serverContainerPort=$(jq -r '.port' src/database/users/${username}/Experiments/${experimentId}/serverConfig.json)
        python3 src/database/scripts/Server/setupServer.py "${serverContainerPort}"
    fi
    sh src/database/scripts/Common/build.sh "${username}" "Server" "${serverName}" "${serverType}" "${serverMachineId}"
fi
