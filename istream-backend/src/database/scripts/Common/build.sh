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
    commandToRunInClusterForBuild="cd '${componentName}' && python3 build.py"
    commandToRunInLocal=(python3 "${componentPath}/build.py")
elif [[ ${buildFileExtention} = "sh" ]]; then
    commandToRunInClusterForBuild="cd '${componentName}' && bash build.sh"
    commandToRunInLocal=(sh "${componentPath}/build.sh")
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")

    commandToRunInClusterBeforeBuild="rm -rf '${componentName}' && mkdir -p '${componentName}/Build'"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterBeforeBuild}"

    echo "Move build files to the designated server"
    sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${componentPath}" "build" "${componentName}" "${buildFileName}"

    echo "Build script is running - This could take couple of minutes"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterForBuild}"
else
    echo "Build script is running - This could take couple of minutes"
    "${commandToRunInLocal[@]}"
fi
