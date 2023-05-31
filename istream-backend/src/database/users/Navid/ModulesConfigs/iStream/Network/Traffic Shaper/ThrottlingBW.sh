#!/bin/bash
tc qdisc add dev eth0 root netem rate 500kbit
