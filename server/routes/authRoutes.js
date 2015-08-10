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
    console.log(this.session);
    console.log(this.passport);
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
    console.log(this.passport);
    console.log(this.isAuthenticated());
  })

  .post('/login/',
    passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/',
      // failureFlash: true,
    })
  )

  .get('/logout', function*() {
    this.logout();
    this.redirect('/');
  });

  app.use(auth.routes())
    .use(auth.allowedMethods());
};
