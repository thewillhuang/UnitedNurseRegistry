'use strict';
const Router = require('koa-router');
import { renderToStaticMarkup } from 'react-dom/server';
const serverRender = new Router();
import { match, RoutingContext } from 'react-router';
import routes from '../src/javascripts/routes';
import React from 'react';

module.exports = function reactRender(app) {
  serverRender
  // get iso
  .get('/', function* render() {
    global.navigator = {
      userAgent: this.request.headers['user-agent'],
    };
    match({ routes, location: this.path }, (error, redirectLocation, renderProps) => {
      if (error) {
        this.status = 500;
        this.body = error.message;
      } else if (redirectLocation) {
        this.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        this.body = renderToStaticMarkup(
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
            <script src='/javascripts/index.js' charSet='utf-8' async />
            <script src='https://checkout.stripe.com/checkout.js' async />
          </body>
          </html>
        );
      } else {
        this.status = 404;
        this.body = 'Not Found';
      }
    });
  });

  app.use(serverRender.routes())
    .use(serverRender.allowedMethods());
};
