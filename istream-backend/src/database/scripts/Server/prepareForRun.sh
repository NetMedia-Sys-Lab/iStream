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
   #Video Component
   echo "------ Server component prepration started ------"
   echo "------ Moving videos beside Server component ------"
   bash "${mainDir}/src/database/scripts/Video/run.sh" "${username}" "${experimentId}" 2>&1

   bash "${mainDir}/src/database/scripts/Common/prepareForRun.sh" "${username}" "${experimentId}" "Server" "${serverName}" "${serverType}" "${serverMachineId}" "${serverAdvanceConfig}" "${serverConfigName}" 2>&1
   echo "------ Server component prepration finished ------"
fi
