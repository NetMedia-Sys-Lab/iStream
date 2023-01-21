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
import subprocess
from time import sleep
from mininet.term import makeTerms, makeTerm, runX11
import os
import json


class Topology(Topo):
    def build(self):
        s1 = self.addSwitch('s1')
        h1 = self.addHost('h1', ip="10.0.0.1", mac="00:00:00:00:00:01")
        h2 = self.addHost('h2', ip="10.0.0.2", mac="00:00:00:00:00:02")
        h3 = self.addHost('h3', ip="10.0.0.3", mac="00:00:00:00:00:03")
        self.addLink(h1, s1)
        self.addLink(h2, s1)
        self.addLink(h3, s1)


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
        'ovs-vsctl add-port s1 grec -- set interface grec type=gre options:remote_ip={}'.format(config["networkIP"]))

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

    hosts[0].cmdPrint('ifconfig h1-eth0 mtu 1400 up')
    hosts[1].cmdPrint('ifconfig h2-eth0 mtu 1400 up')
    hosts[2].cmdPrint('ifconfig h3-eth0 mtu 1400 up')
    #os.system('python3 post.py')
    sleep(20)
    # print("here in client about to running experiment")
    # hosts[0].cmdPrint("ping 10.0.0.4 -c 4")
    # # print(hosts[0].cmd("ping 10.0.0.4"))
    hosts[0].cmdPrint(
        'scripts/dash-emulator.py --dump-results results/result1 http://10.0.0.4/output.mpd')

    # hosts[1].popen(
    #     'scripts/dash-emulator.py --dump-results results/result2 http://10.0.0.4/output.mpd')

    # hosts[2].popen(
    #     'scripts/dash-emulator.py --dump-results results/result3 http://10.0.0.5/output.mpd')

    CLI(net)
    while 1:
        True

    # resultNotReady = True
    # sleep(15)
    # while resultNotReady:
    #     output = subprocess.check_output(
    #         'cd results & ls result* | wc -l', shell=True)
    #     # os.popen('cd results & ls result* | wc -l').read()
    #     print(output)
    #     if output == 3:
    #         resultNotReady = False
# # os.system('cd results & ls result* | wc -l')

    # net.stop()
