#!/bin/bash

username=$1
experimentId=$2

# Video Component
echo "------ Video component building started ------"
# sh src/database/scripts/Video/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Video component building Finished ------"

# Server Component
echo "------ Server component building started ------"
# sh src/database/scripts/Server/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Server component building Finished ------"

# Transcoder Component
echo "------ Transcoder component building started ------"
# sh src/database/scripts/Transcoder/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Transcoder component building Finished ------"

# Network Component
echo "------ Network component building started ------"
# sh src/database/scripts/Network/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Network component building Finished ------"

# Client Component
echo "------ Client component building started ------"
sh src/database/scripts/Client/build.sh "${username}" "${experimentId}" 2>&1
echo "------ Client component building Finished ------"

# Delete video excessive video content
# sh src/database/scripts/Video/delete.sh "${username}" "${experimentId}" 2>&1

mainDir=$(pwd)

echo -n "Experiment has been built"
