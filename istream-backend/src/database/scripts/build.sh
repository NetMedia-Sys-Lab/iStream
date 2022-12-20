#!/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

transcoderComponentExistence=$(jq -r '.transcoderComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
networkComponentExistence=$(jq -r '.networkComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

# Server Component
echo "------ Server component building started ------"
sh "${mainDir}/src/database/scripts/Server/build.sh" "${username}" "${experimentId}" 2>&1
echo "------ Server component building Finished ------"

# Transcoder Component
# if [ ${transcoderComponentExistence} = true ]; then
#     echo "------ Transcoder component building started ------"
#     sh ${DIR}/Transcoder/build.sh "${username}" "${experimentId}" 2>&1
#     echo "------ Transcoder component building Finished ------"
# fi

# Network Component
if [ ${networkComponentExistence} = true ]; then
    echo "------ Network component building started ------"
    sh "${mainDir}/src/database/scripts/Network/build.sh" "${username}" "${experimentId}" 2>&1
    echo "------ Network component building Finished ------"
fi

# Client Component
echo "------ Client component building started ------"
sh "${mainDir}/src/database/scripts/Client/build.sh" "${username}" "${experimentId}" 2>&1
echo "------ Client component building Finished ------"

echo -n "Experiment has been built"
