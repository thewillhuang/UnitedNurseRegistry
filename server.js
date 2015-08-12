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
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get');
const helmet = require('koa-helmet');
const passport = require('koa-passport');
// const session = require('koa-session');

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

// set unsigned cookies as we are using a signed and encrypted jwt
// app.use(session({ signed: false }, app));

app.use(bodyParser());

// load strategies and initialize passport
require('./server/services/auth');
app.use(passport.initialize());
// app.use(passport.session());

// auth routes to set bearer tokens for different strategies
require('./server/routes/authRoutes')(app);

// authorize routes that has valid bearer tokens
app.use(function* bearerAuthentication(next) {
  const ctx = this;
  yield passport.authenticate('bearer', { session: false }, function* (err, user) {
    if (err) {throw new Error(err); }
    if (user) {
      ctx.passport.user = user;
    }
    yield next;
  }).call(this, next);
});

// ensure all api calls are authenticated pass this middleware or redirected.
app.use(function* ensureAuthenticated(next) {
  console.log('isAuthenticated', this.isAuthenticated());
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/login');
  }
});

// secured routes
require('./server/routes/userRoutes')(app);
require('./server/routes/facilityRoutes')(app);
require('./server/routes/shiftRoutes')(app);

// start http server
app.listen(port);
console.log('http listening on port:', port);

// start https server
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('unr-key.pem'),
  cert: fs.readFileSync('unr-cert.pem'),
};
https.createServer(options, app.callback()).listen(port2);
console.log('https listening on port:', port2);
