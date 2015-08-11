'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const query = require('./query');
const validatePw = require('./validatePassword');
const genHash = require('./genHash');
const jwt = require('./jwt');
// const pool = require('./pool');

passport.serializeUser(function(user, done) {
  const token = jwt.encryptSign(user);
  done(null, token);
});

passport.deserializeUser(function(token, done) {
  const user = jwt.verifyDecrypt(token);
  done(null, user);
});

// promise version
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
  function(req, email, password, done) {
    console.log('req', req);
    // console.log(username);
    // console.log(password);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      if (result.rows.length === 0) {
        this.done = [false, {message: 'incorrect email'}];
      } else {
        return result.rows[0].userPwHash;
      }
    }).then(function(dbpwhash) {
      return validatePw(password, dbpwhash);
    }).then(function(isMatch) {
      if (!isMatch) {
        this.done = [false, {message: 'incorrect password'}];
      } else {this.done = [{email: email}, {message: 'Auth Success'}]; }
      return this.done;
    }).catch(function(error) {
      return error;
    }).nodeify(done, {spread: true});
  }
));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
  function(req, email, password, done) {
    // console.log('req', req);
    // console.log(email);
    // console.log(password);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).then(function(result) {
      // console.log('result1', result);
      if (result.rows.length === 0) {
        return true;
      }
      done(null, false, {message: 'Email taken'});
      throw new Error('email taken');
    }).then(function() {
      return genHash(password, 8);
    }).then(function(pwhash) {
      const q2 = {};
      const userData = {};
      userData.email = email;
      userData.userPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['user', userData];
      return query(q2);
    }).then(function(result) {
      console.log('local-signup insert result', result);
      done(null, {email: email}, {message: 'Registeration successful'});
    }).catch(function(error) {
      done(error, false, {message: 'db error'});
    });
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
