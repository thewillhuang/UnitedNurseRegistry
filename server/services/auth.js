'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const query = require('./query');
const validatePw = require('./validatePassword');
const genHash = require('./genHash');
const jwt = require('./jwt');
// const pool = require('./pool');


// custom error functions
function NoUserError(message) {
  this.message = message;
  this.name = 'NoUserError';
  Error.captureStackTrace(this, NoUserError);
}
NoUserError.prototype = Object.create(Error.prototype);
NoUserError.prototype.constructor = NoUserError;

function EmailTaken(message) {
  this.message = message;
  this.name = 'EmailTaken';
  Error.captureStackTrace(this, EmailTaken);
}
EmailTaken.prototype = Object.create(Error.prototype);
EmailTaken.prototype.constructor = EmailTaken;

passport.serializeUser(function(user, done) {
  done(null, jwt.encryptSign(user));
});

passport.deserializeUser(function(token, done) {
  done(null, jwt.verifyDecrypt(token));
});

// promise version
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
  function(req, email, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      console.log('result from query', result);
      if (result.rows.length === 0) { throw new NoUserError('no such user found'); }
      return validatePw(password, result.rows[0].userPwHash);
    }).then(function(isMatch) {
      console.log('isMatch', isMatch);
      return !isMatch ?
        this.done = [false, {message: 'incorrect password'}] :
        this.done = [{email: email}, {message: 'Auth Success'}];
    }).catch(NoUserError, function(error) {
      console.log('custom error', error);
      this.done = [false, {message: 'incorrect email'}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
  function(req, email, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      if (result.rows.length !== 0) {
        throw new EmailTaken('email taken');
      }
      return genHash(password);
    }).then(function(pwhash) {
      console.log('pwhash', pwhash);
      const q2 = {};
      const userData = {};
      userData.email = email;
      userData.userPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['user', userData];
      return query(q2);
    }).then(function(result) {
      console.log('local-signup insert result', result);
      this.done = [{email: email}, {message: 'Registeration successful'}];
    }).catch(EmailTaken, function() {
      this.done = [false, {message: 'email taken'}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));


passport.use(new FacebookStrategy({
  auth_Type: 'rerequest',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
  scope: ['email'],
  clientID: '881519185218872',
  clientSecret: 'ec4d29399a523f123cf079c3d66e29c6',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/api/auth/facebook/callback',
  passReqToCallback: true,
},
  function(req, token, refreshToken, profile, done) {
    console.log('req', req);
    console.log('token', token);
    console.log('refereshToken', refreshToken);
    console.log('profile', profile);
    // retrieve user ...
    done(null, user);
  }
));

// const TwitterStrategy = require('passport-twitter').Strategy
// passport.use(new TwitterStrategy({
//     consumerKey: 'your-consumer-key',
//     consumerSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))

// const GoogleStrategy = require('passport-google-auth').Strategy
// passport.use(new GoogleStrategy({
//     clientId: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))
