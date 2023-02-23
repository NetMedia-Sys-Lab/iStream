#!/bin/bash

DIR="$(dirname -- "$0")"

rm -rf "${DIR}/Build"

git clone https://github.com/Dash-Industry-Forum/dash.js.git "${DIR}/Build"

# source $HOME/.nvm/nvm.sh

npm list -g | grep pm2 $1 &>/dev/null

if [ ! $? -eq 0 ]; then
    npm install pm2 -g
fi

if [ ! -d "${DIR}/Build/node_modules" ]; then
    echo "DASH.js started to install"
    cd "${DIR}/Build"
    npm install
    echo "DASH.js installed"
fi
