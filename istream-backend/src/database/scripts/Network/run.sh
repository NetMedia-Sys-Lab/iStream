#!/bin/bash
username=$1
experimentId=$2

networkName=$(jq -r '.Network.name' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkConfigName=$(jq -r '.Network.config' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkType=$(jq -r '.Network.type' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
networkMachineId=$(jq -r '.Network.machineID' src/database/users/${username}/Experiments/${experimentId}/dependency.json)
iStreamNetworkManualConfig=$(jq -r '.Network.manualConfig' src/database/users/${username}/Experiments/${experimentId}/dependency.json)

mainDir=$(pwd)

if [[ "${networkType}" == "iStream" ]]; then
    if [[ "${iStreamNetworkManualConfig}" == "false" ]]; then
        networkParameter=$(jq -r '.' src/database/users/${username}/Experiments/${experimentId}/networkConfig.json)
        python3 src/database/scripts/Network/createNetworkConfig.py "${networkParameter}"
        configFilePath="${mainDir}/src/database/scripts/Network/networkConfiguration.sh"
    else
        configFilePath="${mainDir}/src/database/users/${username}/CustomModuleConfigs/Network/${networkName}/${networkConfigName}"
    fi
    configPathDestination="${mainDir}/src/database/supportedModules/Network/${networkName}/Config"
    componentPath="${mainDir}/src/database/supportedModules/Network/${networkName}"
elif [[ "${networkType}" == "Custom" ]]; then
    configFilePath="${mainDir}/src/database/users/${username}/Modules/Network/${networkName}/Configs/${networkConfigName}"
    configPathDestination="${mainDir}/src/database/users/${username}/Modules/Network/${networkName}/Config"
    componentPath="${mainDir}/src/database/users/${username}/Modules/Network/${networkName}"
fi

if [[ "${networkMachineId}" != "" ]] && [[ "${networkMachineId}" != "0" ]]; then
    read sshUsername machineIp privateKeyPath <<<$(sh src/database/scripts/Common/findMachine.sh "${username}" "${networkMachineId}")

    if [[ !("${networkConfigName}" == "" ||  "${networkConfigName}" == "No Config") ]]; then
        echo "Move Config file to the designated server"
        commandToRunInCluster="cd '${networkName}' && mkdir -p Config && cd Config && rm -f config.sh"
        sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
        sh src/database/scripts/Common/scp.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${configFilePath}" "run" "${networkName}"
    fi

    echo "Run run script"
    commandToRunInCluster="cd '${networkName}' && sh run.sh"
    sh src/database/scripts/Common/ssh.sh "${sshUsername}" "${machineIp}" "${privateKeyPath}" "${commandToRunInCluster}"
else
    if [[ !("${networkConfigName}" == "" ||  "${networkConfigName}" == "No Config") || "${iStreamNetworkManualConfig}" == "false" ]]; then
        echo "Move Config file beside the component"
        mkdir -p "${configPathDestination}"
        rm -f "${configPathDestination}/Config.sh"
        cp "${configFilePath}" "${configPathDestination}/Config.sh"
    fi
    echo "Run run script"
    sh "${componentPath}/run.sh"
fi

if [[ "${networkType}" == "iStream" ]]; then
    if [[ "${iStreamNetworkManualConfig}" == "false" ]]; then
        rm "${configFilePath}"
    fi
fi
