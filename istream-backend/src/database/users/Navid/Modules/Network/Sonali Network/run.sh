#!/bin/bash

sudo docker stop mynginx2
sudo docker rm mynginx2
sudo docker run --name mynginx2 --mount type=bind,source=/mnt/volume/outputs,target=/usr/share/nginx/html,readonly -p 7000:80 -d nginx
# echo "here in"