import sys
import json

networkContainerPort = sys.argv[1]
iStreamNetworkManualConfig = sys.argv[2]

if iStreamNetworkManualConfig == 'false':
    networkConfig = json.loads(sys.argv[3])
elif iStreamNetworkManualConfig == 'true':
    networkConfigName = sys.argv[4]

with open("src/database/supportedModulesTemplates/Network/Default Network/run.sh", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace(
        '${networkContainerPort}', networkContainerPort)

    if iStreamNetworkManualConfig == 'false':
        if networkConfig['delay'] != 0:
            filedata = filedata.replace(
                '${delay}', '--delay ' + str(networkConfig['delay']) + 'ms')
        else:
            filedata = filedata.replace(
                '${delay}', '')

        if networkConfig['bandwidth'] != 0:
            filedata = filedata.replace(
                '${bandwidth}', '--rate ' + str(networkConfig['bandwidth']) + 'Kbps')
        else:
            filedata = filedata.replace(
                '${bandwidth}', '')

        if networkConfig['packetLoss'] != 0:
            filedata = filedata.replace(
                '${packetLoss}', '--loss ' + str(networkConfig['packetLoss']) + '%')
        else:
            filedata = filedata.replace(
                '${packetLoss}', '')

        if networkConfig['corruptPacket'] != 0:
            filedata = filedata.replace(
                '${corruptPacket}', '--corrupt ' + str(networkConfig['corruptPacket']) + '%')
        else:
            filedata = filedata.replace(
                '${corruptPacket}', '')

        filedata = filedata.replace(
            '${defaultConfig}', '')
        filedata = filedata.replace(
            '${manualConfig}', '#')
    elif iStreamNetworkManualConfig == 'true':
        if networkConfigName == "" or networkConfigName == "No Config":
            filedata = filedata.replace(
                '${manualConfig}', '#')
            filedata = filedata.replace(
                '${defaultConfig}', '#')
        else:
            filedata = filedata.replace(
                '${manualConfig}', '')
            filedata = filedata.replace(
                '${defaultConfig}', '#')

    with open('src/database/supportedModules/Network/Default Network/run.sh', 'w') as fileToWrite:
        fileToWrite.write(filedata)
