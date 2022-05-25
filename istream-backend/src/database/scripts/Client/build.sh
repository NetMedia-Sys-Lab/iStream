#!/bin/bash
username=$1
experimentId=$2

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${clientName}" == "" ]]; then
    echo "No client module selected. Please select a module first."
    exit
else
    sh src/database/scripts/Common/build.sh "${username}" "Client" "${clientName}" "${clientType}" "${clientMachineId}"
fi
