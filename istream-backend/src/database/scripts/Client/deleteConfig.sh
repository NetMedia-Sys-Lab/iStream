#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

clientName=$(jq -r '.Client.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientType=$(jq -r '.Client.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${clientName}" == "" ]]; then
   exit
else
   bash "${mainDir}/src/database/scripts/Common/deleteConfig.sh" "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}"
fi
