'use strict';
const koa = require('koa');
const port = process.env.PORT || 3000;
const send = require('koa-send');
const logger = require('koa-logger');
const etag = require('koa-etag');
const build = '/public';
const path = require('path');
const app = koa();
const koaBody = require('koa-better-body');
const compression = require('koa-compress');
const conditional = require('koa-conditional-get');
// const passport = require('koa-passport');

// logging
app.use(logger());

// returns status code 304 if etag is the same
app.use(conditional());

// add etag for cacheing static files
app.use(etag());

// enable proxy through another server
app.proxy = true;

// body json parsing
app.use(koaBody());

// compression
app.use(compression());

// use static server
app.use(function* staticServer(next) {
  let opts = { root: path.join(__dirname, build) };
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  } else if (~this.path.indexOf('api')){
    yield next;
  } else {
    yield send(this, this.path, opts);
  }
});

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// unprotected routes

// is authed checker

// secured routes
require('./server/routes/userRoutes')(app);

app.listen(port);
console.log('server listening on port:', port);
module.exports = app;
