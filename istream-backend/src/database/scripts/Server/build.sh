#!/bin/bash
username=$1
experimentId=$2

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverConfigName=$(jq -r '.Server.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${serverType}" == "iStream" ]]; then
    filePath="${mainDir}/src/database/supportedModules/Server/${serverName}"
    commandToRunInCluster="cd '${serverName}' && sh build.sh"
elif [[ "${serverType}" == "Custom" ]]; then
    filePath="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}"
    commandToRunInCluster="cd '${serverName}' && sh build.sh"
fi

if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${serverMachineId}")

    echo "Move files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${filePath}"

    echo "Run build script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    sh "${filePath}/build.sh"
fi
