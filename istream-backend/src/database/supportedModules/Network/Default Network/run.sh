#!/bin/bash

docker ps -q --filter "name=network_container" | grep -q . && \
echo "Remove previous network docker container" && docker stop network_container && docker rm -fv network_container

# docker run --name network_container --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d network_navid
docker run --name network_container -p 8080:8080 -d network_image

# should ask the port wants to use
# docker run client_image python -m dash_emulator.main http://10.1.6.221:8080/output.mpd
# docker container run --name client_container client_image scripts/dash-emulator.py http://10.1.6.221:8080/output.mpd


