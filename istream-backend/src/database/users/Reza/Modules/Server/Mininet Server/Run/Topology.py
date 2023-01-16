#!/usr/bin/python

"""Custom topology example
"""
from mininet.topo import Topo
from mininet.net import Mininet
from mininet.node import Controller, RemoteController, OVSController
from mininet.node import CPULimitedHost, Host, Node
from mininet.node import OVSKernelSwitch, UserSwitch
from mininet.node import IVSSwitch
from mininet.cli import CLI
from mininet.log import setLogLevel, info
from mininet.link import TCLink, Intf
from subprocess import call
from time import sleep
from mininet.term import makeTerms, makeTerm, runX11
import os
import json


class Topology(Topo):
    def build(self):
        s2 = self.addSwitch('s2')
        h4 = self.addHost('h4', ip="10.0.0.4")
        h5 = self.addHost('h5', ip="10.0.0.5")
        self.addLink(h4, s2)
        self.addLink(h5, s2)


if __name__ == '__main__':
    setLogLevel('info')

    defaultConfigPath = "{}/config.json".format(
        os.path.realpath(os.path.dirname(__file__)))

    if os.path.isfile(defaultConfigPath):
        with open(defaultConfigPath, "rt") as configFile:
            config = json.load(configFile)

    topo = Topology()
    sleep(2)
    c1 = RemoteController('c1', ip=config["networkIP"])
    net = Mininet(topo=topo, controller=c1, link=TCLink)
    net.start()

    os.system(
        'ovs-vsctl add-port s2 gres -- set interface gres type=gre options:remote_ip={}'.format(config["networkIP"]))

    hosts = net.hosts
    hostNumber = 5
    for host in hosts:
        for i in range(1, hostNumber+1):
            if i < 10:
                host.cmdPrint(
                    'arp -s 10.0.0.{} 00:00:00:00:00:0{}'.format(i, i))
            if i >= 10:
                host.cmdPrint(
                    'arp -s 10.0.0.{} 00:00:00:00:00:{}'.format(i, i))

    # print("sleep....")
    # sleep(30)
    #hosts[0].cmdPrint('python3 -m dash_emulator.main http://10.0.0.3/live.mpd --output /root/result -y')
    hosts[0].cmdPrint('/usr/local/nginx/sbin/nginx')
    hosts[1].cmdPrint('/usr/local/nginx/sbin/nginx')

    CLI(net)
    while 1:
        True
    # net.stop()
