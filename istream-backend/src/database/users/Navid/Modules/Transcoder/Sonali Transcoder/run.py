# ******** Author - Asif Ali Mehmuda *******************
# This script transcodes video segments and calculates the transcoding stats/metrics

import subprocess
import os
import time
import json
import psutil
import multiprocessing
from Config.config import config
import csv


class Manager:
    def __init__(self, commands, numParallelSegments, conversionMap, dimension):
        self.commands = commands
        self.numParallelSegments = numParallelSegments
        self.conversionMap = conversionMap
        self.segmentsStats = []
        self.batchStats = []
        self.dimension = dimension

    def scheduleTranscode(self, segments, sourceResolution, targetResolution):
        segmentList = segments.copy()  # make a copy
        while(len(segmentList) > 0):
            segments = []
            # get the parallel segments
            for i in range(self.numParallelSegments):
                segments.append(segmentList.pop(0))
            # Results for each segment
            resultListTemp = []
            for segment in segments:
                command = f"ffprobe -i /home/sonali/Documents/final_dataset/segments/{segment} 2>&1"
                output = subprocess.check_output(command, shell=True)
                output = output.decode('utf-8')
                output = output.strip()
                outputArr = output.split('\n')
                durationData = [x for x in outputArr if "Duration" in x][0]
                videoData = [x for x in outputArr if "Video:" in x][0]
                duration = float([x for x in durationData.split(
                    ',') if "Duration" in x][0].split(':')[3].strip())
                fps = float([x for x in videoData.split(',')
                            if "fps" in x][0].strip().split(' ')[0])
                resultListTemp.append({
                    'segment': segment,
                    'duration': duration,
                    'fps': fps,
                    'width': self.conversionMap[sourceResolution],
                    'height': sourceResolution,
                    'output_width': self.conversionMap[targetResolution],
                    'output_height': targetResolution,
                    'pixels': int(self.conversionMap[sourceResolution])*int(sourceResolution),
                    'output_pixels': int(self.conversionMap[targetResolution])*int(targetResolution),
                })

            # For each core
            # for cores in coresList:
            for cores in coresList:

                # get the commands
                for commandItem in self.commands:
                    commandList = []
                    for segment in segments:
                        command = commandItem['cmd']
                        id = commandItem['id']
                        command = command + ' 2>&1'
                        command = command.replace('<input>', os.path.join(
                            "/hevc/transcode/docker/Input", segment))  # dockerInputDirectory, segment))
                        output_base_name = segment.replace('.mp4', '')
                        # 'scale={resolution}:{resolutionh},crop={tilew}:{tileh}:{currTilew}:{currTileh}'
                        tilew = int(
                            int(self.conversionMap[targetResolution])/self.dimension)
                        tileh = int(int(targetResolution)/self.dimension)
                        count = 0
                        scaleCommand = ''
                        paramCommand = ''
                        for x in range(self.dimension):
                            for y in range(self.dimension):
                                currTilew = x*tilew
                                currTileh = y*tileh
                                scaleCommand = f'{scaleCommand}[0:v]scale={self.conversionMap[targetResolution]}:{targetResolution},crop={tilew}:{tileh}:{currTilew}:{currTileh}[out{count}];'
                                paramCommand = f"{paramCommand} -map [out{count}] -vcodec libx265  -preset ultrafast -tune zerolatency -x265-params pools='*':slices=1:frame-threads=16:wpp=1 /hevc/transcode/docker/Output/{output_base_name}_tile{count}.mp4"
                                count = count+1
                        scaleCommand = scaleCommand[:-1]
                        command = command.replace(
                            '<filterComplex>', f'"{scaleCommand}" {paramCommand}')
                        #command = command.replace('<target>', self.conversionMap[targetResolution])
                        output_base_name = segment.replace(
                            '.y4m', 'mp4')  # dockerOutputDirectory
                        #command = command.replace('<output>', os.path.join("/VideoProcessing/Output", f'R_{sourceResolution}_{targetResolution}_{id}_{cores}_{output_base_name}'))
                        # Convert to docker command
                        command = f'kubectl exec {podName} -- {command}'
                        print(command)
                        #command = f'docker container run --rm --privileged --cpus {cores} --mount type=bind,source={dockerMountPath},target=/VideoProcessing {dockerImage} {command}'
                        commandList.append({
                            'id': id,
                            'segment': segment,
                            'command': command
                        })

                    print(
                        f'Transcoding Segment {segments} on {cores} cores from {sourceResolution} -> {targetResolution} using command id {commandList[0]["id"]}')
                    # print(commandList)
                    # run the commands in parallel
                    cpuUsage = None
                    results = None
                    with multiprocessing.Pool(self.numParallelSegments) as p:
                        psutil.cpu_percent()  # ignore
                        results = p.map(Manager.transcode, commandList)
                        cpuUsage = psutil.cpu_percent()
                    for index in range(len(results)):
                        resultListTemp[index][f'Core_{cores}_outputBitrate_{results[index]["id"]}'] = results[index]['bitrate']
                        resultListTemp[index][f'Core_{cores}_TT_{results[index]["id"]}'] = results[index]["totalTime"]
                        resultListTemp[index][f'Core_{cores}_ET_{results[index]["id"]}'] = results[index]["encodingTime"]
                        resultListTemp[index][f'Core_{cores}_CPU_{results[index]["id"]}'] = cpuUsage
                    cleanFolder(dockerOutputPath)
            self.segmentsStats.extend(resultListTemp.copy())

    @staticmethod
    def transcode(data):
        command = data['command']
        # print(command)
        startTime = time.time()
        output = subprocess.check_output(command, shell=True)
        endTime = time.time()
        duration = round(endTime - startTime, 3)
        output = output.decode('utf-8')
        stats = Manager.extractEncodingStats(output)
        stats['id'] = data['id']
        stats['segment'] = data['segment']
        stats['totalTime'] = duration
        return stats

    @staticmethod
    def extractEncodingStats(stats):
        extractedData = stats.split('\n')[-2]
        encodingTime = float(extractedData.split(' ')[4].replace('s', ''))
        fps = float(extractedData.split(' ')[5].replace('(', ''))
        bitrate = float(extractedData.split(' ')[7])
        qp = float(extractedData.split(':')[1])
        return {
            'encodingTime': encodingTime,
            'bitrate': bitrate,
            # 'qp': qp,
            # 'fps': fps
        }

    def writeResult(self, filePath):
        keys = self.segmentsStats[0].keys()
        csv_file = open(filePath, "a")
        dict_writer = csv.DictWriter(csv_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(self.segmentsStats)
        csv_file.close()


def makeFolder(dir):
    print(f'Creating: {dir}')
    if not os.path.exists(dir):
        os.makedirs(dir)


def cleanFolder(dir):
    command = f'rm -rf {dir}/*'
    subprocess.call(command, shell=True)


def getSegmentList(dir, startIndex, count):
    files = os.listdir(dir)
    files.sort()
    return files[startIndex:startIndex + count]


def copySegments(podName, dir, segmentList, destination):
    print('Copying Segments to Docker Input')
    for segment in segmentList:
        cmd = f'cp {os.path.join(dir,segment)} {destination}'
        subprocess.call(cmd, shell=True)

# Where are the input videos located
# videoRepositoryPath = config['videoPath']
# videoDirectory = config['inputVideoName']
# videoDirectoryPath = os.path.join(videoRepositoryPath, videoDirectory)


videoDirectoryPath = config['videoPath']
startIndex = config['startIndex']
count = config['count']
podName = config['podName']
# set up docker mount structure
dockerMountPath = config['dockerMountPath']
dockerInputDirectory = config['dockerInput']
dockerOutputDirectory = config['dockerOutput']
dockerInputPath = os.path.join(dockerMountPath, dockerInputDirectory)
dockerOutputPath = os.path.join(dockerMountPath, dockerOutputDirectory)

# set up the process folders
homePath = config['homePath']
transcodedSegmentsPath = os.path.join(
    homePath, config['transcodedSegmentsFolder'])
resultsPath = os.path.join(homePath, config['resultsFolder'])
resultsBaseName = config['resultsBaseName']
resultFile = os.path.join(resultsPath, f'{resultsBaseName}.csv')
commands = config['commands']
transcodingList = config['transcodingList']
sourceResoultions = [x[0] for x in transcodingList]

numParallelSegments = config['numberParallelSegments']
conversionMap = config['conversionMap']

coresList = config['cores']
#dockerImage = config['dockerImage']
dimension = config['dimension']

# set up the transcoding manager
manager = Manager(commands, numParallelSegments, conversionMap, dimension)

# set up the required folders
# transcoded segments folder
# makeFolder(transcodedSegmentsPath)
# results folder
# makeFolder(resultsPath)

for i in range(len(sourceResoultions)):
    sourceResolution = sourceResoultions[i]
    targetResolutions = transcodingList[i][1]
    # get to the folder which contains the segments
    # os.path.join(videoDirectoryPath, sourceResolution)
    segmentsPath = "/home/sonali/Documents/final_dataset/scaled_1920"
    segments = getSegmentList(segmentsPath, startIndex, count)
    # Copy over the segmentsto docker input
    copySegments(podName, segmentsPath, segments, dockerInputPath)

    for targetResolution in targetResolutions:
        manager.scheduleTranscode(segments, sourceResolution, targetResolution)
    cleanFolder(dockerInputPath)

print('Completed')
print(manager.segmentsStats)
manager.writeResult(resultFile)
