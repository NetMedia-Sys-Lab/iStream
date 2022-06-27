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
    if [[ "${networkType}" == "iStream" && "${networkName}" == "Default Network" ]]; then
        serverContainerPort=$(jq -r '.port' src/database/users/${username}/Experiments/${experimentId}/serverConfig.json)
        serverMachineId=$(jq -r '.Server.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

        serverMachineIp=0
        if [[ "${serverMachineId}" != "" ]] && [[ "${serverMachineId}" != "0" ]]; then
            read sshUsername serverMachineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${serverMachineId}")
        fi

        python3 src/database/scripts/Network/setupNetworkProxy.py "${serverMachineIp}" "${serverContainerPort}"
    fi

    sh src/database/scripts/Common/build.sh "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}"
fi
