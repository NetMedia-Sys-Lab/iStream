import sys
import json
import os
import glob

defaultConfigPath = "{}/config.json".format(
    os.path.realpath(os.path.dirname(__file__)))

envFileTemplatePath = "{}/envTemplate.yaml".format(
    os.path.realpath(os.path.dirname(__file__)))

envFilePath = "{}/env.yaml".format(
    os.path.realpath(os.path.dirname(__file__)))

with open(envFileTemplatePath, "rt") as fileToChange:
    filedata = fileToChange.read()

    if os.path.isfile(defaultConfigPath):
        with open(defaultConfigPath, "rt") as configFile:
            config = json.load(configFile)
        filedata = filedata.replace(
                '${buffer_duration}', str(config['buffer_duration']))
        filedata = filedata.replace(
                '${safe_buffer_level}', str(config['safe_buffer_level']))
        filedata = filedata.replace(
                '${panic_buffer_level}', str(config['panic_buffer_level']))
        filedata = filedata.replace(
                '${min_rebuffer_duration}', str(config['min_rebuffer_duration']))
        filedata = filedata.replace(
                '${min_start_duration}', str(config['min_start_duration']))
    
    with open(envFilePath, 'w') as fileToWrite:
        fileToWrite.write(filedata)

    # with open('src/database/supportedModules/Network/Default Network/run.sh', 'w') as fileToWrite:
    #     fileToWrite.write(filedata)
