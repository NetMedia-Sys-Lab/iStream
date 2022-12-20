#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else

    serverContainerPort=$(jq -r '.Server.port' src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json)
    serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

    serverMachineIP=0
    if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
        read sshUsername serverMachineIP privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${serverMachineId}")
    else
        serverMachineIP=$(python3 src/database/scripts/Common/retrieveHostIP.py 2>&1)
    fi

    arguments=$(jq -n \
        --arg serverMachineIP "$serverMachineIP" \
        --arg serverContainerPort "$serverContainerPort" \
        '{serverMachineIP: $serverMachineIP, serverContainerPort: $serverContainerPort}')

    sh src/database/scripts/Common/build.sh "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${arguments}"
fi
