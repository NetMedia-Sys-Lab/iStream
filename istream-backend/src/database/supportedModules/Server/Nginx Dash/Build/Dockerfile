FROM ubuntu:18.04
LABEL Author="Navid Akbari <anavid.akbari@gmail.com>"
LABEL Version="0.1"
LABEL Description="This is custom Docker Image for running a dash server."

ARG DEBIAN_FRONTEND=noninteractive
# ARG transcoderConfigName

RUN apt-get -q update && \
	apt-get -q install -y --no-install-recommends build-essential git libpcre3-dev libssl-dev zlib1g-dev gcc make ca-certificates ffmpeg

RUN mkdir -p /tmp/build
RUN cd /tmp/build \
	&& git clone https://github.com/nginx/nginx.git \
	&& git clone https://github.com/arut/nginx-rtmp-module.git \
	&& cd nginx && ./auto/configure --add-module=../nginx-rtmp-module \
	&& make -s && make -s install


RUN git clone https://github.com/gpac/gpac.git gpac \
	&& cd gpac && ./configure --disable-opengl --use-js=no --use-ft=no --use-jpeg=no --use-png=no --use-faad=no --use-mad=no --use-xvid=no --use-ffmpeg=no --use-ogg=no --use-vorbis=no --use-theora=no --use-openjpeg=no \
	&& make -s && make -s install \
	&& cp bin/gcc/libgpac.so /usr/local/lib \
	&& cd .. && rm -rf gpac

RUN cd /usr/local/nginx/conf && \
	rm nginx.conf

COPY Build/nginx.conf /usr/local/nginx/conf

COPY Config/config.sh /usr/local/nginx/html

# RUN chmod +x /usr/local/nginx/html/$transcoderConfigName

# RUN sudo ./usr/local/nginx/sbin/nginx -s reload

# COPY Build/*.mp4 /usr/local/nginx/html/

CMD ["./usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
