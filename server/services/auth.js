'use strict';
const passport = require('koa-passport');
const query = require('../services/query');
const bcrypt = require('./bcrypt');
const Promise = require('bluebird');

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  // retrieve user info, validate the password.
  const q = {};
  q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
  q.values = ['userPwHash', 'user', 'userName', username];
  query(q).bind({}).then(function(result) {
    // no such user
    if (!result.rows.length) {
      throw new Error('Incorrect username.');
    } else {
      this.user = {userName: username};
      return result.rows[0].userPwHash;
    }
  }).then(function(dbpwHash) {
    return bcrypt.compareAsync(password, dbpwHash);
  }).then(function(match) {
    if (!match) {
      throw new Error('Incorrect password');
    } else {
      return this.user;
    }
  }).nodeify(done);
}));

function test(username, password, done) {
  // retrieve user info, validate the password.
  const q = {};
  q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
  q.values = ['userPwHash', 'user', 'userName', username];
  Promise.resolve(query(q)).bind({}).then(function(result) {
    // no such user
    console.log(result);
    if (!result.rows.length) {
      throw new Error('Incorrect username.');
    } else {
      this.user = {userName: username};
      return result.rows[0].userPwHash;
    }
  }).then(function(dbpwHash) {
    return bcrypt.compareAsync(password, dbpwHash);
  }).then(function(match) {
    if (!match) {
      throw new Error('Incorrect password');
    } else {
      return this.user;
    }
  }).nodeify(done);
}

test('13414', 'baldhfdaljfdsa', function(err, user, flash) {
  console.log(err);
  console.log(user);
  console.log(flash);
  process._getActiveRequests();
  process._getActiveHandles();
});


// const FacebookStrategy = require('passport-facebook').Strategy
// passport.use(new FacebookStrategy({
//     clientID: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))
//
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
//
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
