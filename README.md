![Build Status][logo]
[logo]: https://api.shippable.com/projects/55a6ef89edd7f2c05270ba75/badge/master
# United Nurse Registery
the last registery to rule them all.

##### install
```sh
npm install
```

##### run development build
```sh
gulp
```

##### run production build
```sh
gulp prod
node server
```

#### auto restart gulp
use gulper, it is nodemon but for gulp, it replaces gulp and gives you a restart ability by watching your gulp task changes.
```sh
npm i -g gulper
gulper prod
gulper
```

run below bash script.
```bash
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)
```

### docker commands, good to know
view all currently running docker containers on a system
```bash
docker ps
```

view all docker containers on a system, even the ones thats not running
```bash
docker ps -a
```

remove docker containers
```bash
docker rm <container id>
```

view all images
```bash
docker images
```

remove docker images
```bash
docker rmi <image id>
```

initial docker run in interactive and tail mode. this must be ran where Dockerfile is located on your host system.
```bash
docker build -t "build" . && docker run -p 3000:8080 -i -t build
```

docker run in interactive and detached, background mode
```bash
docker build -t "build" . && docker run -p 3000:8080 -i -d build
```

view docker in its detached mode
```bash
docker logs <container id>
```

subsequent docker run, stops docker containers and removes docker containers, rebuild and funnel a private docker port of 8080 to host machine 3000. for macs, the ip can be found with $boot2docker ip
```bash
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker rmi build && docker build -t "build" . && docker run -p 3000:8080 -i -d build
```

copy src folder from container to host machine
```bash
docker cp <containerId>:/file/path/within/container /host/path/target
```
