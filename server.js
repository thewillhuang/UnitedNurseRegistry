'use strict';
const koa = require('koa');
const port = process.env.PORT || 3000;
const send = require('koa-send');
const logger = require('koa-logger');
const etag = require('koa-etag');
const compress = require('koa-compress');
const build = '/public';
const conditional = require('koa-conditional-get');
const path = require('path');
const app = koa();
const passport = require('koa-passport');
const Router = require('koa-router');
const koaBody = require('koa-better-body');

// logging
app.use(logger());

// body json parsing
app.use(koaBody());

// enable proxy through another server
app.proxy = true;

// returns status code 304 if etag is the same
app.use(conditional());

// add etag for cacheing
app.use(etag());

// routers
let web = new Router();

web.get('/', function *(){
  let opts = { root: path.join(__dirname, build)};
  yield send(this, 'index.html', opts);
});

app.use(web.routes()).use(web.allowedMethods());

// static file server
app.use(function *(){
  let opts = { root: path.join(__dirname, build)};
  yield send(this, this.path, opts);
});

// compression
app.use(compress());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(port);
console.log('server started on port:', port);
