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

function UserExist(message) {
  this.message = message;
  this.name = 'UserExist';
  Error.captureStackTrace(this, UserExist);
}
UserExist.prototype = Object.create(Error.prototype);
UserExist.prototype.constructor = UserExist;

// local strategy -- login
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
},
  function(email, password, done) {
    const q = {};
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'userID', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      if (result.rows.length === 0) { throw new NoUserError('no such user found'); }
      this.userID = result.rows[0].userID;
      return validatePw(password, result.rows[0].userPwHash);
    }).then(function(isMatch) {
      // console.log(this.userID);
      return !isMatch ?
        this.done = [false, {message: 'incorrect password'}] :
        this.done = [
          {email: email, scope: {userID: this.userID}},
          {message: 'Auth Success'},
        ];
    }).catch(NoUserError, function() {
      this.done = [false, {message: 'incorrect email'}];
    }).catch(function(e) {
      this.done = [false, {message: e}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

// local -- signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
},
  function(email, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'email', email];
    query(q).bind({}).then(function(result) {
      if (result.rows.length !== 0) { throw new EmailTaken('email taken'); }
      return genHash(password);
    }).then(function(pwhash) {
      const q2 = {};
      const userData = {};
      userData.email = email;
      userData.userPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['user', userData];
      return query(q2);
    }).then(function(result) {
      const insertId = result.rows.insertId;
      this.done = [
        {email: email, scope: {userID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(EmailTaken, function() {
      this.done = [false, {message: 'email taken'}];
    }).catch(function(e) {
      this.done = [false, {message: e}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

// bearer strategy
passport.use(new BearerStrategy(
  function(token, done) {
    jwt.verifyDecrypt(token, done);
  }
));

// facebook
passport.use(new FacebookStrategy({
  auth_Type: 'rerequest',
  profileFields: ['id', 'email', 'first_name', 'last_name'],
  scope: ['email'],
  clientID: '881519185218872',
  clientSecret: 'ec4d29399a523f123cf079c3d66e29c6',
  enableProof: true,
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/api/auth/facebook/callback',
  session: false,
},
  function(token, refreshToken, profile, done) {
    // console.log('token\n', token, 'refreshToken\n', refreshToken, 'profile\n', profile);
    const fbprofile = profile._json;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userID', 'user', 'fb_id', fbprofile.id];
    query(q).bind({}).then(function(result) {
      if (result.rows.length !== 0) {
        // skip to userExists block in catch
        this.userID = result.rows[0].userID;
        throw new UserExist('fb user exists');
      }
    }).then(function() {
      // else create a new user with the given info
      const q2 = {};
      const userData = {};
      userData.email = fbprofile.email;
      userData.fb_id = fbprofile.id;
      userData.firstName = fbprofile.first_name;
      userData.lastName = fbprofile.last_name;
      userData.fb_token = token;
      userData.fb_refreshtoken = refreshToken;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['user', userData];
      return query(q2);
    }).then(function(result) {
      const insertId = result.rows.insertId;
      this.done = [
        {userID: insertId, scope: {userID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(UserExist, function() {
      this.done = [
        {userID: this.userID, scope: {userID: this.userID}},
        {message: 'Auth successful'},
      ];
    }).catch(function(e) {
      this.done = [false, {message: e}];
    }).then(function() {
      return this.done;
    }).nodeify(done, {spread: true});
  }
));

// passport serialization / deserialization
// passport.serializeUser(function(user, done) {
//   done(null, jwt.encryptSign(user));
// });
//
// passport.deserializeUser(function(token, done) {
//   done(null, jwt.verifyDecrypt(token));
// });
