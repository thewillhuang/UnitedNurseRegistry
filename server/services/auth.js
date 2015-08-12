'use strict';

const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const query = require('./query');
const validatePw = require('./validatePassword');
const genHash = require('./genHash');
const jwt = require('./jwt');

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

// passport serialization / deserialization
// passport.serializeUser(function(user, done) {
//   done(null, jwt.encryptSign(user));
// });
//
// passport.deserializeUser(function(token, done) {
//   done(null, jwt.verifyDecrypt(token));
// });

// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
},
  function(req, email, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      // console.log('result from query', result);
      if (result.rows.length === 0) { throw new NoUserError('no such user found'); }
      return validatePw(password, result.rows[0].userPwHash);
    }).then(function(isMatch) {
      // console.log('isMatch', isMatch);
      return !isMatch ?
        this.done = [false, {message: 'incorrect password'}] :
        this.done = [{email: email}, {message: 'Auth Success'}];
    }).catch(NoUserError, function(error) {
      this.done = [false, {message: 'incorrect email'}];
      return error;
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

// local signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
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
      // console.log('pwhash', pwhash);
      const q2 = {};
      const userData = {};
      userData.email = email;
      userData.userPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['user', userData];
      return query(q2);
    }).then(function() {
      this.done = [{email: email}, {message: 'Registeration successful'}];
    }).catch(EmailTaken, function() {
      this.done = [false, {message: 'email taken'}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

// bearer strategy

passport.use(new BearerStrategy(
  function(token, done) {
    done(null, jwt.verifyDecrypt(token));
  }
));

// facebook
passport.use(new FacebookStrategy({
  auth_Type: 'rerequest',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
  scope: ['email'],
  clientID: '881519185218872',
  clientSecret: 'ec4d29399a523f123cf079c3d66e29c6',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/api/auth/facebook/callback',
  passReqToCallback: true,
  session: false,
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
