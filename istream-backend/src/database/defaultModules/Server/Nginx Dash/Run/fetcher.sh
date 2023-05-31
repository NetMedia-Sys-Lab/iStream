#!/bin/bash
DIR="$(dirname -- "$0")"

docker cp "${DIR}/Videos/." istream_server_nginx_container:/usr/local/nginx/html/