#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

clientName=$(jq -r '.Client.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientType=$(jq -r '.Client.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientMachineId=$(jq -r '.Client.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${clientName}" == "" ]]; then
    echo "No client module selected. Please select a module first."
    exit
else
    sh "${mainDir}/src/database/scripts/Common/build.sh" "${username}" "Client" "${clientName}" "${clientType}" "${clientMachineId}"
fi
