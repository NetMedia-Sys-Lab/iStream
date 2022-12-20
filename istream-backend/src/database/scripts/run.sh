# !/bin/bash

username=$1
experimentId=$2

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

transcoderComponentExistence=$(jq -r '.transcoderComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
networkComponentExistence=$(jq -r '.networkComponentExistence' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)
numberOfRepetition=$(jq -r '.repetition' src/database/users/${username}/Experiments/${experimentId}/experimentConfig.json)

firstRun=true

# Video Component
echo "------ Video component Running started ------"
sh ${DIR}/Video/run.sh "${username}" "${experimentId}" 2>&1
echo "------ Video component Running Finished ------"

for i in $(seq 1 $numberOfRepetition); do
    if [ $i -gt 1 ]; then
        firstRun=false
    fi

    # Server Component
    echo "------ Server component running started ------"
    sh "${DIR}/Server/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
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
        sh "${DIR}/Network/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
        echo "------ Network component running Finished ------"
    fi

    # Client Component
    echo "------ Client component running started ------"
    sh "${DIR}/Client/run.sh" "${username}" "${experimentId}" "${firstRun}" 2>&1
    echo "------ Client component running Finished ------"
done

# Delete video excessive video content
sh "${DIR}/Video/delete.sh" "${username}" "${experimentId}"

echo -n "Experiment has been run"
