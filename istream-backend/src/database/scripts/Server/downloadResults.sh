#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

bash "${mainDir}/src/database/scripts/Common/downloadResults.sh" "${username}" "${experimentId}" "Server" "${serverName}" "${serverType}" "${serverMachineId}"
