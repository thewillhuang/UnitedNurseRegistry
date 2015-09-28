############################################################
# Dockerfile to build NODE and Git container images
# Based on Ubuntu
############################################################

# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER thewillhuang

# install dependencies
RUN apt-get update && apt-get install -y \
      build-essential \
      python \
      curl \
      git;

#enable sourcing in docker
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

#install node and set node env variables for less typing
ENV NVM_DIR /usr/local/nvm

# install node
ENV NODE_VERSION v4.1.1
ENV NODE_BRANCH node/v4.1.1
# ENV NODE_VERSION 2.5.0
# ENV NODE_BRANCH io.js/v2.5.0

# Install nvm and use node version defined above.
RUN git clone https://github.com/creationix/nvm.git $NVM_DIR && cd $NVM_DIR && git checkout `git describe --abbrev=0 --tags`
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    # && nvm alias default $NODE_VERSION \
    # && nvm use default \

#Set npm and node paths to allow running npm and node executables
ENV NODE_PATH $NVM_DIR/versions/$NODE_BRANCH/lib/node_modules
ENV PATH      $NVM_DIR/versions/$NODE_BRANCH/bin:$PATH

# forever for running node apps as daemons and automatically restarting on crashes
# gulp, grunt-cli, bower typical front-end stuff
RUN npm install -g forever gulp grunt-cli bower mocha

#set WORKDIR, PORT and set Port
WORKDIR /app
ENV PORT 8080
EXPOSE $PORT

# cache setup files and run faster.
#alternatively, you may clone the repo, install it, and upon running the image, git pull updates and install
RUN git clone https://7a7f0d9da87f1f218c309dcb903378776923d801:x-oauth-basic@github.com/thewillhuang/UnitedNurseRegistry.git /app

# add current directory from the host matching to docker WORKDIR
#   s  dest
# ADD . ./


# make user and set /src as project folder with only user privelages. *running as root will make bower and npm go nuts*
RUN /usr/sbin/useradd --create-home --home-dir /usr/local/nonroot --shell /bin/bash nonroot
RUN chown -R nonroot /app
USER nonroot
ENV HOME /usr/local/nonroot

# install the files to cache them.
RUN npm install \
    && npm run production;

# runs below command in WORKDIR when the images is ran.
# CMD npm install

# Alternative method
# when the image is run, docker will pull from github, and install, using cached files, should be much faster then rebuilding from scrach each time.
CMD git pull https://7a7f0d9da87f1f218c309dcb903378776923d801:x-oauth-basic@github.com/thewillhuang/UnitedNurseRegistry.git \
    && npm install \
    && npm run production \
    && forever server \
    # && npm run test;
