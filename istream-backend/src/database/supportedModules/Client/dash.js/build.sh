#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

source $HOME/.nvm/nvm.sh

npm list -g | grep pm2 $1 &>/dev/null

if [ ! $? -eq 0 ]; then
    npm install pm2 -g
fi

if [ ! -d "node_modules" ]; then
    echo "DASH.js started to install"
    npm install
    echo "DASH.js installed"
fi
