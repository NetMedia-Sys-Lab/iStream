#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE}" )" >/dev/null 2>&1 && pwd )"

docker build "${DIR}/Build" -t server_component
