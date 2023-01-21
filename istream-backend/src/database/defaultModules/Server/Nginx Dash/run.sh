#!/bin/bash
arguments=$1

# DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
DIR="$(dirname -- "$0")"
serverDockerPort=$(jq -r '.serverContainerPort' <<<${arguments})

docker ps -a -q --filter "name=istream_server_nginx_container" | grep -q . &&
    echo "Remove previous server docker container" && docker stop istream_server_nginx_container && docker rm -fv istream_server_nginx_container

docker run --name istream_server_nginx_container -p ${serverDockerPort}:80 -d istream_server_nginx_image

docker cp "${DIR}/Run/Videos/." istream_server_nginx_container:/usr/local/nginx/html/
