#!/bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
filePath=$4

# echo "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:/home/sonali/Navid

if [[ -d ${filePath} ]]; then
    scp -r -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:/home/${sshUsername}
else
    scp -i "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:/home/${sshUsername}
fi
