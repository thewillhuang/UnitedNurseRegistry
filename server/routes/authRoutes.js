'use strict';

const Router = require('koa-router');
const auth = new Router({
  prefix: '/api/auth',
});
const passport = require('koa-passport');
const jwt = require('../services/jwt');

module.exports = function authRoutes(app) {
  auth

  .get('/facebook',
    passport.authenticate('facebook')
  )

  .get('/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/app',
      failureRedirect: '/',
    })
  )

  .post('/login', function*(next) {
    const ctx = this;
    yield passport.authenticate('local', { session: false }, function*(err, user, info) {
      console.log('err', err, 'user', user, 'info', info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
      } else {
        // yield ctx.login(user);
        ctx.passport.user = user;
        ctx.set({
          Authorization: 'Bearer ' + jwt.encryptSign(user),
        });
      }
      ctx.body = info;
    }).call(this, next);
    console.log('this', this);
    console.log('this.isAuthenticated', this.isAuthenticated());
    console.log('this.passport', this.passport);
  })

  .post('/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('local-signup',  { session: false }, function*(err, user, info) {
      console.log('err', err, 'user', user, 'info', info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
      } else {
        ctx.passport.user = user;
        ctx.set({
          Authorization: 'Bearer ' + jwt.encryptSign(user),
        });
      }
      ctx.body = info;
    }).call(this, next);
    console.log('this', this);
    console.log('this.isAuthenticated', this.isAuthenticated());
    console.log('this.passport', this.passport);
  })

  .get('/logout', function*() {
    this.remove('Authorization');
    this.passport.user = null;
    this.redirect('/');
  });

  app.use(auth.routes())
    .use(auth.allowedMethods());
};
