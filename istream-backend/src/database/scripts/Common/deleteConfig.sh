#!/bin/bash

username=$1
experimentId=$2
component=$3
moduleName=$4
moduleType=$5

mainDir=$(pwd)

if [[ "${moduleType}" == "iStream" ]]; then
   configFilePath="${mainDir}/src/database/defaultModules/${component}/${moduleName}/Run"
elif [[ "${moduleType}" == "Custom" ]]; then
   configFilePath="${mainDir}/src/database/users/${username}/Modules/${component}/${moduleName}/Run"
fi

find "${configFilePath}" -name "config.*" -exec rm {} \;
