#!/bin/bash

username=$1
component=$2
componentName=$3
componentType=$4
componentMachineId=$5

mainDir=$(pwd)

if [[ "${componentType}" == "iStream" ]]; then
    componentPath="${mainDir}/src/database/supportedModules/${component}/${componentName}"
elif [[ "${componentType}" == "Custom" ]]; then
    componentPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}"
fi

buildFileName=$(ls -p "${componentPath}" | grep -v / | grep "build")
buildFileExtention=${buildFileName##*.}

if [[ ${buildFileExtention} = "py" ]]; then
    commandToRunInCluster="cd '${componentName}' && python build.py"
    commandToRunInLocal=(python "${componentPath}/build.py")
elif [[ ${buildFileExtention} = "sh" ]]; then
    commandToRunInCluster="cd '${componentName}' && bash build.sh"
    commandToRunInLocal=(sh "${componentPath}/build.sh")
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")

    echo "Move files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${componentPath}" "build"

    echo "Run build script"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    echo "Run build script"
    "${commandToRunInLocal[@]}"
fi
