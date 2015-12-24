import koa from 'koa';
import logger from 'koa-logger';
import etag from 'koa-etag';
import bodyParser from 'koa-bodyparser';
import conditional from 'koa-conditional-get';
import helmet from 'koa-helmet';
import passport from 'koa-passport';
import compress from 'koa-compress';
import staticCache from 'koa-static-cache';
import serve from 'koa-static';
const port = process.env.PORT || 3000;
const build = '/public';
const path = require('path');
const buildPath = path.join(__dirname, build);
const app = module.exports = koa();
const env = process.env.NODE_ENV;

// trust proxy headers
app.proxy = true;

if (env === 'development') {
  app.use(logger());
}

// cors that allows for subdomains
app.use(function* (next) {
  if (this.get('Origin') && this.get('Origin').indexOf('unitednurseregistry.com') !== -1) {
    this.set({
      'Access-Control-Allow-Origin': this.get('Origin'),
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Credentials': 'true',
    });
  }
  if (this.request.method === 'OPTIONS') {
    this.status = 204;
  } else {
    yield next;
  }
});

// cacheing
app.use(conditional());

// add etags to static files that exits
app.use(etag());

// security headers
app.use(helmet());

// compress everything before exiting
app.use(compress());

app.use(serve(buildPath), { defer: true });

// static file services
if (env === 'development') {
  console.log('server running in development mode');
} else {
  console.log('server running in production mode');
  // extra security for production
  app.use(helmet.contentSecurityPolicy({
    scriptSrc: [
      '\'self\'',
      'https://checkout.stripe.com',
      'http://cdn.raygun.io/raygun4js/raygun.min.js',
      '\'unsafe-inline\'',
      '\'unsafe-eval\'',
    ],
  }));
  // serve gzipped cached files for faster speed
  app.use(staticCache(buildPath, {
    buffer: true,
    usePrecompiledGzip: true,
    gzip: true,
    dynamic: true,
  }));
}

// parse body to json
app.use(bodyParser());

// beta signup
require('./server/routes/beta')(app);

// load passport strategies and initialize passport
require('./server/services/auth');
app.use(passport.initialize());

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
      ctx.body = err;
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
      ctx.body = { 'msg': 'failed bearer auth' };
      ctx.status = 401;
    }
  }).call(this, next);
});

// secured routes
require('./server/routes/userRoutes')(app);
require('./server/routes/facilityRoutes')(app);
require('./server/routes/shiftRoutes')(app);
require('./server/routes/getHash')(app);
require('./server/routes/referral')(app);
require('./server/routes/checkout')(app);

// socket io for real time updates
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', function (socket) {
  socket.on('update', function (data) {
    io.sockets.emit('updated', data);
  });
});

// start http server
server.listen(port);
console.log('http listening on port:', port);
