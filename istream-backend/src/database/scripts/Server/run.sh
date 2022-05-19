#!/bin/bash
username=$1
experimentId=$2

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverConfigName=$(jq -r '.Server.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${serverType}" == "iStream" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/Server/${serverName}/${serverConfigName}"
elif [[ "${serverType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Configs/${serverConfigName}"
fi

if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${serverMachineId}")

    if [[ !("${serverConfigName}" == "" ||  "${serverConfigName}" == "No Config") ]]; then
        echo "Move Config file to the designated server"
        commandToRunInCluster="cd '${serverName}' && mkdir -p Config && cd Config && rm -f config.sh"
        sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "run" "${serverName}"
    fi

    echo "Run run script"
    commandToRunInCluster="cd '${serverName}' && sh run.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    echo "Not implemented yet"
    if [[ !("${serverConfigName}" == "" ||  "${serverConfigName}" == "No Config") ]]; then
        echo "Not implemented yet"
    fi
    # sh "${filePath}/build.sh"
fi
