#!/bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
filePath=$4
scpKind=$5
name=$6
configFileExtention=$7

if [[ "${scpKind}" == "build" ]]; then
    if [ -d "${filePath}/Configs" ]; then
        mv "${filePath}/Configs" "${filePath}/.."
    fi

    if [[ -d ${filePath} ]]; then

        rsync -auvz -q -r -e "ssh -i '${privateKeyPath}'" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}'"

        # scp -r -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}'"
    else
        scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}'"
    fi

    if [ -d "${filePath}/../Configs" ]; then
        mv "${filePath}/../Configs" "${filePath}/"
    fi
elif
    [[ "${scpKind}" == "config" ]]
then
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/${name}/Config/config.${configFileExtention}'"
elif [[ "${scpKind}" == "video" ]]; then
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:"'/home/${sshUsername}/Videos/${name}'"
fi
