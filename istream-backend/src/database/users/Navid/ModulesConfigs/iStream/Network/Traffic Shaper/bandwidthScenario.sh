#! /bin/bash
for i in {1024,4096,2048,1024,4096}
do
    tc qdisc del dev eth0 root
    tc qdisc add dev eth0 root netem rate ${i}kbit
    sleep 10;
done