#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${networkType}" == "iStream" ]]; then
    filePath="${mainDir}/src/database/supportedModules/Network/${networkName}"
elif [[ "${networkType}" == "Custom" ]]; then
    filePath="${mainDir}/src/database/users/${username}/Modules/Network/${networkName}"
fi

if [[ "${networkMachineId}" != "" ]] && [[ "${networkMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${networkMachineId}")

    echo "Move files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${filePath}"

    echo "Run build script"
    commandToRunInCluster="cd '${networkName}' && sh build.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    sh "${filePath}/build.sh"
fi