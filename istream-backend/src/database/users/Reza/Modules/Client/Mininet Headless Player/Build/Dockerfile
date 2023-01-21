FROM python:3
LABEL author="Navid Akbari <anavid.akbari@gmail.com>"
LABEL version="0.1"
LABEL description="This is custom Docker image for the headless player."

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    dnsutils \
    ifupdown \
    iproute2 \
    iptables \
    iputils-ping \
    mininet \
    net-tools \
    openvswitch-switch \
    openvswitch-testcontroller \
    tcpdump \
    vim \
    x11-xserver-utils \
    xterm \
	git \
 && rm -rf /var/lib/apt/lists/* \
 && touch /etc/network/interfaces

RUN git clone https://github.com/navidakbari/dash-emulator-different-ABR.git

WORKDIR /dash-emulator-different-ABR

RUN mkdir results

RUN pip install --no-cache-dir --upgrade pip 

RUN pip install . 

RUN pip install mininet

COPY ENTRYPOINT.sh /

# COPY Topology.py .

RUN chmod +x /ENTRYPOINT.sh

EXPOSE 80 1935 6633 6653 6640

ENTRYPOINT ["/ENTRYPOINT.sh"]