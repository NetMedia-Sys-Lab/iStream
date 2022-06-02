#!/bin/bash
username=$1
experimentId=$2

transcoderName=$(jq -r '.Transcoder.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderType=$(jq -r '.Transcoder.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderMachineId=$(jq -r '.Transcoder.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

sh src/database/scripts/Common/downloadResults.sh "${username}" "${experimentId}" "Transcoder" "${transcoderName}" "${transcoderType}" "${transcoderMachineId}"
