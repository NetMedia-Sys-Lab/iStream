#!/bin/bash
username=$1
machineID=$2

machines=$(jq --arg machineID ${machineID} '.[] | select(.machineID == $machineID)'  src/database/users/${username}/machine_list.json)
sshUsername=$(jq '.sshUsername' <<<  ${machines})
machineIp=$(jq '.machineIp' <<<  ${machines})
privateKeyName=$(jq '.privateKeyName' <<<  ${machines})
mainDir=$(pwd)
privateKeyPath="${mainDir}/src/database/users/${username}/SSHKeys/${machineID}"

echo ${sshUsername} ${machineIp} ${privateKeyPath} | tr -d '"'