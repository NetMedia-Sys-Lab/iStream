#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

networkName=$(jq -r '.Network.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkType=$(jq -r '.Network.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkMachineId=$(jq -r '.Network.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else
    bash "${mainDir}/src/database/scripts/Common/build.sh" "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" 2>&1
fi
