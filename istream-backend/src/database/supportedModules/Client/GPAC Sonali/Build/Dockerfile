FROM ubuntu:18.04
LABEL Author="Navid Akbari <anavid.akbari@gmail.com>"

RUN apt-get -q update && \
    apt-get -q install -y --no-install-recommends build-essential git libpcre3-dev libssl-dev zlib1g-dev gcc make ca-certificates

RUN git clone https://github.com/gpac/gpac.git gpac \
    && git clone https://github.com/gpac/deps_unix \
    && cd deps_unix && git submodule update --init --recursive --force --checkout \
    && ./build_all.sh linux \
    && cd ../gpac && ./configure \
    && make -s && make -s install