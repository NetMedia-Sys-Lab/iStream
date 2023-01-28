#!/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

networkComponentExistence=$(jq -r '.componentExistence.network' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
clientComponentExistence=$(jq -r '.componentExistence.client' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

# Server Component
echo "------ Server component building started ------"
bash "${mainDir}/src/database/scripts/Server/build.sh" "${username}" "${experimentId}" 2>&1
echo "------ Server component building Finished ------"

# Network Component
if [ ${networkComponentExistence} = true ]; then
    echo "------ Network component building started ------"
    bash "${mainDir}/src/database/scripts/Network/build.sh" "${username}" "${experimentId}" 2>&1
    echo "------ Network component building Finished ------"
fi

# Client Component
if [ ${clientComponentExistence} = true ]; then
    echo "------ Client component building started ------"
    bash "${mainDir}/src/database/scripts/Client/build.sh" "${username}" "${experimentId}" 2>&1
    echo "------ Client component building Finished ------"
fi

echo -n "Experiment has been built"
