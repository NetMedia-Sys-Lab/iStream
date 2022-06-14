FROM ubuntu:18.04
LABEL Author="Navid Akbari <anavid.akbari@gmail.com>"

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -q update && \
	apt-get -q install -y --no-install-recommends build-essential pkg-config g++ git scons cmake yasm ca-certificates zlib1g-dev && \
	apt-get -q install -y libfreetype6-dev libjpeg62-dev libpng-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libavdevice-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev libxvidcore-dev libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl2-dev dvb-apps mesa-utils


RUN git clone https://github.com/gpac/gpac.git gpac \
	&& cd gpac && ./configure \
	&& make -s && make -s install \
	&& cp bin/gcc/libgpac.so /usr/local/lib \
	&& cd .. && rm -rf gpac
