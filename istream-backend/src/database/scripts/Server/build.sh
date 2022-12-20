#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverType=$(jq -r '.Server.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverMachineId=$(jq -r '.Server.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${serverName}" == "" ]]; then
    echo "No server module selected. Please select a module first."
    exit
else
    bash "${mainDir}/src/database/scripts/Common/build.sh" "${username}" "Server" "${serverName}" "${serverType}" "${serverMachineId}"
fi
