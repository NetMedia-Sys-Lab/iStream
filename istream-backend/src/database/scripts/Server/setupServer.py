import sys

serverContainerPort = sys.argv[1]

with open("src/database/supportedModulesTemplates/Server/Nginx Dash/run.sh", "rt") as fileToChange:
    filedata = fileToChange.read()
    filedata = filedata.replace(
        '${serverContainerPort}', serverContainerPort)

    with open('src/database/supportedModules/Server/Nginx Dash/run.sh', 'w') as fileToWrite:
        fileToWrite.write(filedata)
