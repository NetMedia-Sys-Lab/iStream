#!/bin/bash

username=$1
component=$2
componentName=$3
componentType=$4
componentMachineId=$5
componentConfigName=$6
NetworkManualConfig=$7

configFileExtention=${componentConfigName##*.}

mainDir=$(pwd)

if [[ "${componentType}" == "iStream" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/${component}/${componentName}/${componentConfigName}"
    resultsPath="${mainDir}/src/database/supportedModules/${component}/${componentName}/Results"
    configPath="${mainDir}/src/database/supportedModules/${component}/${componentName}/Config"
    componentPath="${mainDir}/src/database/supportedModules/${component}/${componentName}"

elif [[ "${componentType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Configs/${componentConfigName}"
    configPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Config"
    resultsPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Results"
    componentPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}"
fi

runFileName=$(ls -p "${componentPath}" | grep -v / | grep "run")
runFileExtention=${runFileName##*.}

if [[ ${runFileExtention} = "py" ]]; then
    commandToRunInCluster="cd '${componentName}' && python3 run.py"
    commandToRunInLocal=(python3 "${componentPath}/run.py")
elif [[ ${runFileExtention} = "sh" ]]; then
    commandToRunInCluster="cd '${componentName}' && bash run.sh"
    commandToRunInLocal=(sh "${componentPath}/run.sh")
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")
    commandToRunInClusterForConfigAndResult="cd '${componentName}' && mkdir -p Results && mkdir -p Config && mkdir -p Run && rm -f Config/* Results/* Run/*"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterForConfigAndResult}"

    echo "Move run files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${componentPath}" "run" "${componentName}" "${runFileName}"

    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move config file to the designated server"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "config" "${componentName}" "${configFileExtention}"
    fi

    echo "Run run script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    mkdir -p "${configPath}" "${resultsPath}"
    rm -f "${configPath}"/* "${resultsPath}"/*
    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        cp "${configFilePath}" "${configPath}/config.${configFileExtention}"
    fi

    echo "Run run script"
    "${commandToRunInLocal[@]}"
fi
