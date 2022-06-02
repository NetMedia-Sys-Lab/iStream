#!/bin/bash

sudo docker stop server_container_navid
sudo docker rm server_container_navid
sudo docker run --name server_container_navid --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d server_navid
# echo "here"