#!/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)

networkComponentExistence=$(jq -r '.componentExistence.network' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
clientComponentExistence=$(jq -r '.componentExistence.client' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

resultsDestination="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results"
resultsFolderName=$(date +"%Y-%m-%d %T")

mkdir -p "${resultsDestination}/${resultsFolderName}"

# Server Component
serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

bash "${mainDir}/src/database/scripts/Common/getResults.sh" "${username}" "${experimentId}" "Server" "${serverName}" "${serverType}" "${serverMachineId}" "${resultsFolderName}"

# Network Component
if [ ${networkComponentExistence} = true ]; then
   networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

   bash "${mainDir}/src/database/scripts/Common/getResults.sh" "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${resultsFolderName}"
fi

# Client Component
if [ ${clientComponentExistence} = true ]; then
   clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

   bash "${mainDir}/src/database/scripts/Common/getResults.sh" "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${resultsFolderName}"
fi
