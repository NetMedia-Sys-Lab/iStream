FROM python:3
LABEL author="Navid Akbari <anavid.akbari@gmail.com>"
LABEL version="0.1"
LABEL description="This is custom Docker image for the headless player."

RUN apt-get update && \
	apt-get -qq install -y git

RUN git clone --single-branch --branch v0.1 https://github.com/Yang-Jace-Liu/dash-emulator.git && \
    cd dash-emulator && \
    pip install --no-cache-dir --upgrade pip && \
    pip install pybuilder && \
    pyb install

RUN python -m dash_emulator.main -h

#CMD ["dash-emulator.py", "172.17.0.2/test.mpd"]
