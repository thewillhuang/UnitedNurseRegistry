'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const query = require('./query');
const validatePw = require('./validatePassword');
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
},
  function(username, password, done) {
    // console.log(username);
    // console.log(password);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', username];
    query(q).then(function(result) {
      // console.log(result);
      if (!result.rows.length) { return done(null, false, {message: 'Incorrect email.'}); }
      return result.rows[0].userPwHash;
    }).then(function(dbpwhash) {
      // console.log(dbpwhash);
      return validatePw(password, dbpwhash);
    }).then(function(isMatch) {
      // console.log(isMatch);
      if (!isMatch) { return done(null, false, {message: 'Incorrect password.'}); }
      return done(null, {email: username}, {message: 'Auth Success'});
    }).catch(function(error) {
      console.log(error);
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
},
  function(token, refreshToken, profile, done) {
    console.log(token, refreshToken, profile);
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
