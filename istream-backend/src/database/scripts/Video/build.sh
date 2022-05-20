#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

videoId=($(jq -r '.Video.id[]' src/database/users/${username}/Experiments/${experimentId}/dependency.json))
videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${videoMachineId}" != "" ]] && [[ "${videoMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${videoMachineId}")

    for i in "${!videoId[@]}"; do
        echo "Move video number $(($i + 1)) to the designated machine"
        videoPath="${mainDir}/src/database/Videos/${videoId[$i]}.mp4"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${videoPath}" "build"
    done
else
    if [[ "${serverType}" == "iStream" ]]; then
        for i in "${!videoId[@]}"; do
            echo "Move video number $(($i + 1)) beside server component"
            videoPath="${mainDir}/src/database/Videos/${videoId[$i]}.mp4"
            serverPath="${mainDir}/src/database/supportedModules/Server/${serverName}/Build"
            cp "${videoPath}" "${serverPath}"
        done
    elif [[ "${serverType}" == "Custom" ]]; then

        for i in "${!videoId[@]}"; do
            echo "Move video number $(($i + 1)) beside server component"
            videoPath="${mainDir}/src/database/Videos/${videoId[$i]}.mp4"
            serverPath="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Build"
            cp "${videoPath}" "${serverPath}"
        done
    fi
fi
