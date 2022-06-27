import sys


networkContainerPort = sys.argv[1]
serverMachineIp = sys.argv[2]
serverContainerPort = sys.argv[3]

if serverMachineIp == "0" or serverMachineIp == "":
    serverMachineIp = "localhost"

with open("src/database/supportedModulesTemplates/Network/Default Network/nginx.conf", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace('${serverIP}', serverMachineIp)
    filedata = filedata.replace('${serverPort}', serverContainerPort)

    with open('src/database/supportedModules/Network/Default Network/Build/nginx.conf', 'w') as fileToWrite:
        fileToWrite.write(filedata)

with open("src/database/supportedModulesTemplates/Network/Default Network/run.sh", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace(
        '${networkContainerPort}', networkContainerPort)

    with open('src/database/supportedModules/Network/Default Network/run.sh', 'w') as fileToWrite:
        fileToWrite.write(filedata)
