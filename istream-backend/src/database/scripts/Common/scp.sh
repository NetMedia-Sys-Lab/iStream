#!/bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
filePath=$4
scpKind=$5

if [[ "${scpKind}" == "build" ]]; then
    componentName=$6
    buildFileName=$7
elif [[ "${scpKind}" == "run" ]]; then
    componentName=$6
    runFileName=$7
elif [[ "${scpKind}" == "video" ]]; then
    videoName=$6
elif [[ "${scpKind}" == "config" ]]; then
    componentName=$6
    configFileExtention=$7
fi

if [[ "${scpKind}" == "build" ]]; then
    scp -r -i "${privateKeyPath}" "${filePath}/Build" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}'"
    scp -i "${privateKeyPath}" "${filePath}/${buildFileName}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}'"
elif [[ "${scpKind}" == "run" ]]; then
    scp -r -i "${privateKeyPath}" "${filePath}/Run" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}'"
    scp -i "${privateKeyPath}" "${filePath}/${runFileName}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}'"
elif [[ "${scpKind}" == "config" ]]; then
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}/Run/config.${configFileExtention}'"
elif [[ "${scpKind}" == "video" ]]; then
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/Videos/${videoName}'"
fi
