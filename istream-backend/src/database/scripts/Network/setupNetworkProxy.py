import sys
import socket

serverMachineIp = sys.argv[1]
serverContainerPort = sys.argv[2]

if serverMachineIp == "0" or serverMachineIp == "":
    socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    socket .connect(("8.8.8.8", 80))
    serverMachineIp = socket.getsockname()[0]
    socket.close()

with open("src/database/supportedModulesTemplates/Network/Default Network/nginx.conf", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace('${serverIP}', serverMachineIp)
    filedata = filedata.replace('${serverPort}', serverContainerPort)

    with open('src/database/supportedModules/Network/Default Network/Build/nginx.conf', 'w') as fileToWrite:
        fileToWrite.write(filedata)


