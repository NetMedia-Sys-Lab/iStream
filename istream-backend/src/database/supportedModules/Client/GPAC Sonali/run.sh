#!/bin/bash

docker ps -q --filter "name=gpac_container_sonali" | grep -q . && \
echo "Remove previous server docker container" && docker stop gpac_container_sonali && docker rm -fv gpac_container_sonali

# sudo docker run --name gpac_container_sonali --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d server_navid
docker run --name gpac_container_sonali -d gpac_image_sonali

# echo "here"