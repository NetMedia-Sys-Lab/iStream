import sys
import json
import os
import glob

defaultConfigPath = "{}/config.json".format(
    os.path.realpath(os.path.dirname(__file__)))

networkConfigTemplateScript = "{}/networksConfigTemplates.txt".format(
    os.path.realpath(os.path.dirname(__file__)))

applyNetworkConfigScript = "{}/applyNetworksConfig.sh".format(
    os.path.realpath(os.path.dirname(__file__)))

with open(networkConfigTemplateScript, "rt") as fileToChange:
    filedata = fileToChange.read()

    if os.path.isfile(defaultConfigPath):
        with open(defaultConfigPath, "rt") as configFile:
            networkConfig = json.load(configFile)
            print(networkConfig['packetLoss'] == 0)

        if (networkConfig['delay'] == 0 and networkConfig['bandwidth'] == 0 and networkConfig['packetLoss'] == 0 and networkConfig['corruptPacket'] == 0):
            print("here")
            filedata = filedata.replace(
                '${defaultConfig}', '#')
            filedata = filedata.replace(
                '${manualConfig}', '#')

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
    else:
        if glob.glob("{}/config.*".format(
                os.path.realpath(os.path.dirname(__file__)))):
            filedata = filedata.replace(
                '${manualConfig}', '')
            filedata = filedata.replace(
                '${defaultConfig}', '#')
        else:
            filedata = filedata.replace(
                '${manualConfig}', '#')
            filedata = filedata.replace(
                '${defaultConfig}', '#')

    with open(applyNetworkConfigScript, 'w') as fileToWrite:
        fileToWrite.write(filedata)

    # with open('src/database/supportedModules/Network/Default Network/run.sh', 'w') as fileToWrite:
    #     fileToWrite.write(filedata)
