#!/bin/bash

docker run --name mininet-headless --rm --privileged -e DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v /lib/modules:/lib/modules \
    mininet_headless_player &


mininetIP=$(docker container inspect -f '{{ .NetworkSettings.IPAddress }}' mininet)

echo "${mininetIP}"