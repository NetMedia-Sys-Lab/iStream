import sys

serverMachineIp = sys.argv[1]
serverContainerPort = sys.argv[2]

if serverMachineIp == "0" or serverMachineIp == "":
    serverMachineIp = "localhost"

with open("src/database/supportedModulesTemplates/Network/Default Network/nginx.conf", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace('${serverIP}', serverMachineIp)
    filedata = filedata.replace('${serverPort}', serverContainerPort)

    with open('src/database/supportedModules/Network/Default Network/Build/nginx.conf', 'w') as fileToWrite:
        fileToWrite.write(filedata)


