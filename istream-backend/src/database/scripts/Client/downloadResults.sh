#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

bash "${mainDir}/src/database/scripts/Common/downloadResults.sh" "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}" "${clientMachineId}"
