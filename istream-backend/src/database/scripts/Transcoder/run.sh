#!/bin/bash
username=$1
experimentId=$2

transcoderName=$(jq -r '.Transcoder.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderConfigName=$(jq -r '.Transcoder.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderType=$(jq -r '.Transcoder.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
transcoderMachineId=$(jq -r '.Transcoder.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${transcoderType}" == "iStream" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/Transcoder/${transcoderName}/${transcoderConfigName}"
    configPathDestination="${mainDir}/src/database/supportedModules/Transcoder/${transcoderName}/Config"
    componentPath="${mainDir}/src/database/supportedModules/Transcoder/${transcoderName}"
elif [[ "${transcoderType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/Transcoder/${transcoderName}/Configs/${transcoderConfigName}"
    configPathDestination="${mainDir}/src/database/users/${username}/Modules/Transcoder/${transcoderName}/Config"
    componentPath="${mainDir}/src/database/users/${username}/Modules/Transcoder/${transcoderName}"
fi

if [[ "${transcoderMachineId}" != "" ]] && [[ "${transcoderMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${transcoderMachineId}")

    if [[ !("${transcoderConfigName}" == "" ||  "${transcoderConfigName}" == "No Config") ]]; then
        echo "Move Config file to the designated server"
        commandToRunInCluster="cd '${transcoderName}' && mkdir -p Config && cd Config && rm -f config.sh"
        sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "run" "${transcoderName}"
    fi

    echo "Run run script"
    commandToRunInCluster="cd '${transcoderName}' && sh run.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    if [[ !("${transcoderConfigName}" == "" ||  "${transcoderConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        mkdir -p "${configPathDestination}"
        rm -f "${configPathDestination}/Config.sh"
        cp "${configFilePath}" "${configPathDestination}/Config.sh"
    fi
    echo "Run run script"
    sh "${componentPath}/run.sh"
fi
