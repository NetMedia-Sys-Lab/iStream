#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker ps -a -q --filter "name=server_container" | grep -q . &&
    echo "Remove previous server docker container" && docker stop server_container && docker rm -fv server_container

# docker run --name server_container --mount type=bind,source=/mnt/volume/outputs,target=/usr/local/nginx/html/,readonly -p 9000:80 -d server_navid
docker run --name server_container -p ${serverContainerPort}:80 -d server_image

docker cp "${DIR}/Run/Videos/." server_container:/usr/local/nginx/html/

${manualConfig}docker cp "${DIR}/Config/config.sh" server_container:/usr/local/nginx/html/
${manualConfig}docker exec server_container chmod 777 ./usr/local/nginx/html/config.sh
${manualConfig}docker exec server_container ./usr/local/nginx/html/config.sh
