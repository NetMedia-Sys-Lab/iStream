#!/bin/bash
username=$1
experimentId=$2
firstRun=$3

transcoderName=$(jq -r '.Transcoder.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderConfigName=$(jq -r '.Transcoder.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderType=$(jq -r '.Transcoder.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderMachineId=$(jq -r '.Transcoder.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${transcoderName}" == "" ]]; then
    echo "No transcoder module selected. Please select a module first."
    exit
else
    if [[ "${firstRun}" == "true" ]]; then
        sh src/database/scripts/Common/prepareForRun.sh "${username}" "Transcoder" "${transcoderName}" "${transcoderType}" "${transcoderMachineId}" "${transcoderConfigName}"
    fi
    sh src/database/scripts/Common/run.sh "${username}" "Transcoder" "${transcoderName}" "${transcoderType}" "${transcoderMachineId}" "${transcoderConfigName}"
fi
