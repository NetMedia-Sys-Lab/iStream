username=$1
experimentId=$2

mainDir=$(pwd)

# videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

# videoId=($(jq -r '.Video.id[]' src/database/users/${username}/Experiments/${experimentId}/dependency.json))
# videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
# videosName=()

# for i in "${!videoId[@]}"; do
#     videosList=$(jq --arg videoId ${videoId[$i]} '.[] | select(.id == $videoId)' src/database/users/${username}/Videos/videos_list.json)
#     videoName=$(jq '.name' <<<${videosList})
#     videosName+=($(echo ${videoName} | tr -d '"'))
# done

if [[ "${serverType}" == "iStream" ]]; then
    path="${mainDir}/src/database/supportedModules/Server/${serverName}/Run/Videos"
elif [[ "${serverType}" == "Custom" ]]; then
    path="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos"
fi
rm -rf "${path}"
