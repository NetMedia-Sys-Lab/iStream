#!/usr/bin/env bash

service openvswitch-switch start
ovs-vsctl set-manager ptcp:6640

./usr/local/nginx/sbin/nginx -g "daemon off;"

# sleep 5
# python Topology.py

# service openvswitch-switch stop
