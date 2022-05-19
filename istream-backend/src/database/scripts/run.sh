#!/bin/bash

username=$1
experimentId=$2

# Server Component
echo "------ Server component running started ------"
sh src/database/scripts/Server/run.sh "${username}" "${experimentId}" 2>&1
echo "------ Server component running Finished ------"

# Transcoder Component
echo "------ Transcoder component running started ------"
sh src/database/scripts/Transcoder/run.sh "${username}" "${experimentId}" 2>&1
echo "------ Transcoder component running Finished ------"

# Network Component
echo "------ Network component running started ------"
sh src/database/scripts/Network/run.sh "${username}" "${experimentId}" 2>&1
echo "------ Network component running Finished ------"

# Client Component
echo "------ Client component running started ------"
sh src/database/scripts/Client/run.sh "${username}" "${experimentId}" 2>&1
echo "------ Client component running Finished ------"

mainDir=$(pwd)

echo -n "Experiment has been run"
