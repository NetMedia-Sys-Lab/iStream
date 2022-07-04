#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

docker ps -q --filter "name=headless_player_container" | grep -q . &&
    echo "Remove previous headless player docker container" && docker stop headless_player_container && docker rm -fv headless_player_container

docker run --name headless_player_container headless_player_component scripts/dash-emulator.py ${ABR} --dump-results results http://${IP}:${Port}/${mpdFileName}
# docker cp headless_player_container:dash-emulator-different-ABR/results .
# docker container run --name client_container_buffer_${i} --network codes_default -it client_component scripts/dash-emulator.py --abr buffer-based --dump-results results/buffer http://network_container:8080/output.mpd
