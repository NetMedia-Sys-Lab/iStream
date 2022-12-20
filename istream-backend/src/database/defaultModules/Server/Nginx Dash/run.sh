#!/bin/bash
arguments=$1

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

serverDockerPort=$(jq -r '.serverContainerPort' <<<${arguments})

docker ps -a -q --filter "name=server_container" | grep -q . &&
    echo "Remove previous server docker container" && docker stop server_container && docker rm -fv server_container

docker run --name server_container -p ${serverDockerPort}:80 -d server_image

docker cp "${DIR}/Run/Videos/." server_container:/usr/local/nginx/html/
