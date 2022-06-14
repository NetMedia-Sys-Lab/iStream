#!/bin/bash

username=$1
experimentId=$2
numberOfRepetition=$3

experimentsList=$(jq --arg experimentId ${experimentId} '.[] | select(.experimentId == $experimentId)' src/database/users/${username}/experiments_list.json)
transcoderComponentExistence=$(jq '.transcoderComponentExistence' <<<${experimentsList})
networkComponentExistence=$(jq '.networkComponentExistence' <<<${experimentsList})

for i in $(seq 1 $numberOfRepetition); do
    # Server Component
    echo "------ Server component running started ------"
    # sh src/database/scripts/Server/run.sh "${username}" "${experimentId}" 2>&1
    echo "------ Server component running Finished ------"

    # Transcoder Component
    if [ ${transcoderComponentExistence} = true ]; then
        echo "------ Transcoder component running started ------"
        # sh src/database/scripts/Transcoder/run.sh "${username}" "${experimentId}" 2>&1
        echo "------ Transcoder component running Finished ------"
    fi

    # Network Component
    if [ ${networkComponentExistence} = true ]; then
        echo "------ Network component running started ------"
        # sh src/database/scripts/Network/run.sh "${username}" "${experimentId}" 2>&1
        echo "------ Network component running Finished ------"
    fi

    # Client Component
    echo "------ Client component running started ------"
    sh src/database/scripts/Client/run.sh "${username}" "${experimentId}" 2>&1
    echo "------ Client component running Finished ------"
done

echo -n "Experiment has been run"
