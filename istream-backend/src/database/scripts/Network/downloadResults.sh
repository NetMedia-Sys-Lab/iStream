#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

sh src/database/scripts/Common/downloadResults.sh "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}" "${networkMachineId}"
