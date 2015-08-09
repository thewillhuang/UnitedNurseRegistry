'use strict';

const Router = require('koa-router');
const auth = new Router({
  prefix: '/api/auth',
});
// const query = require('../services/query');
const passport = require('koa-passport');

module.exports = function authRoutes(app) {
  console.log('auth routes loaded');
  auth

  .post('/', function*(next) {
    console.log(this);
    console.log(this.req.body);
    // this.request.body = this.request.fields;
    const ctx = this;
    yield passport.authenticate('local', function*(err, user, info) {
      console.log(err, user, info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false };
      } else {
        yield ctx.login(user);
        ctx.body = { success: true };
      }
    }).call(this, next);
  })

  .post('/login/',
    passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/',
      // failureFlash: true,
    })
  );

  app.use(auth.routes())
    .use(auth.allowedMethods())
      .use(auth.middleware());
};
