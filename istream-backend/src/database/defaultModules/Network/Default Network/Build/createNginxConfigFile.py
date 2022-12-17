import os
import sys

arguments = eval(sys.argv[1])

with open("{}/nginxTemplate.conf".format(os.path.realpath(os.path.dirname(__file__))), "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace('${serverIP}', arguments["serverMachineIP"])
    filedata = filedata.replace(
        '${serverPort}', arguments["serverContainerPort"])

    with open("{}/nginx.conf".format(os.path.realpath(os.path.dirname(__file__))), 'w') as fileToWrite:
        fileToWrite.write(filedata)
