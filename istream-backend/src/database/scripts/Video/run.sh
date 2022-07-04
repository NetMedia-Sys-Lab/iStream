#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

videoId=($(jq -r '.Video.id[]' src/database/users/${username}/Experiments/${experimentId}/dependency.json))
videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
videosName=()

for i in "${!videoId[@]}"; do
    videosList=$(jq --arg videoId ${videoId[$i]} '.[] | select(.id == $videoId)' src/database/users/${username}/Videos/videos_list.json)
    videoName=$(jq '.name' <<<${videosList})
    extensions+=($(echo ${videoName##*.} | tr -d '"'))
    videosName+=("$(echo ${videoName} | tr -d '"')")
done

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${videoMachineId}" != "" ]] && [[ "${videoMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${videoMachineId}")

    commandToRunInCluster="mkdir -p Videos"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"

    for i in "${!videoId[@]}"; do
        echo "Move video number $(($i + 1)) to the designated machine"
        videoPath="${mainDir}/src/database/users/${username}/Videos/${videoId[$i]}.${extensions[$i]}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${videoPath}" "video" "${videosName[$i]}"
        if [[ "${extensions[$i]}" == "zip" ]]; then
            commandToUnzipInCluster="cd Videos && unzip -q ${videosName[$i]}"
            sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToUnzipInCluster}"
        fi
    done
fi

if [[ "${serverType}" == "iStream" ]]; then
    mkdir -p "${mainDir}/src/database/supportedModules/Server/${serverName}/Run/Videos"
    for i in "${!videoId[@]}"; do
        echo "Move video number $(($i + 1)) beside server component"
        videoPath="${mainDir}/src/database/users/${username}/Videos/${videoId[$i]}.${extensions[$i]}"
        serverPath="${mainDir}/src/database/supportedModules/Server/${serverName}/Run/Videos/${videosName[$i]}"
        if [[ "${extensions[$i]}" == "zip" ]]; then
            unzipDestination="${mainDir}/src/database/supportedModules/Server/${serverName}/Run/Videos/"
            unzip -o -q -d "${unzipDestination}" "${videoPath}"
        else
            cp "${videoPath}" "${serverPath}"
        fi
    done
elif [[ "${serverType}" == "Custom" ]]; then
    mkdir -p "${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos"
    for i in "${!videoId[@]}"; do
        echo "Move video number $(($i + 1)) beside server component"
        videoPath="${mainDir}/src/database/users/${username}/Videos/${videoId[$i]}.${extensions[$i]}"
        serverPath="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos/${videosName[$i]}"
        if [[ "${extensions[$i]}" == "zip" ]]; then
            unzipDestination="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos/"
            unzip -o -q -d "${unzipDestination}" "${videoPath}"
        else
            cp "${videoPath}" "${serverPath}"
        fi
    done
fi
