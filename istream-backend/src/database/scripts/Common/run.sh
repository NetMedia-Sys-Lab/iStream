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

elif [[ "${componentType}" == "Custom" ]]; then
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

    echo "Run run script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    echo "Run run script"
    "${commandToRunInLocal[@]}"
fi
