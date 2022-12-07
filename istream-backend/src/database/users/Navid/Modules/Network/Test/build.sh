#!/bin/bash

# sudo docker run --name mynginx2 --mount type=bind source=/mnt/volume/outputs,target=/usr/share/nginx/html,readonly -p 80:80 -d nginx

mainDir=$(pwd)
echo ${mainDir}

# docker build ./Database/SupportedModules/Transcoder/${transcoderName} -t server_component --build-arg transcoderConfigName=emptyConfig.sh
