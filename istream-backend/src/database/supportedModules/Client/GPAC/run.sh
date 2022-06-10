#!/bin/bash

docker ps -q --filter "name=gpac_container" | grep -q . && \
echo "Remove previous server docker container" && docker stop gpac_container && docker rm -fv gpac_container

# sudo docker run --name gpac_container --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d server_navid
docker run --name gpac_container -d gpac_image

# echo "here"