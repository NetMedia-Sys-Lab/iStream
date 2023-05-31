import os
import sys

serverMachineIP = sys.argv[1]
serverContainerPort = sys.argv[2]

with open("{}/nginxTemplate.conf".format(os.path.realpath(os.path.dirname(__file__))), "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace('${serverIP}', serverMachineIP)
    filedata = filedata.replace(
        '${serverPort}', serverContainerPort)

    with open("{}/nginx.conf".format(os.path.realpath(os.path.dirname(__file__))), 'w') as fileToWrite:
        fileToWrite.write(filedata)
