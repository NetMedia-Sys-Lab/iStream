#!/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)
transcoderComponentExistence=$(jq '.transcoderComponentExistence' <<<${experimentsList})
networkComponentExistence=$(jq '.networkComponentExistence' <<<${experimentsList})

# Server Component
sh src/database/scripts/Server/downloadResults.sh "${username}" "${experimentId}" 2>&1


# Transcoder Component
# if [ ${transcoderComponentExistence} = true ]; then
    sh src/database/scripts/Transcoder/downloadResults.sh "${username}" "${experimentId}" 2>&1
# fi

# # Network Component
# if [ ${networkComponentExistence} = true ]; then
#     # sh src/database/scripts/Network/downloadResults.sh "${username}" "${experimentId}" 2>&1
# fi

# Client Component
# sh src/database/scripts/Client/downloadResults.sh "${username}" "${experimentId}" 2>&1


downlodedFilesPathDestination="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results"
zipfilePath="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results.zip"

cd "${downlodedFilesPathDestination}" 
zip -r "${zipfilePath}" ./*

exit 1