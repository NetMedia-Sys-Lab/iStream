#!bin/bash
tc qdisc add dev eth0 root netem delay 100ms

sdd