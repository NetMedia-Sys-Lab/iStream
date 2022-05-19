#!/bin/bash
username=$1
experimentId=$2

transcoderName=$(jq -r '.Transcoder.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderConfigName=$(jq -r '.Transcoder.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderType=$(jq -r '.Transcoder.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderMachineId=$(jq -r '.Transcoder.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${transcoderType}" == "iStream" ]]; then
    filePath="${mainDir}/src/database/supportedModules/Transcoder/${transcoderName}"
elif [[ "${transcoderType}" == "Custom" ]]; then
    filePath="${mainDir}/src/database/users/${username}/Modules/Transcoder/${transcoderName}"
fi

if [[ "${transcoderMachineId}" != "" ]] && [[ "${transcoderMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${transcoderMachineId}")

    echo "Move files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${filePath}" "build"

    echo "Run build script"
    commandToRunInCluster="cd '${transcoderName}' && sh build.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    sh "${filePath}/build.sh"
fi
