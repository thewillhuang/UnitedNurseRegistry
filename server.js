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

// compression
app.use(compression());

// initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// unprotected routes

// protected routes
require('./server/routes/userRoutes')(app);
// require('./server/routes/user')(app);
// require('./server/routes/userAddress')(app);
// require('./server/routes/userEmail')(app);
// require('./server/routes/userLicense')(app);
// require('./server/routes/userPhone')(app);
// require('./server/routes/userSchedule')(app);
// require('./server/routes/userSpecialty')(app);
// require('./server/routes/userWorkHistory')(app);

// static file server
var staticServer = function* () {
  let opts = { root: path.join(__dirname, build) };
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  } else {
    yield send(this, this.path, opts);
  }
};

// add etag for cacheing static files
app.use(etag());

// use static server
app.use(staticServer);

app.listen(port);
console.log('server listening on port:', port);
