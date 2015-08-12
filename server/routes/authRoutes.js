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

  .get('/facebook/callback', function* (next) {
    const ctx = this;
    yield passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: false,
    }, function* (err, user, info) {
      console.log(info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
      } else {
        ctx.passport.user = user;
        const token = jwt.encryptSign(user);
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.redirect('/app');
      }
    }).call(this, next);
  })

  .post('/login', function*(next) {
    const ctx = this;
    yield passport.authenticate('local', { session: false }, function*(err, user, info) {
      console.log(info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
      } else {
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.redirect('/app');
      }
    }).call(this, next);
  })

  .post('/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('local-signup',  { session: false }, function*(err, user, info) {
      console.log(info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
      } else {
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.redirect('/app');
      }
    }).call(this, next);
  })

  .get('/logout', function*() {
    this.remove('Authorization');
    this.passport.user = null;
    this.redirect('/');
  });

  app.use(auth.routes())
    .use(auth.allowedMethods());
};
