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
// const passport = require('koa-passport');

// logging
app.use(logger());

// returns status code 304 if etag is the same
const conditional = require('koa-conditional-get');
app.use(conditional());

// enable proxy through another server
app.proxy = true;

// body json parsing
app.use(koaBody());

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// unprotected routes

// protected routes
require('./server/routes/userRoutes.js')(app);

// add etag for cacheing static files
app.use(etag());

// static file server
app.use(function* () {
  let opts = { root: path.join(__dirname, build) };
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  } else {
    yield send(this, this.path, opts);
  }
});

app.listen(port);
console.log('server listening on port:', port);
