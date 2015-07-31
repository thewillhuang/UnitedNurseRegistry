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
const conditional = require('koa-conditional-get');
// const passport = require('koa-passport');

// enable proxy through another server
app.proxy = true;

// logging
app.use(logger());

// returns status code 304 if etag is the same
app.use(conditional());

// add etag for hash of request body
app.use(etag());

// static server
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

// body json parsing
app.use(koaBody());

// initialize passport
// app.use(passport.session());
// app.use(passport.initialize());

// unprotected routes

// is authed checker that ensures no unauthroized request can make it pass to secured routes

// secured routes
require('./server/routes/userRoutes')(app);
require('./server/routes/facilityRoutes')(app);

app.listen(port);
console.log('server listening on port:', port);
module.exports = app;
