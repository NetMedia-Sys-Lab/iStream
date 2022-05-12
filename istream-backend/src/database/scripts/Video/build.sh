#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

videoId=($(jq -r '.Video.id[]' src/database/users/${username}/Experiments/${experimentId}/dependency.json))
videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${serverType}" == "iStream" ]]; then
    for i in "${!videoId[@]}"; do
        echo "Move video number $(($i + 1)) to the designated place"
        videoPath="${mainDir}/src/database/Videos/${videoId[$i]}.mp4"
        serverPath="${mainDir}/src/database/supportedModules/Server/${serverName}/build"
        cp "${videoPath}" "${serverPath}"
    done
elif [[ "${serverType}" == "Custom" ]]; then
    if [[ "${videoMachineId}" != "" ]] && [[ "${videoMachineId}" != "0" ]]; then
        read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${videoMachineId}")

        for i in "${!videoId[@]}"; do
            echo "Move video number $(($i + 1)) to the designated machine"
            videoPath="${mainDir}/src/database/Videos/${videoId[$i]}.mp4"
            sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${videoPath}"
        done
    fi
fi
# The only lefted option is when server type is custom and there isn't any machine to move videos to!
