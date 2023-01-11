#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

networkName=$(jq -r '.Network.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkType=$(jq -r '.Network.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${networkName}" == "" ]]; then
   exit
else
   bash "${mainDir}/src/database/scripts/Common/deleteConfig.sh" "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}"
fi
