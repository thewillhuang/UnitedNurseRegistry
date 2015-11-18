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
    match({ routes, location: this.path }, (error, redirectLocation, renderProps) => {
      if (error) {
        this.status = 500;
        this.body = error.message;
      } else if (redirectLocation) {
        this.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        this.body = renderToString(<RoutingContext {...renderProps} />);
      } else {
        this.status = 404;
        this.body = 'Not Found';
      }
    });
  });

  app.use(iso.routes())
    .use(iso.allowedMethods());
};
