#!/bin/bash

docker ps -q --filter "name=server_container" | grep -q . && \
echo "Remove previous server docker container" && docker stop server_container && docker rm -fv server_container

# sudo docker run --name server_container --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d server_navid
docker run --name server_container -p 9000:80 -d server_image

# docker exec server_container ./usr/local/nginx/html/${transcoderConfigName}
# echo "here"