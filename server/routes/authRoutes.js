'use strict';

const Router = require('koa-router');
const auth = new Router({
  prefix: '/api/auth',
});
const passport = require('koa-passport');
const jwt = require('../services/jwt');

module.exports = function authRoutes(app) {
  app.use(auth.routes());
  app.use(auth.allowedMethods());

  auth.get('/facebook',
    passport.authenticate('facebook')
  );

  auth.get('/facebook/callback', function* (next) {
    const ctx = this;
    yield passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: false,
      authType: 'rerequest',
    }, function* (err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        ctx.passport.user = user;
        const token = jwt.encryptSign(user);
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });

  auth.get('/stripe',
    passport.authenticate('stripe')
  );

  auth.get('/stripe/callback', function* (next) {
    const ctx = this;
    yield passport.authenticate('stripe', {
      failureRedirect: '/login',
      session: false,
      scope: 'read_write',
    }, function* (err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        ctx.passport.user = user;
        const token = jwt.encryptSign(user);
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });

  auth.post('/login', function*(next) {
    const ctx = this;
    yield passport.authenticate('local', { session: false }, function*(err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });

  auth.post('/facility/login', function*(next) {
    const ctx = this;
    yield passport.authenticate('facility-login', { session: false }, function*(err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });

  auth.post('/facility/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('facility-signup', { session: false }, function*(err, user, info) {
      // console.log('user', user, 'info', info);
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });

  auth.post('/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('local-signup', { session: false }, function*(err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = { message: user };
      }
    }).call(this, next);
  });
};
