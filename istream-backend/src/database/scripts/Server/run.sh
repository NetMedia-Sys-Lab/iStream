#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverConfigName=$(jq -r '.Server.configName' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverAdvanceConfig=$(jq -r '.Server.advanceConfig' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverType=$(jq -r '.Server.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverMachineId=$(jq -r '.Server.machineID' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${serverName}" == "" ]]; then
    echo "No server module selected. Please select a module first."
    exit
else
    serverContainerPort=$(jq -r '.Server.port' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
    serverContainerCpus=$(jq -r '.Server.cpus' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")
    serverContainerMemory=$(jq -r '.Server.memory' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dockerConfig.json")

    arguments=$(
        jq -n \
            --arg serverContainerPort "$serverContainerPort" \
            --arg serverContainerCpus "$serverContainerCpus" \
            --arg serverContainerMemory "$serverContainerMemory" \
            '{serverContainerPort: $serverContainerPort, serverContainerCpus: $serverContainerCpus, serverContainerMemory: $serverContainerMemory}'
    )

    echo "------ Server component running started ------"
    bash "${mainDir}/src/database/scripts/Common/run.sh" "${username}" "Server" "${serverName}" "${serverType}" "${serverMachineId}" "${arguments}" 2>&1

    # bash "${mainDir}/src/database/scripts/Video/delete.sh" "${username}" "${experimentId}"
fi
