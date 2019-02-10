FROM ubuntu:18.04

MAINTAINER  Fraunhofer IAIS , https://vocol.iais.fraunhofer.de

# Install JAVA 8
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y  software-properties-common && \
    add-apt-repository ppa:webupd8team/java -y && \
    apt-get update && \
    echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections && \
    apt-get install -y oracle-java8-installer && \
    apt-get clean



# Install Nodejs , git
RUN  apt-get update -yq \
    && apt-get install curl gnupg git -yq \
    && curl -sL https://deb.nodesource.com/setup_11.x  | bash \
    && apt-get install nodejs -yq

# Build application
RUN mkdir /home/project
WORKDIR /home/project
RUN git clone  https://github.com/vocol/vocol.git \
&&  chmod u+x  .
WORKDIR /home/project/vocol
RUN npm install

EXPOSE 3000
EXPOSE 3030

ENV PORT=3000
CMD [ "npm", "start","3000","3030"]























