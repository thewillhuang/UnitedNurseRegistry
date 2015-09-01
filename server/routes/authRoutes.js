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
        ctx.body = {message: user};
      }
    }).call(this, next);
  })

  .post('/login', function*(next) {
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
        ctx.body = {message: user};
      }
    }).call(this, next);
  })

  .post('/facility/login', function*(next) {
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
        ctx.body = {message: user};
      }
    }).call(this, next);
  })

  .post('/facility/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('facility-signup',  { session: false }, function*(err, user, info) {
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
        ctx.body = {message: user};
      }
    }).call(this, next);
  })

  // beta signup
  .post('/beta/signup', function* createUser() {
    const requestJson = this.request.body;
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['betaUser', requestJson];
    this.body = yield query(q);
  })

  // get all beta users
  .get('/beta/users', function* getAllBetaUser() {
    const q = {};
    q.sql = 'SELECT * FROM ??';
    q.values = ['betaUser'];
    this.body = yield query(q);
  })

  .post('/signup', function*(next) {
    const ctx = this;
    yield passport.authenticate('local-signup',  { session: false }, function*(err, user, info) {
      if (err) console.log('error', err);
      if (!user) {
        ctx.status = 406;
        ctx.body = info;
      } else {
        ctx.status = 200;
        const token = jwt.encryptSign(user);
        ctx.passport.user = user;
        ctx.set({ Authorization: 'Bearer ' + token });
        ctx.body = {message: user};
      }
    }).call(this, next);
  });

  // .get('/logout', function*() {
  //   this.remove('Authorization');
  //   this.passport.user = null;
  //   this.redirect('/');
  //   this.body = {message: 'successfully logged out'};
  // });

  app.use(auth.routes())
    .use(auth.allowedMethods());
};
