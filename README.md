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
npm run development
```

##### run production build
```sh
npm run production
node server
```

#### auto restart gulp
```sh
npm i -g gulper
gulper
```

### ec2 pull new image, stop current container, clean and start a new one
#### install docker
```sh
sudo yum update -y && sudo yum install -y docker && sudo service docker start && sudo usermod -a -G docker ec2-user
```
#### load server
```sh
sudo yum update -y && docker pull thewillhuang/unitednurseregistry && docker rm --force `docker ps -qa` && docker rmi $(docker images -q --filter "dangling=true") && docker run --restart=always -d -p 80:8080 thewillhuang/unitednurseregistry && exit
```
