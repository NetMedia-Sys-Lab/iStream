# !bin/bash
sshUsername=$1
machineIp=$2
privateKeyPath=$3
command=$4

ssh -i "${privateKeyPath}" ${sshUsername}@${machineIp} ${command}