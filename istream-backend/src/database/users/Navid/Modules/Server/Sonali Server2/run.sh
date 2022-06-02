#!/bin/bash

sudo docker stop server_container
sudo docker rm server_container
sudo docker run --name server_container --mount type=bind,source=/mnt/volume/outputs,target=/usr/share/nginx/html,readonly -p 7000:80 -d server_component
