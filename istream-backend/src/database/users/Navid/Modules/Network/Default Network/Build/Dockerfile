FROM ubuntu:18.04

# ARG networkConfigName

RUN apt-get -qq update && apt-get install -qq -y --no-install-recommends \
    nginx \
    iperf \
    iproute2 \
    iptables \
    iputils-ping \
    python3.4 \
    python3-pip
    
RUN rm -rf /var/lib/apt/lists/* 

RUN pip3 install setuptools 
RUN pip3 install tcconfig

COPY nginx.conf /etc/nginx/nginx.conf

# COPY $networkConfigName .

# RUN chmod +x $networkConfigName

#RUN ./$networkConfigName

CMD ["nginx", "-g", "daemon off;"]
