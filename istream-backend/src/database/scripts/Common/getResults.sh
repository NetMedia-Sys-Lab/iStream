#!/bin/bash

username=$1
experimentId=$2
component=$3
componentName=$4
componentType=$5
componentMachineId=$6
index=$7

mainDir=$(pwd)

resultsDestination="${mainDir}/src/database/users/${username}/Experiments/${experimentId}/Results/${index}/${component}"
mkdir -p "${resultsDestination}"

if [[ "${componentType}" == "iStream" ]]; then
    resultsPath="${mainDir}/src/database/defaultModules/${component}/${componentName}/Results/"
elif [[ "${componentType}" == "Custom" ]]; then
    resultsPath="${mainDir}/src/database/users/${username}/Modules/${component}/${componentName}/Results/"
fi

if [[ "${componentMachineId}" != "" ]] && [[ "${componentMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${componentMachineId}")
    scp -r -i "${privateKeyPath}" ${sshUsername}@${machineIp}:"/home/${sshUsername}/${componentName}/Results/*" "${resultsDestination}"
else
    cp -a "${resultsPath}" "${resultsDestination}"
fi
