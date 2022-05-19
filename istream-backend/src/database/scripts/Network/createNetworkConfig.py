import sys
import json

networkConfig = json.loads(sys.argv[1])

with open('src/database/scripts/Network/networkConfiguration.sh', 'w') as bash:
    bash.write('#! /bin/bash \n')
    if networkConfig['delay'] != 0 and networkConfig['bandwidth'] != 0:
        bash.write('tc qdisc add dev eth0 root netem delay ' + str(
            networkConfig['delay']) + 'ms rate ' + str(networkConfig['bandwidth']) + 'kbit \n')

    if networkConfig['packetLoss'] != 0 and networkConfig['bandwidth'] != 0:
        bash.write('tc qdisc add dev eth0 root netem loss ' + str(
            networkConfig['packetLoss']) + '% ' + 'rate ' + str(networkConfig['bandwidth']) + 'kbit \n')

    if networkConfig['corruptPacket'] != 0:
        bash.write('tc qdisc add dev eth0 root netem corrupt ' +
                   str(networkConfig['corruptPacket']) + '% \n')

    if networkConfig['bandwidth'] != 0:
        bash.write('tc qdisc add dev eth0 root netem rate ' +
                   str(networkConfig['bandwidth']) + 'kbit \n')
