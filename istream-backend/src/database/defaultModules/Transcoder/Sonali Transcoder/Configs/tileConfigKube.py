config = {
    "transcodingList": 
        [
            #["2160", ["960"]],
            ["1920", ["960"]],
            #["960", ["960"]],
            #["2160p", ["360p", "240p"]],
            #["1080p", ["360p", "240p"]],
            #["720p", ["720p", "480p", "360p", "240p"]],
            #["480p", ["480p", "360p", "240p"]],
            #["360p", ["360p", "240p"]],
            #["240p", ["240p"]],
        ],
    "conversionMap": {
        "2160": "3840",
        "1920": "1078",
        "960": "540"
        #"1080p": "1920x1080",
        #"720p": "1280x720",
        #"480p": "720x480",
        #"360p": "640x360",
        #"240p": "426x240",
    },
    "podName":"pod/hevc3-7bc74fb46c-6zxlq",
    "dimension":2,
    "numberParallelSegments": 1,
    "videoPath":"/home/sonali/Documents/final_dataset/scaled_1920",
    "homePath":"/home/sonali/Documents/transcode",
    "transcodedSegmentsFolder":"TranscodedSegments",
    "resultsFolder":"Results",
    "resultsBaseName":"testing",
    "startIndex": 0,
    "count": 500,
    "dockerMountPath":"/home/sonali/Documents/transcode/docker",
    "dockerInput":"Input",
    "dockerOutput":"Output",
    "cores":[16],#2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
    #"dockerImage":"registry.gitlab.com/sonalik/360degreevideotranscoding/test",
    "commands": [
    # {
    #     "id": 1,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -x265-params crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 2,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 3,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='none':crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    {
        "id": 4,
        #'scale={resolution}:{resolutionh},crop={tilew}:{tileh}:{currTilew}:{currTileh}'
        "cmd": "ffmpeg -loglevel error -y -i <input> -filter_complex <filterComplex>"
    },
    # {
    #     "id": 5,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=0:pools='none':crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    #{
    #    "id": 6,
    #    "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='*':crf=28 -vf scale=<target> -c:a copy <output>"
    #},
    # {
    #     "id": 7,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='*':lookahead-slices=0:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 8,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='*':wpp=0:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 9,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=0:pools='*':lookahead-slices=0:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 10,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='*':slices=2:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 11,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=0:pools='*':slices=2:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 12,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=1:pools='*':lookahead-slices=0:slices=2:crf=28 -vf scale=<target> -c:a copy <output>"
    # },
    # {
    #     "id": 13,
    #     "cmd": "ffmpeg -loglevel error -i <input> -c:v libx265 -preset ultrafast -x265-params frame-threads=0:pools='+,-':crf=28 -vf scale=<target> -c:a copy <output>"
    # }
    ]
}
