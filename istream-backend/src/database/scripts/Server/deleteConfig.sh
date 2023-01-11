#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverType=$(jq -r '.Server.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${serverName}" == "" ]]; then
   exit
else
   bash "${mainDir}/src/database/scripts/Common/deleteConfig.sh" "${username}" "${experimentId}" "Server" "${serverName}" "${serverType}"
fi