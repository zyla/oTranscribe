FROM ubuntu:focal

# Convenience
RUN apt-get update \
  && apt-get -y install vim sudo \
     supervisor wget vim less libcap2-bin locales \
  && sudo ln -s /usr/bin/supervisorctl /usr/local/bin/sv \
  && rm -rf /var/cache/apt/*

RUN useradd -m -u 1000 -G sudo user
RUN echo "user ALL=NOPASSWD: ALL" > /etc/sudoers.d/60-user


RUN    cd /tmp \
    && wget https://nodejs.org/dist/v12.16.2/node-v12.16.2-linux-x64.tar.xz \
    && tar xf node-v12.16.2-linux-x64.tar.xz \
    && sudo cp -r node-v12.16.2-linux-x64/* /usr/local/ \
    && rm node-v12.16.2-linux-x64.tar.xz

RUN    mkdir /opt/npm \
    && cd /opt/npm \
    && npm -q install npm@6.14.4 \
    && sudo ln -sf `pwd`/node_modules/.bin/npm /usr/local/bin

RUN    echo "PATH=$PATH" \
    && which node \
    && node --version \
    && npm --version

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
ENV LC_ALL en_US.UTF-8

RUN apt-get update \
  && apt-get -y install dumb-init git make \
  && rm -rf /var/cache/apt/*

RUN apt-get update \
  && apt-get -y install python build-essential \
  && rm -rf /var/cache/apt/*

RUN useradd -m -u 1001 -G sudo user2
USER user2

RUN echo 'set -o vi' >> ~/.bashrc
RUN mkdir ~/.cache
RUN mkdir ~/.npm
