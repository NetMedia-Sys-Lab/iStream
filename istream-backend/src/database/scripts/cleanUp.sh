# !/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

networkComponentExistence=$(jq -r '.componentExistence.network' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
clientComponentExistence=$(jq -r '.componentExistence.client' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

bash "${mainDir}/src/database/scripts/Video/delete.sh" "${username}" "${experimentId}"

bash "${mainDir}/src/database/scripts/Server/deleteConfig.sh" "${username}" "${experimentId}" 2>&1

if [ ${networkComponentExistence} = true ]; then
   bash "${mainDir}/src/database/scripts/Network/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
fi

if [ ${clientComponentExistence} = true ]; then
   bash "${mainDir}/src/database/scripts/Client/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
fi
