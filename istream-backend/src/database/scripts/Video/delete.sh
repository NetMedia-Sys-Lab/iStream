username=$1
experimentId=$2

mainDir=$(pwd)

videoMachineId=$(jq -r '.Video.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

serverName=$(jq -r '.Server.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
serverType=$(jq -r '.Server.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

if [[ "${videoMachineId}" == "" ]] || [[ "${videoMachineId}" == "0" ]]; then
    if [[ "${serverType}" == "iStream" ]]; then
        rm -f "${mainDir}/src/database/supportedModules/Server/${serverName}/Build/"*.mp4
    elif [[ "${serverType}" == "Custom" ]]; then
        rm -f "${mainDir}/src/database/users/${username}/Modules/Server/${serverName}/Build/"*.mp4
    fi
fi
