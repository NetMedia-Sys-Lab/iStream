#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

selectedVideosId=($(jq -r '.Video.id[]' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json"))

userVideosList=$(jq -r '.' "${mainDir}/src/database/users/${username}/Videos/videos_list.json")
defaultVideosList=$(jq -r '.' "${mainDir}/src/database/defaultVideos/default_videos_list.json")

userVideosName=()
defaultVideosName=()
videos=()

for i in "${!selectedVideosId[@]}"; do
    videoData=""
    if [[ "$(jq --arg videoId ${selectedVideosId[$i]} '.[] | select(.id == $videoId)' <<<${userVideosList})" != "" ]]; then
        videoData=$(jq --arg videoId ${selectedVideosId[$i]} '.[] | select(.id == $videoId)' <<<${userVideosList})
        videoName=$(jq '.name' <<<${videoData})
        userVideosName+=("$(jq -n \
            --arg id "${selectedVideosId[$i]}" \
            --arg name "$(echo ${videoName} | tr -d '"')" \
            --arg extension "$(echo ${videoName##*.} | tr -d '"')" \
            '{id: $id, name: $name, extension: $extension}')")

    elif [[ "$(jq --arg videoId ${selectedVideosId[$i]} '.[] | select(.id == $videoId)' <<<${defaultVideosList})" != "" ]]; then
        videoData=$(jq --arg videoId ${selectedVideosId[$i]} '.[] | select(.id == $videoId)' <<<${defaultVideosList})
        videoName=$(jq '.name' <<<${videoData})
        defaultVideosName+=("$(jq -n \
            --arg id "${selectedVideosId[$i]}" \
            --arg name "$(echo ${videoName} | tr -d '"')" \
            --arg extension "$(echo ${videoName##*.} | tr -d '"')" \
            '{id: $id, name: $name, extension: $extension}')")
    fi
done

serverName=$(jq -r '.Server.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverType=$(jq -r '.Server.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${serverType}" == "iStream" ]]; then
    serverVideosDirectoryPath="${mainDir}/src/database/defaultModules/Server/${serverName}/Run/Videos"
elif [[ "${serverType}" == "Custom" ]]; then
    serverVideosDirectoryPath="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos"
fi

mkdir -p "${serverVideosDirectoryPath}"

videoNumber=0
for i in "${!userVideosName[@]}"; do
    videoNumber=$((videoNumber + 1))
    echo "Move video number $(($videoNumber)) beside server component"
    videoName=$(echo $(jq '.name' <<<${userVideosName[$i]}) | tr -d '"')
    videoId=$(echo $(jq '.id' <<<${userVideosName[$i]}) | tr -d '"')
    videoExtension=$(echo $(jq '.extension' <<<${userVideosName[$i]}) | tr -d '"')

    serverPath="${serverVideosDirectoryPath}/${videoName}"
    videoPath="${mainDir}/src/database/users/${username}/Videos/${videoId}"

    if [[ "${videoExtension}" == "zip" ]]; then
        unzip -o -q -d "${serverPath}" "${videoPath}"
    else
        cp "${videoPath}" "${serverPath}"
    fi
done

for j in "${!defaultVideosName[@]}"; do
    videoNumber=$((videoNumber + 1))
    echo "Move video number $(($videoNumber)) beside server component"
    videoName=$(echo $(jq '.name' <<<${defaultVideosName[$j]}) | tr -d '"')
    videoId=$(echo $(jq '.id' <<<${defaultVideosName[$j]}) | tr -d '"')
    videoExtension=$(echo $(jq '.extension' <<<${defaultVideosName[$j]}) | tr -d '"')

    serverPath="${serverVideosDirectoryPath}/${videoName}"
    videoPath="${mainDir}/src/database/defaultVideos/${videoId}"

    if [[ "${videoExtension}" == "zip" ]]; then
        unzip -o -q -d "${serverVideosDirectoryPath}" "${videoPath}"
    else
        cp "${videoPath}" "${serverPath}"
    fi
done

# if [[ "${videoMachineId}" != "" ]] && [[ "${videoMachineId}" != "0" ]]; then
#     read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${videoMachineId}")

#     commandToRunInCluster="mkdir -p Videos"
#     sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"

#     for i in "${!selectedVideosId[@]}"; do
#         echo "Move video number $(($i + 1)) to the designated machine"
#         videoPath="${mainDir}/src/database/users/${username}/Videos/${selectedVideosId[$i]}"
#         sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${videoPath}" "video" "${videosName[$i]}"
#         if [[ "${extensions[$i]}" == "zip" ]]; then
#             commandToUnzipInCluster="cd Videos && unzip -q ${videosName[$i]}"
#             sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToUnzipInCluster}"
#         fi
#     done
# fi
