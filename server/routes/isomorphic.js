'use strict';
const Router = require('koa-router');
import { renderToString } from 'react-dom/server';
const iso = new Router();
import { match, RoutingContext } from 'react-router';
import routes from '../../src/javascripts/routes';
import React from 'react';

module.exports = function reactRender(app) {
  iso
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
        this.body = renderToString(
          <html lang='en'>
          <head>
            <meta charSet='UTF-8' />
            <title>United Nurse Registery</title>
          </head>
          <body>
            <div id='root'>
              <RoutingContext {...renderProps} />
            </div>
            <script src='./javascripts/index.js' charSet='utf-8' async />
            <script src='https://checkout.stripe.com/checkout.js' async />
            <link rel='stylesheet' href='/stylesheets/app.css' />
            <link rel='shortcut icon' type='image/x-icon' href='/images/favicon.ico' />
          </body>
          </html>
        );
      } else {
        this.status = 404;
        this.body = 'Not Found';
      }
    });
  });

  app.use(iso.routes())
    .use(iso.allowedMethods());
};
