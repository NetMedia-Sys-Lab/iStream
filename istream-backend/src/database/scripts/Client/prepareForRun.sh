#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

clientName=$(jq -r '.Client.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientConfigName=$(jq -r '.Client.configName' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientAdvanceConfig=$(jq -r '.Client.advanceConfig' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientType=$(jq -r '.Client.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
clientMachineId=$(jq -r '.Client.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${clientName}" == "" ]]; then
   echo "No client module selected. Please select a module first."
   exit
else
   echo "------ Client component prepration started ------"
   bash "${mainDir}/src/database/scripts/Common/prepareForRun.sh" "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${clientAdvanceConfig}" "${clientConfigName}" 2>&1
   echo "------ Client component prepration finished ------"
fi
