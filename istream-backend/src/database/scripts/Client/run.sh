#!/bin/bash
username=$1
experimentId=$2
# firstRun=$3

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
   clientContainerPort=$(jq -r '.Client.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
   clientContainerCpus=$(jq -r '.Client.cpus' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
   clientContainerMemory=$(jq -r '.Client.memory' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")

   networkComponentExistence=$(jq -r '.componentExistence.network' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json")
   if [ ${networkComponentExistence} = true ]; then
      serverContainerPort=$(jq -r '.Network.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
      serverMachineId=$(jq -r '.Network.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
   else
      serverContainerPort=$(jq -r '.Server.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
      serverMachineId=$(jq -r '.Server.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
   fi

   serverMachineIP=0
   if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
      read sshUsername serverMachineIP privateKeyPath <<<$(bash "${mainDir}/src/database/scripts/Common/findMachine.sh" "${username}" "${serverMachineId}")
   else
      serverMachineIP=$(python3 "${mainDir}/src/database/scripts/Common/retrieveHostIP.py" 2>&1)
   fi

   arguments=$(
      jq -n \
         --arg clientContainerPort "$clientContainerPort" \
         --arg serverMachineIP "$serverMachineIP" \
         --arg serverContainerPort "$serverContainerPort" \
         --arg clientContainerCpus "$clientContainerCpus" \
         --arg clientContainerMemory "$clientContainerMemory" \
         '{clientContainerPort: $clientContainerPort, serverMachineIP: $serverMachineIP, serverContainerPort: $serverContainerPort, clientContainerCpus: $clientContainerCpus, clientContainerMemory: $clientContainerMemory}'
   )

   echo "------ Client component running started ------"
   bash "${mainDir}/src/database/scripts/Common/run.sh" "${username}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${arguments}" 2>&1
fi
