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

class Topology(Topo):
    def build(self):
        s1 = self.addSwitch('s1')
        h1 = self.addHost('h1', ip="10.0.0.3")
        h2 = self.addHost('h2', ip="10.0.0.4")
        h3 = self.addHost('h3', ip="10.0.0.5")
        self.addLink(h1, s1)
        self.addLink(h2, s1)
        self.addLink(h3, s1)
        # s1.cmd('ovs-vsctl add-port s1 gre0 -- set interface gre0 type=gre options:remote_ip=172.17.0.2')

if __name__ == '__main__':
    setLogLevel('info')
    topo = Topology()
    c1 = RemoteController('c1', ip='172.17.0.2')
    net = Mininet(topo=topo, controller=c1, link=TCLink)
    net.start()

    os.system('ovs-vsctl add-port s1 gre0 -- set interface gre0 type=gre options:remote_ip=172.17.0.2')

    CLI(net)
    net.stop()