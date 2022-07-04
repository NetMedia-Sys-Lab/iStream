import sys
import json

username = sys.argv[1]
experimentId = sys.argv[2]


def retrieveLocalIP():
    import socket
    socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    socket .connect(("8.8.8.8", 80))
    localIp = socket.getsockname()[0]
    socket.close()
    return localIp


dependency_file = json.load(open(
    "src/database/users/{}/Experiments/{}/dependency.json".format(username, experimentId)))
experimentsConfig = json.load(open(
    "src/database/users/{}/experiments_list.json".format(username)))
experimentConfig = [
    x for x in experimentsConfig if x["experimentId"] == experimentId]

headlessPlayerConfig = json.load(open(
    "src/database/users/{}/Experiments/{}/headlessPlayerConfig.json".format(username, experimentId)))

destinationPort = 0
destinationIP = 0

adaptationAlgorithmMap = {"Buffer-based ABR": "--abr buffer-based",
                          "Hybrid ABR": "--abr hybrid", "Bandwidth-based ABR": ""}


if(experimentConfig[0]["networkComponentExistence"]):
    if(dependency_file['Network']['type'] == 'iStream' and dependency_file['Network']['name'] == 'Default Network'):
        networkConfig = json.load(open(
            "src/database/users/{}/Experiments/{}/networkConfig.json".format(username, experimentId)))
        destinationPort = networkConfig['port']

    if(dependency_file['Network']['machineID'] == "0" or dependency_file['Network']['machineID'] == ""):
        destinationIP = retrieveLocalIP()
    else:
        userMachinesList = json.load(open(
            "src/database/users/{}/machine_list.json".format(username)))
        usedMachined = [
            x for x in userMachinesList if x["machineID"] == dependency_file['Network']['machineID']]
        destinationIP = usedMachined[0]["machineIp"]
else:
    if(dependency_file['Server']['type'] == 'iStream' and dependency_file['Server']['name'] == 'Nginx Dash'):
        serverConfig = json.load(open(
            "src/database/users/{}/Experiments/{}/serverConfig.json".format(username, experimentId)))
        destinationPort = serverConfig['port']

    if(dependency_file['Server']['machineID'] == 0 or dependency_file['Server']['machineID'] == ""):
        destinationIP = retrieveLocalIP()
    else:
        userMachinesList = json.load(open(
            "src/database/users/{}/machine_list.json".format(username)))
        usedMachined = [
            x for x in userMachinesList if x["machineID"] == dependency_file['Server']['machineID']]
        destinationIP = usedMachined[0]["machineIp"]

if(destinationPort == 0):
    destinationPort = headlessPlayerConfig['connectingPort']

with open("src/database/supportedModulesTemplates/Client/Headless Player ABR/run.sh", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace(
        '${ABR}', adaptationAlgorithmMap[headlessPlayerConfig["adaptationAlgorithm"]])
    filedata = filedata.replace(
        '${mpdFileName}', headlessPlayerConfig["mpdFileName"])
    filedata = filedata.replace('${IP}', destinationIP)
    filedata = filedata.replace('${Port}', str(destinationPort))

    with open('src/database/supportedModules/Client/Headless Player ABR/run.sh', 'w') as fileToWrite:
        fileToWrite.write(filedata)
