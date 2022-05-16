FROM ubuntu:18.04

ARG networkConfigName

RUN apt-get -qq update && \
    apt-get -qq install -y nginx

COPY nginx.conf /etc/nginx/nginx.conf

# COPY $networkConfigName .

# RUN chmod +x $networkConfigName

#RUN ./$networkConfigName

CMD ["nginx", "-g", "daemon off;"]
