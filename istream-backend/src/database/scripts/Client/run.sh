#!/bin/bash
username=$1
experimentId=$2
firstRun=$3

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientConfigName=$(jq -r '.Client.configName' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientAdvanceConfig=$(jq -r '.Client.advanceConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${clientName}" == "" ]]; then
   echo "No client module selected. Please select a module first."
   exit
else
   clientContainerPort=$(jq -r '.Client.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)
   networkComponentExistence=$(jq -r '.networkComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
   if [ ${networkComponentExistence} = true ]; then
      serverContainerPort=$(jq -r '.Network.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)
      serverMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   else
      serverContainerPort=$(jq -r '.Server.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)
      serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
   fi

   serverMachineIP=0
   if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
      read sshUsername serverMachineIP privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${serverMachineId}")
   else
      serverMachineIP=$(python3 src/database/scripts/Common/retrieveHostIP.py 2>&1)
   fi

   arguments=$(jq -n \
      --arg clientContainerPort "$clientContainerPort" \
      --arg serverMachineIP "$serverMachineIP" \
      --arg serverContainerPort "$serverContainerPort" \
      '{clientContainerPort: $clientContainerPort, serverMachineIP: $serverMachineIP, serverContainerPort: $serverContainerPort}')

   if [[ "${firstRun}" == "true" ]]; then
      sh src/database/scripts/Common/prepareForRun.sh "${username}" "${experimentId}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${clientAdvanceConfig}" "${clientConfigName}"
   fi

   sh src/database/scripts/Common/run.sh "${username}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${arguments}"
fi
