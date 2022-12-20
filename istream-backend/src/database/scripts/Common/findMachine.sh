#!/bin/bash
username=$1
machineID=$2

mainDir=$(pwd)

machines=$(jq --arg machineID ${machineID} '.[] | select(.machineID == $machineID)' "${mainDir}/src/database/users/${username}/machine_list.json")
sshUsername=$(jq '.sshUsername' <<<${machines})
machineIp=$(jq '.machineIp' <<<${machines})
privateKeyName=$(jq '.privateKeyName' <<<${machines})
privateKeyPath="${mainDir}/src/database/users/${username}/SSHKeys/${machineID}"

echo ${sshUsername} ${machineIp} ${privateKeyPath} | tr -d '"'
