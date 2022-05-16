#!/bin/bash
username=$1
experimentId=$2

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${clientType}" == "iStream" ]]; then
    filePath="${mainDir}/src/database/supportedModules/Client/${clientName}"
elif [[ "${clientType}" == "Custom" ]]; then
    filePath="${mainDir}/src/database/users/${username}/Modules/Client/${clientName}"
fi

if [[ "${clientMachineId}" != "" ]] && [[ "${clientMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${clientMachineId}")

    echo "Move files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${filePath}"

    echo "Run build script"
    commandToRunInCluster="cd '${clientName}' && sh build.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    sh "${filePath}/build.sh"
fi