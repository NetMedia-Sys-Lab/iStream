#!/bin/bash

username=$1
component=$2
componentName=$3
componentType=$4
componentMachineId=$5
componentConfigName=$6

configFileExtention=${componentConfigName##*.}

mainDir=$(pwd)

if [[ "${componentType}" == "iStream" ]]; then
    componentPath="${mainDir}/src/database/supportedModules/${component}/${componentName}"
    configFilePath="${mainDir}/src/database/users/${username}/iStreamModulesScripts/${component}/${componentName}/${componentConfigName}"
    resultsPath="${componentPath}/Results"
    configPath="${componentPath}/Config"
elif [[ "${componentType}" == "Custom" ]]; then
    componentPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}"
    configFilePath="${componentPath}/Configs/${componentConfigName}"
    configPath="${componentPath}/Config"
    resultsPath="${componentPath}/Results"
fi

runFileName=$(ls -p "${componentPath}" | grep -v / | grep "run")
runFileExtention=${runFileName##*.}

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")
    commandToRunInClusterForConfigAndResult="cd '${componentName}' && mkdir -p Results && mkdir -p Config && mkdir -p Run && rm -rf Config/* Results/* Run/*"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterForConfigAndResult}"

    echo "Move run files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${componentPath}" "run" "${componentName}" "${runFileName}"

    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move config file to the designated server"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "config" "${componentName}" "${configFileExtention}"
    fi
else
    mkdir -p "${configPath}" "${resultsPath}"
    rm -rf "${configPath}"/* "${resultsPath}"/*

    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        cp "${configFilePath}" "${configPath}/config.${configFileExtention}"
    fi
fi
