import sys

serverContainerPort = sys.argv[1]
serverConfigName = sys.argv[2]

with open("src/database/supportedModulesTemplates/Server/Nginx Dash/run.sh", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace(
        '${serverContainerPort}', serverContainerPort)

    if serverConfigName == "" or serverConfigName == "No Config":
        filedata = filedata.replace(
            '${manualConfig}', '#')
    else:
        filedata = filedata.replace(
            '${manualConfig}', '')


    with open('src/database/supportedModules/Server/Nginx Dash/run.sh', 'w') as fileToWrite:
        fileToWrite.write(filedata)
