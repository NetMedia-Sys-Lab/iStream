#!/bin/bash
username=$1
experimentId=$2

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

sh src/database/scripts/Common/downloadResults.sh "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}" "${clientMachineId}"
