#!/bin/bash

username=$1
experimentId=$2

# Video Component
echo "Video component building started"
sh src/database/scripts/Video/build.sh "${username}" "${experimentId}"
echo "Video component building Finished"

# Server Component
echo "Server component building started"
sh src/database/scripts/Server/build.sh "${username}" "${experimentId}"
echo "Server component building Finished"

# transcoderName=$(jq -r '.Transcoder.name' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# transcoderConfigName=$(jq -r '.Transcoder.config' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# transcoderType=$(jq -r '.Transcoder.type' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# networkName=$(jq -r '.Network.name' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# networkConfigName=$(jq -r '.Network.config' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# networkType=$(jq -r '.Network.type' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# networkManualConfig=$(jq -r '.Network.manualConfig' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# clientName=$(jq -r '.Client.name' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# clientConfig=$(jq -r '.Client.config' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# clientType=$(jq -r '.Client.type' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)
# experimentConfigFileName=$(jq -r '.Script.name' ./Database/Users/${userName}/Experiments/${experimentId}/dependency.json)

# networkConfig=$(jq -r '.' ./Database/Users/${userName}/Experiments/${experimentId}/networkConfig.json)

# experimentRepetitionCount=$(jq -r '.repetition' ./Database/Users/${userName}/Experiments/${experimentId}/experimentConfig.json)
# serverNumberOfCPU=$(jq -r '.serverCPU' ./Database/Users/${userName}/Experiments/${experimentId}/experimentConfig.json)
# serverMemoryLimit=$(jq -r '.serverMemoryLimit' ./Database/Users/${userName}/Experiments/${experimentId}/experimentConfig.json)
# clientNumberOfCPU=$(jq -r '.clientCPU' ./Database/Users/${userName}/Experiments/${experimentId}/experimentConfig.json)
# clientMemoryLimit=$(jq -r '.clientMemoryLimit' ./Database/Users/${userName}/Experiments/${experimentId}/experimentConfig.json)

# mainDir=$(pwd)
