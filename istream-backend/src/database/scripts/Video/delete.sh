username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${serverType}" == "iStream" ]]; then
    rm "${mainDir}/src/database/supportedModules/Server/${serverName}/Build/"*.mp4
fi
