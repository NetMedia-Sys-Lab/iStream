#!/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)
networkComponentExistence=$(jq -r '.networkComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

downlodedFilesPathDestination="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results"
zipfilePath="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results.zip"

rm -f "${zipfilePath}"

cd "${downlodedFilesPathDestination}"
zip -r "${zipfilePath}" ./*
