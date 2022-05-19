#!/bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
filePath=$4
scpKind=$5
componentName=$6

if [[ "${scpKind}" == "build" ]]; then
    mv "${filePath}/Configs" "${filePath}/.."

    if [[ -d ${filePath} ]]; then
        scp -r -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}'"
    else
        scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}'"
    fi

    mv "${filePath}/../Configs" "${filePath}/"
elif [[ "${scpKind}" == "run" ]]; then
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${componentName}/Config/config.sh'"
fi
