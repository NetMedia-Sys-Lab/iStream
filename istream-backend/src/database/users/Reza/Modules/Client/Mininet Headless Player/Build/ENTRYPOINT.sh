#!/usr/bin/env bash

service openvswitch-switch start
ovs-vsctl set-manager ptcp:6640

# sleep 5
# python Topology.py
while true; do sleep 1; done
# mn 
# ovs-vsctl add-port br0 gre0 -- set interface gre0 type=gre options:remote_ip=172.17.0.4

service openvswitch-switch stop
