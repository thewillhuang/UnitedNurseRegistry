'use strict';

const Router = require('koa-router');
const users = new Router({
  prefix: '/api/user',
});
const query = require('../services/query');
const genHash = require('../services/genHash');

module.exports = function userRoutes(app) {
  users

  // // create user
  // .post('/', function* createUser() {
  //   const requestJson = this.request.body;
  //   const password = requestJson.userPwHash;
  //   delete requestJson.userPwHash;
  //   requestJson.userPwHash = yield genHash(password);
  //   const q = {};
  //   q.sql = 'INSERT INTO ?? SET ?';
  //   q.values = ['user', requestJson];
  //   this.body = yield query(q);
  // })
  //
  // // validate password return true or false
  // .post('/validate/', function* validateUser() {
  //   const requestJson = this.request.body;
  //   const password = requestJson.userPwHash;
  //   const email = requestJson.email;
  //   const q = {};
  //   q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
  //   q.values = ['userPwHash', 'user', 'email', email];
  //   const result = yield query(q);
  //   const dbpwhash = result.rows[0].userPwHash;
  //   const success = yield validatePw(password, dbpwhash);
  //   this.body = {success: success};
  // })

  // grab user table info based on user id
  .get('/:userID', function* getUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    const select = ['userID', 'firstName', 'middleName', 'lastName', 'userGeoHash', 'dob', 'email'];
    q.values = [select, 'user', 'userID', userID];
    this.body = yield query(q);
  })

  // update user data by user id
  .put('/:userID', function* updateUser() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const password = requestJson.userPwHash;
      delete requestJson.userPwHash;
      if (password) {
        requestJson.userPwHash = yield genHash(password);
      }
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['user', requestJson, 'userID', userID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user by user id
  .delete('/:userID', function* deleteUser() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['user', 'userID', userID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(users.routes())
    .use(users.allowedMethods());
};
