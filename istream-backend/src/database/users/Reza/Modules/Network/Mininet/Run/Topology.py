#!/usr/bin/python

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
import subprocess


"""Custom topology example"""


class Topology(Topo):
    def build(self):
        s3 = self.addSwitch('s3')
        s4 = self.addSwitch('s4')
        s5 = self.addSwitch('s5')
        s6 = self.addSwitch('s6')

        self.addLink(s3, s5)
        self.addLink(s5, s4)
        self.addLink(s3, s6)
        self.addLink(s6, s4)


if __name__ == '__main__':
    setLogLevel('info')

    defaultConfigPath = "{}/config.json".format(
        os.path.realpath(os.path.dirname(__file__)))

    if os.path.isfile(defaultConfigPath):
        with open(defaultConfigPath, "rt") as configFile:
            config = json.load(configFile)
    topo = Topology()

    c1 = RemoteController('c1', ip=config["networkIP"])
    net = Mininet(topo=topo, controller=c1, link=TCLink)
    net.start()

    # subprocess.check_output(
    #     'ovs-vsctl add-port s3 gre0 -- set interface gre0 type=gre options:remote_ip={}'.format(config["clientIP"]), shell=True)
    # subprocess.check_output('ovs-vsctl add-port s4 gre1 -- set interface gre1 type=gre options:remote_ip={}'.format(config["serverIP"])', shell=True)
    os.system(
    'ovs-vsctl add-port s3 gre0 -- set interface gre0 type=gre options:remote_ip={}'.format(config["clientIP"]))
    os.system(
        'ovs-vsctl add-port s4 gre1 -- set interface gre1 type=gre options:remote_ip={}'.format(config["serverIP"]))
    sleep(5)
    postFilePath = "{}/post.py".format(
        os.path.realpath(os.path.dirname(__file__)))
    os.system('python3 {} {}'.format(postFilePath, config["networkIP"]))

    CLI(net)
    while 1:
        True
    # net.stop()
