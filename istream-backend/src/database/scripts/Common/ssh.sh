# !bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
command=$4

# echo "${privateKeyPath}" "${filePath}" ${sshUsername}@${machineIp}:/home/sonali/Navid

ssh -i "${privateKeyPath}" ${sshUsername}@${machineIp} ${command}