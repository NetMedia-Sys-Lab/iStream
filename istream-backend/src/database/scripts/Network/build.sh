#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else
    sh src/database/scripts/Common/build.sh "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}"
fi
