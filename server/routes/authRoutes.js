'use strict';

const Router = require('koa-router');
const auth = new Router();
// const query = require('../services/query');
const passport = require('koa-passport');

module.exports = function authRoutes(app) {
  auth
  .post('/login',
    passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/',
    })
  );

  app.use(auth.routes())
    .use(auth.allowedMethods());
};
