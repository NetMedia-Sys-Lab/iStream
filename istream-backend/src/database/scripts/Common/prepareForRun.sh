#!/bin/bash

username=$1
experimentId=$2
component=$3
moduleName=$4
moduleType=$5
moduleMachineId=$6
moduleAdvanceConfig=$7
moduleConfigName=$8

mainDir=$(pwd)

if [[ "${moduleType}" == "iStream" ]]; then
    modulePath="${mainDir}/src/database/defaultModules/${component}/${moduleName}"
elif [[ "${moduleType}" == "Custom" ]]; then
    modulePath="${mainDir}/src/database/users/${username}/Modules/${component}/${moduleName}"
fi

if [[ "${moduleAdvanceConfig}" == false ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/${component}Config.json"
    configFileExtention="json"
else
    if [[ "${moduleType}" == "iStream" ]]; then
        configFilePath="${mainDir}/src/database/users/${username}/ModulesConfigs/iStream/${component}/${moduleName}/${moduleConfigName}"
    elif [[ "${moduleType}" == "Custom" ]]; then
        configFilePath="${mainDir}/src/database/users/${username}/ModulesConfigs/User/${component}/${moduleName}/${moduleConfigName}"
    fi
    configFileExtention=${moduleConfigName##*.}
fi

configPath="${modulePath}/Run"
resultsPath="${modulePath}/Results"

runFileName=$(ls -p "${modulePath}" | grep -v / | grep "run")

if [[ "${moduleMachineId}" != "" ]] && [[ "${moduleMachineId}" != "0" ]]; then
    echo "Move run files to the designated server"
    read sshUsername machineIp privateKeyPath <<<$(bash "${mainDir}/src/database/scripts/Common/findMachine.sh" "${username}" "${moduleMachineId}")
    commandToRunInClusterForConfigAndResult="cd '${moduleName}' && mkdir -p Results && mkdir -p Run && rm -rf Run/* && rm -rf Results/*"
    bash "${mainDir}/src/database/scripts/Common/ssh.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterForConfigAndResult}"

    bash "${mainDir}/src/database/scripts/Common/scp.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${modulePath}" "run" "${moduleName}" "${runFileName}"

    if [[ ${moduleAdvanceConfig} == false || !("${moduleConfigName}" == "" ||  "${moduleConfigName}" == "No Config") ]]; then
        bash "${mainDir}/src/database/scripts/Common/scp.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "config" "${moduleName}" "${configFileExtention}"
    fi
else
    mkdir -p "${resultsPath}"
    rm -rf "${resultsPath}"/*

    if [[ ${moduleAdvanceConfig} == false || !("${moduleConfigName}" == "" ||  "${moduleConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        cp "${configFilePath}" "${configPath}/config.${configFileExtention}"
    fi
fi
