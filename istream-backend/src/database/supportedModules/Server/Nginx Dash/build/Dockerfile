FROM ubuntu:18.04
LABEL Author="Navid Akbari <anavid.akbari@gmail.com>"
LABEL Version="0.1"
LABEL Description="This is custom Docker Image for running a dash server."

ARG DEBIAN_FRONTEND=noninteractive
ARG transcoderConfigName

RUN apt-get -qq update && \
	apt-get -qq install -y build-essential git libpcre3-dev libssl-dev zlib1g-dev

RUN mkdir -p /tmp/build
RUN cd /tmp/build && \
	git clone https://github.com/nginx/nginx.git && \
	git clone https://github.com/arut/nginx-rtmp-module.git && \
	cd nginx && \
	./auto/configure --add-module=../nginx-rtmp-module && \
	make && \
	make install

RUN cd /usr/local/nginx/conf && \
    rm nginx.conf

COPY nginx.conf /usr/local/nginx/conf

# COPY $transcoderConfigName /usr/local/nginx/html/

# RUN chmod +x /usr/local/nginx/html/$transcoderConfigName

# RUN sudo ./usr/local/nginx/sbin/nginx -s reload

# COPY *.mp4 /usr/local/nginx/html/

RUN apt-get install -y ffmpeg

CMD ["./usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
