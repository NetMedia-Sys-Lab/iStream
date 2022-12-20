#!/bin/bash

username=$1
component=$2
componentName=$3
componentType=$4
componentMachineId=$5
arguments=$6

mainDir=$(pwd)

if [[ "${componentType}" == "iStream" ]]; then
    componentPath="${mainDir}/src/database/defaultModules/${component}/${componentName}"
elif [[ "${componentType}" == "Custom" ]]; then
    componentPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}"
fi

runFileName=$(ls -p "${componentPath}" | grep -v / | grep "run")
runFileExtention=${runFileName##*.}

if [[ ${runFileExtention} = "py" ]]; then
    commandToRunInCluster="cd '${componentName}' && python3 run.py '${arguments}'"
    commandToRunInLocal=(python3 "${componentPath}/run.py" "${arguments}")
elif [[ ${runFileExtention} = "sh" ]]; then
    commandToRunInCluster="cd '${componentName}' && bash run.sh '${arguments}'"
    commandToRunInLocal=(sh "${componentPath}/run.sh" "${arguments}")
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")

    echo "Run run script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    echo "Run run script"
    "${commandToRunInLocal[@]}"
fi
