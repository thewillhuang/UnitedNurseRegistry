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
const app = koa();

app.use(logger());
app.use(conditional());
app.use(etag());
app.use(json());
app.use(function *(){
  const opts = {
    root: path.join(__dirname, build),
    gzip: true
  };
  if (this.path === '/') {
    yield send(this, 'index.html', opts);
  }
  yield send(this, this.path, opts);
});
app.use(compress());

app.listen(port);
console.log('server started on port:', port);
