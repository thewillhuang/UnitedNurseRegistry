'use strict';

const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const StripeStrategy = require('passport-stripe').Strategy;
const query = require('./query');
const validatePw = require('./validatePassword');
const genHash = require('./genHash');
const jwt = require('./jwt');

// custom error functions
function NoAccountError(message) {
  this.message = message;
  this.name = 'NoAccountError';
  Error.captureStackTrace(this, NoAccountError);
}
NoAccountError.prototype = Object.create(Error.prototype);
NoAccountError.prototype.constructor = NoAccountError;

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
  function (email, password, done) {
    const q = {};
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'userID', 'User', 'email', email];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      if (result.rows.length === 0) { throw new NoAccountError('no such user found'); }
      this.userID = result.rows[0].userID;
      return validatePw(password, result.rows[0].userPwHash);
    }).then(function (isMatch) {
      // console.log(this.userID);
      return !isMatch ?
        this.done = [false, { message: 'incorrect password' }] :
        this.done = [
          { email, scope: { userID: this.userID } },
          { message: 'Auth Success' },
        ];
    }).catch(NoAccountError, function () {
      this.done = [false, { message: 'incorrect email' }];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, { message: e }];
    }).then(function () {
      return this.done;
    }).asCallback(done, { spread: true });
  }
));

// local strategy -- facility login
passport.use('facility-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
},
  function (email, password, done) {
    const q = {};
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['facilityPwHash', 'facilityID', 'Facility', 'facilityEmail', email];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      // console.log('facility result', result);
      if (result.rows.length === 0) { throw new NoAccountError('no such facility found'); }
      this.facilityID = result.rows[0].facilityID;
      return validatePw(password, result.rows[0].facilityPwHash);
    }).then(function (isMatch) {
      // console.log(this.userID);
      return !isMatch ?
        this.done = [false, { message: 'incorrect password' }] :
        this.done = [
          { email, scope: { facilityID: this.facilityID } },
          { message: 'Auth Success' },
        ];
    }).catch(NoAccountError, function () {
      this.done = [false, { message: 'incorrect email' }];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, { message: e }];
    }).then(function () {
      return this.done;
    }).asCallback(done, { spread: true });
  }
));

// local -- signup
passport.use('facility-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
},
  function (email, password, done) {
    // console.log(email, password);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['facilityPwHash', 'Facility', 'facilityemail', email];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      // console.log('facility result', result);
      if (result.rows.length !== 0) { throw new EmailTaken('email taken'); }
      return genHash(password);
    }).then(function (pwhash) {
      const q2 = {};
      const userData = {};
      userData.facilityEmail = email;
      userData.facilityPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['Facility', userData];
      return query(q2);
    }).then(function (result) {
      // console.log('facility q2', result);
      const insertId = result.rows.insertId;
      this.done = [
        {email: email, scope: {facilityID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(EmailTaken, function () {
      this.done = [false, {message: 'email taken'}];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, {message: e}];
    }).then(function () {
      return this.done;
    }).asCallback(done, {spread: true});
  }
));

// local -- signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
},
  function (email, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'User', 'email', email];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      if (result.rows.length !== 0) { throw new EmailTaken('email taken'); }
      return genHash(password);
    }).then(function (pwhash) {
      const q2 = {};
      const userData = {};
      userData.email = email;
      userData.userPwHash = pwhash;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['User', userData];
      return query(q2);
    }).then(function (result) {
      const insertId = result.rows.insertId;
      this.done = [
        {email: email, scope: {userID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(EmailTaken, function () {
      this.done = [false, {message: 'email taken'}];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, {message: e}];
    }).then(function () {
      return this.done;
    }).asCallback(done, {spread: true});
  }
));

// bearer strategy
passport.use(new BearerStrategy(
  function (token, done) {
    jwt.verifyDecrypt(token, done);
  }
));

passport.use(new StripeStrategy({
  clientID: 'ca_7KPW3l2e2cetMAYgRLBxO7rZqKa84WTh',
  clientSecret: 'sk_test_QhkM0TkqmtZinr5Gy7P4CtIq',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/api/auth/stripe/callback',
},
  function (accessToken, refreshToken, stripeProperties, done) {
    // console.log(accessToken, refreshToken, stripeProperties, done);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userID', 'User', 'stripe_user_id', stripeProperties.stripe_user_id];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      if (result.rows.length !== 0) {
        this.userID = result.rows[0].userID;
        throw new UserExist('stripe user exists');
      }
    }).then(function () {
      const q2 = {};
      const userData = {};
      userData.stripe_publishable_key = stripeProperties.stripe_publishable_key;
      userData.stripe_user_id = stripeProperties.stripe_user_id;
      userData.stripe_refresh_token = refreshToken;
      userData.stripe_access_token = accessToken;
      // console.log('userData', userData);
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['User', userData];
      return query(q2);
    }).then(function (result) {
      // console.log(result);
      const insertId = result.rows.insertId;
      this.done = [
        {userID: insertId, scope: {userID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(UserExist, function () {
      this.done = [
        {userID: this.userID, scope: {userID: this.userID}},
        {message: 'Auth successful'},
      ];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, {message: e}];
    }).then(function () {
      return this.done;
    }).asCallback(done, {spread: true});
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
  function (token, refreshToken, profile, done) {
    // console.log('token\n', token, 'refreshToken\n', refreshToken, 'profile\n', profile);
    const fbprofile = profile._json;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userID', 'User', 'fb_id', fbprofile.id];
    query(q).bind({}).then(function (result) {
      // console.log(result);
      if (result.rows.length !== 0) {
        // skip to userExists block in catch
        this.userID = result.rows[0].userID;
        throw new UserExist('fb user exists');
      }
    }).then(function () {
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
    }).then(function (result) {
      const insertId = result.rows.insertId;
      this.done = [
        {userID: insertId, scope: {userID: insertId}},
        {message: 'Registeration successful'},
      ];
    }).catch(UserExist, function () {
      this.done = [
        {userID: this.userID, scope: {userID: this.userID}},
        {message: 'Auth successful'},
      ];
    }).catch(function (e) {
      console.log(e);
      this.done = [false, {message: e}];
    }).then(function () {
      return this.done;
    }).asCallback(done, {spread: true});
  }
));
