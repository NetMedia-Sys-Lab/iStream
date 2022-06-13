#!/bin/bash

username=$1
experimentId=$2

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)
transcoderComponentExistence=$(jq '.transcoderComponentExistence' <<<${experimentsList})
networkComponentExistence=$(jq '.networkComponentExistence' <<<${experimentsList})

# Video Component
echo "------ Video component building started ------"
sh src/database/scripts/Video/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Video component building Finished ------"

# Server Component
echo "------ Server component building started ------"
sh src/database/scripts/Server/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Server component building Finished ------"

# Transcoder Component
if [ ${transcoderComponentExistence} = true ]; then
    echo "------ Transcoder component building started ------"
    # sh src/database/scripts/Transcoder/build.sh "${username}" "${experimentId}" 2>&1
    echo "------ Transcoder component building Finished ------"
fi

# Network Component
if [ ${networkComponentExistence} = true ]; then
    echo "------ Network component building started ------"
    # sh src/database/scripts/Network/build.sh "${username}" "${experimentId}" 2>&1
    echo "------ Network component building Finished ------"
fi

# Client Component
echo "------ Client component building started ------"
sh src/database/scripts/Client/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Client component building Finished ------"

# Delete video excessive video content
sh src/database/scripts/Video/delete.sh "${username}" "${experimentId}"

echo -n "Experiment has been built"
