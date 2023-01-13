# !/bin/bash

username=$1
experimentId=$2

mainDir=$(pwd)

transcoderComponentExistence=$(jq -r '.transcoderComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
networkComponentExistence=$(jq -r '.networkComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
numberOfRepetition=$(jq -r '.repetition' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

firstRun=true

# Video Component
# echo "------ Video component Running started ------"
# bash "${mainDir}/src/database/scripts/Video/run.sh" "${username}" "${experimentId}" 2>&1
# echo "------ Video component Running Finished ------"

for i in $(seq 1 $numberOfRepetition); do
    if [ $i -gt 1 ]; then
        firstRun=false
    fi
    # Server Component
    echo "------ Server component running started ------"
    bash "${mainDir}/src/database/scripts/Server/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
    echo "------ Server component running Finished ------"

    #     # Transcoder Component
    #     if [ ${transcoderComponentExistence} = true ]; then
    #         echo "------ Transcoder component running started ------"
    #         # sh src/database/scripts/Transcoder/run.sh "${username}" "${experimentId}" "${firstRun}" 2>&1
    #         echo "------ Transcoder component running Finished ------"
    #     fi

    # Network Component
    if [ ${networkComponentExistence} = true ]; then
        echo "------ Network component running started ------"
        bash "${mainDir}/src/database/scripts/Network/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
        echo "------ Network component running Finished ------"
    fi

    # Client Component
    echo "------ Client component running started ------"
    bash "${mainDir}/src/database/scripts/Client/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
    echo "------ Client component running Finished ------"
done

# Delete video excessive video content
# bash "${mainDir}/src/database/scripts/Video/delete.sh" "${username}" "${experimentId}"
bash "${mainDir}/src/database/scripts/Server/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
bash "${mainDir}/src/database/scripts/Network/deleteConfig.sh" "${username}" "${experimentId}" 2>&1
bash "${mainDir}/src/database/scripts/Client/deleteConfig.sh" "${username}" "${experimentId}" 2>&1

echo -n "Experiment has been run"
