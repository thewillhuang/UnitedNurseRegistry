'use strict';
const Router = require('koa-router');
import { renderToStaticMarkup } from 'react-dom/server';
const serverRender = new Router();
import { match, RoutingContext } from 'react-router';
import routes from '../src/javascripts/routes';
import React from 'react';
import etag from 'etag';

const cache = {};
const serveCachedHtml = (ctx, path, agent, renderProps) => {
  if (cache[agent]) {
    if (cache[agent][path].body) {
      ctx.set('ETag', cache[agent][path].etag);
      return cache[agent][path].body;
    }
  }
  global.navigator = { userAgent: agent };
  cache[agent] = {};
  cache[agent][path] = {};
  cache[agent][path].body = renderToStaticMarkup(
    <html lang='en'>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <title>United Nurse Registery</title>
      <link rel='stylesheet' href='/stylesheets/home.css' />
      <link rel='shortcut icon' type='image/x-icon' href='/images/favicon.ico' />
    </head>
    <body>
      <div id='root'>
        <RoutingContext {...renderProps} />
      </div>
      <script src='/javascripts/index.js' async />
      <script src='https://checkout.stripe.com/checkout.js' async />
    </body>
    </html>
  );
  cache[agent][path].etag = etag(cache[agent][path].body);
  ctx.set('ETag', cache[agent][path].etag);
  ctx.type = 'html';
  return cache[agent][path].body;
};

module.exports = function reactRender(app) {
  serverRender.get('/', function* render() {
    match({ routes, location: this.path }, (error, redirectLocation, renderProps) => {
      if (error) {
        this.status = 500;
        this.body = error.message;
      } else if (redirectLocation) {
        this.redirect(redirectLocation.pathname + redirectLocation.search);
      } else {
        const userAgent = this.request.headers['user-agent'];
        this.body = serveCachedHtml(this, this.path, userAgent, renderProps);
      }
    });
  });

  app.use(serverRender.routes())
    .use(serverRender.allowedMethods());
};
