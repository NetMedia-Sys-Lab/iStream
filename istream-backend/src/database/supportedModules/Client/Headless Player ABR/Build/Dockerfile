FROM python:3
LABEL author="Navid Akbari <anavid.akbari@gmail.com>"
LABEL version="0.1"
LABEL description="This is custom Docker image for the headless player."

RUN apt-get update && \
	apt-get -qq install -y git

RUN git clone https://github.com/navidakbari/dash-emulator-different-ABR.git

WORKDIR /dash-emulator-different-ABR

RUN mkdir results

RUN pip install --no-cache-dir --upgrade pip 

RUN pip install .

# RUN python -m dash_emulator.main -h

RUN scripts/dash-emulator.py -h