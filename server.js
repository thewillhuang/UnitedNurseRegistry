'use strict';
const koa = require('koa');
const port = process.env.PORT || 3000;
const send = require('koa-send');
const logger = require('koa-logger');
const etag = require('koa-etag');
// const compress = require('koa-compress');
const build = '/public';
const conditional = require('koa-conditional-get');
const path = require('path');
const app = koa();
const passport = require('koa-passport');
const koaBody = require('koa-better-body');
// const Router = require('koa-router');

// logging
app.use(logger());

// returns status code 304 if etag is the same
app.use(conditional());

// enable proxy through another server
// app.proxy = true;

// add etag for cacheing
app.use(etag());

// body json parsing
app.use(koaBody());

// routers
// let web = new Router();
//
// web.get('/', function *(){
//   let opts = { root: path.join(__dirname, build)};
//   yield send(this, 'index.html', opts);
// });
//
// app.use(web.routes()).use(web.allowedMethods());

// static file server
app.use(function *(){
  let opts = { root: path.join(__dirname, build)};
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  } else {
    yield send(this, this.path, opts);
  }
});

// compression
// app.use(compress());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(port);
console.log('server started on port:', port);
