#!/bin/bash
username=$1
experimentId=$2

clientName=$(jq -r '.Client.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientConfigName=$(jq -r '.Client.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientType=$(jq -r '.Client.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
clientMachineId=$(jq -r '.Client.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${clientName}" == "" ]]; then
    echo "No client module selected. Please select a module first."
    exit
else
    if [[ "${clientType}" == "iStream" && "${clientName}" == "Headless Player ABR" ]]; then
        python3 src/database/scripts/Client/setupHeadlessPlayer.py "${username}" "${experimentId}"
    fi
    # sh src/database/scripts/Common/run.sh "${username}" "Client" "${clientName}" "${clientType}" "${clientMachineId}" "${clientConfigName}"
fi
