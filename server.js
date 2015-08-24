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
const buildPath = path.join(__dirname, build);
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get');
const helmet = require('koa-helmet');
const passport = require('koa-passport');
const compress = require('koa-compress');
const staticCache = require('koa-static-cache');
// const jwt = require('./server/services/jwt');
// const session = require('koa-session');

// logging
app.use(logger());

// cacheing
app.use(conditional());
app.use(etag());

// proxy
app.proxy = true;

// security headers
app.use(helmet());
app.use(helmet.noCache());

// static file server
app.use(staticCache(buildPath, {
  buffer: true,
  usePrecompiledGzip: true,
  gzip: true,
}));

app.use(function* apiCheck(next) {
  this.path.indexOf('api') !== -1
  ? yield next
  : yield send(this, buildPath + '/index.html');
});

// set unsigned cookies as we are using a signed and encrypted jwt
// app.use(session({ signed: false }, app));

app.use(compress());
app.use(bodyParser());

// load strategies and initialize passport
require('./server/services/auth');
app.use(passport.initialize());
// app.use(passport.session());

// Set bearer tokens for different auth strategies
require('./server/routes/authRoutes')(app);

// authorize any requests that has a valid bearer token
app.use(function* bearerAuthentication(next) {
  const ctx = this;
  yield passport.authenticate('bearer', { session: false }, function* (err, user) {
    if (err) {throw new Error(err); }
    if (user) {
      // const token = 'Bearer ' + jwt.encryptSign(user);
      // copy the token and send it right back
      const token = ctx.header.authorization;
      ctx.passport.user = user;
      ctx.set({ Authorization: token });
    }
    yield next;
  }).call(this, next);
});

app.use(function* ensureAuthenticated(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
    this.body = {message: 'Invalid Authorization'};
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
