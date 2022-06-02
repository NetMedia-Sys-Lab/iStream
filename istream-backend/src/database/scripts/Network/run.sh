#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkConfigName=$(jq -r '.Network.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
iStreamNetworkManualConfig=$(jq -r '.Network.manualConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
configFileExtention=${networkConfigName##*.}

if [[ "${networkName}" == "" ]]; then
    echo "No network module selected. Please select a module first."
    exit
else
    if [[ "${networkType}" == "iStream" && "${iStreamNetworkManualConfig}" == "false" ]]; then
        networkParameter=$(jq -r '.' src/database/users/${username}/Experiments/${experimentId}/networkConfig.json)
        python3 src/database/scripts/Network/createNetworkConfig.py "${networkParameter}"
        networkConfigName="networkConfiguration.sh"
    fi
    sh src/database/scripts/Common/run.sh "${username}" "Network" "${networkName}" "${networkType}" "${networkMachineId}" "${networkConfigName}" "${iStreamNetworkManualConfig}"
fi
