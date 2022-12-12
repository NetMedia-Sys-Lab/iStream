#!/bin/bash

username=$1
experimentId=$2

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)
transcoderComponentExistence=$(jq '.transcoderComponentExistence' <<<${experimentsList})
networkComponentExistence=$(jq '.networkComponentExistence' <<<${experimentsList})

# Server Component
echo "------ Server component building started ------"
# sh src/database/scripts/Server/build.sh "${username}" "${experimentId}" 2>&1
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
# sh src/database/scripts/Client/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Client component building Finished ------"

echo -n "Experiment has been built"
