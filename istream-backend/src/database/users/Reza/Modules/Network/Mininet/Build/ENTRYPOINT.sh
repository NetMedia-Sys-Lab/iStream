#!/usr/bin/env bash

service openvswitch-switch start
ovs-vsctl set-manager ptcp:6640

while true; do sleep 1; done

# sleep 5
# python Topology.py

# service openvswitch-switch stop
