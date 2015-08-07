'use strict';
const koa = require('koa');
const app = module.exports = koa();
const port = process.env.PORT || 3000;
const port2 = process.env.PORT2 || 3001;
const send = require('koa-send');
const logger = require('koa-logger');
const etag = require('koa-etag');
const build = '/public';
const path = require('path');
const koaBody = require('koa-better-body');
const conditional = require('koa-conditional-get');
const helmet = require('koa-helmet');
// const passport = require('koa-passport');

// logging
app.use(logger());

// enable proxy through another server
app.proxy = true;

// use helmet
app.use(helmet());

// returns status code 304 if etag is the same
app.use(conditional());

// add etag for hash of request body
app.use(etag());

// static server
app.use(function* staticServer(next) {
  const opts = { root: path.join(__dirname, build) };
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  } else if (~this.path.indexOf('api')) {
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
require('./server/routes/shiftRoutes')(app);

// start http and https servers
app.listen(port);
console.log('http listening on port:', port);
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('unr-key.pem'),
  cert: fs.readFileSync('unr-cert.pem'),
  dhparam: fs.readFileSync('dhparam.pem'),
};
https.createServer(options, app.callback()).listen(port2);
console.log('https listening on port:', port2);
