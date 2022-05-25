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
    if [[ "${component}" == "Network" && "${NetworkManualConfig}" == "false" ]]; then
        configFilePath="${mainDir}/src/database/scripts/Network/${componentConfigName}"
    else
        configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/${component}/${componentName}/${componentConfigName}"
    fi
    configPathDestination="${mainDir}/src/database/supportedModules/${component}/${componentName}/Config"
    componentPath="${mainDir}/src/database/supportedModules/${component}/${componentName}"
elif [[ "${componentType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Configs/${componentConfigName}"
    configPathDestination="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Config"
    componentPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}"
fi

runFileName=$(ls -p "${componentPath}" | grep -v / | grep "run")
runFileExtention=${runFileName##*.}

if [[ ${runFileExtention} = "py" ]]; then
    commandToRunInCluster="cd '${componentName}' && python run.py"
    commandToRunInLocal=(python "${componentPath}/run.py")
elif [[ ${runFileExtention} = "sh" ]]; then
    commandToRunInCluster="cd '${componentName}' && bash run.sh"
    commandToRunInLocal=(sh "${componentPath}/run.sh")

fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")

    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move Config file to the designated server"
        commandToRunInCluster="cd '${componentName}' && mkdir -p Config && cd Config && rm -f *"
        sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "config" "${componentName}" "${configFileExtention}"
    fi

    echo "Run run script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    if [[ !("${componentConfigName}" == "" ||  "${componentConfigName}" == "No Config") ]]; then
        echo "Move Config file beside the component"
        mkdir -p "${configPathDestination}"
        rm -f "${configPathDestination}"/*
        cp "${configFilePath}" "${configPathDestination}/config.${configFileExtention}"
    fi
    echo "Run run script"
    "${commandToRunInLocal[@]}"
fi

if [[ "${component}" == "Network" && "${NetworkManualConfig}" == "false" ]]; then
    rm "${configFilePath}"
fi
