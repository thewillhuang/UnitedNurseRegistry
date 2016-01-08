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

# node specific
# install node and set node env variables for less typing
ENV NVM_DIR /usr/local/nvm

# install node
ENV NODE_VERSION v${NODE_VERSION}
ENV NODE_BRANCH node/v${NODE_VERSION}


# Install nvm and use node version defined above.
RUN git clone https://github.com/creationix/nvm.git $NVM_DIR && cd $NVM_DIR && git checkout `git describe --abbrev=0 --tags`
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \

#Set npm and node paths to allow running npm and node executables
ENV NODE_PATH $NVM_DIR/versions/$NODE_BRANCH/lib/node_modules
ENV PATH      $NVM_DIR/versions/$NODE_BRANCH/bin:$PATH

# set WORKDIR, PORT and set Port
WORKDIR /app
ENV PORT 8080
EXPOSE $PORT

ENV GITHUB_OAUTH ${GITHUB_OAUTH}
RUN git clone https://$GITHUB_OAUTH:x-oauth-basic@github.com/thewillhuang/UnitedNurseRegistry.git /app

# make user and set /app as project folder with only user privelages. *running as root will make bower and npm go nuts*
RUN /usr/sbin/useradd --create-home --home-dir /usr/local/nonroot --shell /bin/bash nonroot
RUN chown -R nonroot /app
USER nonroot
ENV HOME /usr/local/nonroot

# install the files to cache them.
RUN npm install;

# # run the server when docker image is ran.
# CMD ["node", "index"]
