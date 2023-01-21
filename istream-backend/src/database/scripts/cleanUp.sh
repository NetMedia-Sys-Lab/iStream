# !/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

bash "${mainDir}/src/database/scripts/Video/delete.sh" "${username}" "${experimentId}"
bash "${mainDir}/src/database/scripts/Server/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
bash "${mainDir}/src/database/scripts/Network/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
bash "${mainDir}/src/database/scripts/Client/deleteConfig.sh" "${username}" "${experimentId}" 2>&1


