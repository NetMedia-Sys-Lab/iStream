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

buildFileName=$(ls -p "${componentPath}" | grep -v / | grep "build")
buildFileExtention=${buildFileName##*.}

if [[ ${buildFileExtention} = "py" ]]; then
    # Not tested
    commandToRunInClusterForBuild="cd '${componentName}' && python3 build.py '${arguments}'"
    commandToRunInLocal=(python3 "${componentPath}/build.py" "${arguments}")
elif [[ ${buildFileExtention} = "sh" ]]; then
    commandToRunInClusterForBuild="cd '${componentName}' && bash build.sh '${arguments}'"
    commandToRunInLocal=(sh "${componentPath}/build.sh" "${arguments}")
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh "${mainDir}/src/database/scripts/Common/findMachine.sh" "${username}" "${componentMachineId}")

    commandToRunInClusterBeforeBuild="rm -rf '${componentName}' && mkdir -p '${componentName}'/Build"
    bash "${mainDir}/src/database/scripts/Common/ssh.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterBeforeBuild}"

    echo "Move build files to the designated server"
    bash "${mainDir}/src/database/scripts/Common/scp.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${componentPath}" "build" "${componentName}" "${buildFileName}"

    echo "Build script is running - This could take couple of minutes"
    bash "${mainDir}/src/database/scripts/Common/ssh.sh" "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInClusterForBuild}"
else
    echo "Build script is running - This could take couple of minutes"
    "${commandToRunInLocal[@]}"
fi
