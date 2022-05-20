#!/bin/bash
username=$1
experimentId=$2

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientConfigName=$(jq -r '.Client.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${clientType}" == "iStream" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/Client/${clientName}/${clientConfigName}"
    configPathDestination="${mainDir}/src/database/supportedModules/Client/${clientName}/Config"
    componentPath="${mainDir}/src/database/supportedModules/Client/${clientName}"
elif [[ "${clientType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/Client/${clientName}/Configs/${clientConfigName}"
    configPathDestination="${mainDir}/src/database/users/${username}/Modules/Client/${clientName}/Config"
    componentPath="${mainDir}/src/database/users/${username}/Modules/Client/${clientName}"
fi

if [[ "${clientMachineId}" != "" ]] && [[ "${clientMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${clientMachineId}")

    if [[ !("${clientConfigName}" == "" ||  "${clientConfigName}" == "No Config") ]]; then
        echo "Move Config file to the designated server"
        commandToRunInCluster="cd '${clientName}' && mkdir -p Config && cd Config && rm -f config.sh"
        sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "run" "${clientName}"
    fi

    echo "Run run script"
    commandToRunInCluster="cd '${clientName}' && sh run.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    if [[ !("${clientConfigName}" == "" ||  "${clientConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        mkdir -p "${configPathDestination}"
        rm -f "${configPathDestination}/Config.sh"
        cp "${configFilePath}" "${configPathDestination}/Config.sh"
    fi
    echo "Run run script"
    sh "${componentPath}/run.sh"
fi
