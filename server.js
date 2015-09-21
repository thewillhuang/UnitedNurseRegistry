'use strict';

const koa = require('koa');
const app = module.exports = koa();
const port = process.env.PORT || 3000;
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
const serve = require('koa-static');
const send = require('koa-send');

// logging
app.use(logger());

// cacheing
app.use(conditional());
app.use(etag());

// proxy
app.proxy = true;

// security headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  scriptSrc: ['"self"', 'https://checkout.stripe.com'],
}));

// static file server
if (process.env.NODE_ENV === 'development') {
  console.log('server running in development mode');
  app.use(serve(buildPath));
} else {
  console.log('server running in production mode');
  app.use(staticCache(buildPath, {
    buffer: true,
    usePrecompiledGzip: true,
    gzip: true,
    dynamic: true,
  }));
}

app.use(function* apiCheck(next) {
  if (this.path.indexOf('socket.io') !== -1) {
    yield next;
  }
  this.path.indexOf('api') !== -1
  ? yield next
  : yield send(this, buildPath + '/index.html');
});

// set unsigned cookies as we are using a signed and encrypted jwt
// app.use(session({ signed: false }, app));

app.use(compress());
app.use(bodyParser());

// beta signup
require('./server/routes/beta')(app);

// load strategies and initialize passport
require('./server/services/auth');
app.use(passport.initialize());
// app.use(passport.session());

// Set bearer tokens for different auth strategies
require('./server/routes/authRoutes')(app);

// authorize any requests that has a valid bearer token
app.use(function* bearerAuthentication(next) {
  if (this.path.indexOf('socket.io') !== -1) {
    yield next;
  }
  const ctx = this;
  yield passport.authenticate('bearer', { session: false }, function* (err, user) {
    if (err) {
      console.log(err);
      ctx.status = 500;
    }
    if (user) {
      // const token = 'Bearer ' + jwt.encryptSign(user);
      // copy the token and send it right back
      const token = ctx.header.authorization;
      ctx.passport.user = user;
      ctx.set({ Authorization: token });
      yield next;
    } else {
      ctx.status = 401;
    }
  }).call(this, next);
});

app.use(function* ensureAuthenticated(next) {
  if (this.path.indexOf('socket.io') !== -1) {
    yield next;
  }
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
require('./server/routes/getHash')(app);
require('./server/routes/referral')(app);

// socket io for real time updates
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', function(socket) {
  socket.on('shift updated', function(data) {
    socket.emit('update shift', data);
  });
});

// start http server
server.listen(port);
console.log('http listening on port:', port);
