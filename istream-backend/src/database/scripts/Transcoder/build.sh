#!/bin/bash
username=$1
experimentId=$2

transcoderName=$(jq -r '.Transcoder.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderConfigName=$(jq -r '.Transcoder.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderType=$(jq -r '.Transcoder.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderMachineId=$(jq -r '.Transcoder.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${transcoderName}" == "" ]]; then
    echo "No transcoder module selected. Please select a module first."
    exit
else
    sh src/database/scripts/Common/build.sh "${username}" "Transcoder" "${transcoderName}" "${transcoderType}" "${transcoderMachineId}"
fi
