'use strict';
const koa = require('koa');
const port = process.env.PORT || 3000;
const send = require('koa-send');
const logger = require('koa-logger');
const json = require('koa-json');
const etag = require('koa-etag');
const compress = require('koa-compress');
const build = '/public';
const conditional = require('koa-conditional-get');
const path = require('path');
// const router = require('koa-router');
const app = koa();

// logging
app.use(logger());

// returns status code 304 if etag is the same
app.use(conditional());

// add etag for cacheing
app.use(etag());

//prettyify json
app.use(json());

// static file server
app.use(function *(){
  let opts = { root: path.join(__dirname, build)};
  // serve index.html when the path is '/'
  if (this.path === '/') {yield send(this, 'index.html', opts); }
  // else send other requested files
  yield send(this, this.path, opts);
});

// lastly, compress if not compressed
app.use(compress());

app.listen(port);
console.log('server started on port:', port);
