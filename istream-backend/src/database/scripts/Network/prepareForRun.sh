#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

networkName=$(jq -r '.Network.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkConfigName=$(jq -r '.Network.configName' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkAdvanceConfig=$(jq -r '.Network.advanceConfig' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkType=$(jq -r '.Network.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkMachineId=$(jq -r '.Network.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${networkName}" == "" ]]; then
   echo "No network module selected. Please select a module first."
   exit
else
   echo "------ Network component prepration started ------"
   bash "${mainDir}/src/database/scripts/Common/prepareForRun.sh" "${username}" "${experimentId}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${networkAdvanceConfig}" "${networkConfigName}" 2>&1
   echo "------ Network component prepration finished ------"
fi
