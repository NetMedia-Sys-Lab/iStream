#!/bin/bash
username=$1
experimentId=$2

mainDir=$(pwd)

serverName=$(jq -r '.Server.name' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")
serverType=$(jq -r '.Server.type' "${mainDir}/src/database/users/${username}/Experiments/${experimentId}/dependency.json")

if [[ "${serverType}" == "iStream" ]]; then
    path="${mainDir}/src/database/defaultModules/Server/${serverName}/Run/Videos"
elif [[ "${serverType}" == "Custom" ]]; then
    path="${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Run/Videos"
fi

rm -rf "${path}"
