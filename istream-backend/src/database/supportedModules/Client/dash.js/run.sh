#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"
cd "${DIR}"

source $HOME/.nvm/nvm.sh
export NODE_OPTIONS=--openssl-legacy-provider

pm2 -s --name dashjs start npm -- start
# npm run start&

echo "Dash.js client is up on the port 9090 of the system you are running it."
