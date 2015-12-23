'use strict';

const Router = require('koa-router');
const auth = new Router();
const passport = require('koa-passport');
const jwt = require('../services/jwt');
const prefix = '/api/auth';

module.exports = function authRoutes(app) {
  auth.get(`${prefix}/facebook`,
    passport.authenticate('facebook')
  );

  auth.get(`${prefix}/facebook/callback`, function* (next) {
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

  auth.get(`${prefix}/stripe`,
    passport.authenticate('stripe')
  );

  auth.get(`${prefix}/stripe/callback`, function* (next) {
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

  auth.post(`${prefix}/login`, function*(next) {
    console.log('login called');
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

  auth.post(`${prefix}/facility/login`, function*(next) {
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

  auth.post(`${prefix}/facility/signup`, function*(next) {
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

  auth.post(`${prefix}/signup`, function*(next) {
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

  app.use(auth.routes());
  app.use(auth.allowedMethods());
};
