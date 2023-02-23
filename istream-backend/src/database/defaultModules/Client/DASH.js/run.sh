#!/bin/bash
DIR="$(dirname -- "$0")"

arguments=$1

clientContainerPort=$(jq -r '.clientContainerPort' <<<${arguments})

cd "${DIR}/Build"

export NODE_OPTIONS=--openssl-legacy-provider

pm2 delete dashjs
pm2 -s --name dashjs start npm -- start -- --port ${clientContainerPort}

echo "Dash.js client is up on the port ${clientContainerPort} of the system you are running it."
