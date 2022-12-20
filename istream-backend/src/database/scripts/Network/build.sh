#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

networkName=$(jq -r '.Network.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkType=$(jq -r '.Network.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
networkMachineId=$(jq -r '.Network.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else

    serverContainerPort=$(jq -r '.Server.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
    serverMachineId=$(jq -r '.Server.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

    serverMachineIP=0
    if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
        read sshUsername serverMachineIP privateKeyPath <<<$(sh "${mainDir}/src/database/scripts/Common/findMachine.sh" "${username}" "${serverMachineId}")
    else
        serverMachineIP=$(python3 "${mainDir}/src/database/scripts/Common/retrieveHostIP.py" 2>&1)
    fi

    arguments=$(jq -n \
        --arg serverMachineIP "$serverMachineIP" \
        --arg serverContainerPort "$serverContainerPort" \
        '{serverMachineIP: $serverMachineIP, serverContainerPort: $serverContainerPort}')

    sh "${mainDir}/src/database/scripts/Common/build.sh" "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${arguments}"
fi
