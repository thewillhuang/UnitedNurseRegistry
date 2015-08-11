'use strict';

const Router = require('koa-router');
const auth = new Router({
  prefix: '/api/auth',
});
const passport = require('koa-passport');

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

  .post('/', function*(next) {
    const ctx = this;
    yield passport.authenticate('local', function*(err, user, info) {
      console.log('err', err, 'user', user, 'info', info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false };
      } else {
        yield ctx.login(user);
        ctx.body = { success: true };
      }
    }).call(this, next);
    console.log('this', this);
    console.log('session', this.session);
  })

  .post('/signup2', function*(next) {
    const ctx = this;
    yield passport.authenticate('local-signup', function*(err, user, info) {
      console.log('err', err, 'user', user, 'info', info);
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false };
      } else {
        yield ctx.login(user);
        ctx.body = { success: true };
      }
    }).call(this, next);
    console.log('this', this);
    console.log('session', this.session);
  })

  .post('/login/',
    passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/',
      // failureFlash: true,
    })
  )

  .post('/signup/',
    passport.authenticate('local-signup', {
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
