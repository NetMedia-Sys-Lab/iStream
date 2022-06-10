FROM ubuntu:18.04
LABEL Author="Navid Akbari <anavid.akbari@gmail.com>"

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -q update && \
	apt-get -q install -y --no-install-recommends build-essential git libpcre3-dev libssl-dev zlib1g-dev gcc make ca-certificates

RUN git clone https://github.com/gpac/gpac.git gpac \
	&& cd gpac && ./configure \
	&& make -s && make -s install \
	&& cp bin/gcc/libgpac.so /usr/local/lib \
	&& cd .. && rm -rf gpac
