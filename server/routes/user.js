'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user',
});
const query = require('../services/query');
const validatePw = require('../services/validatePassword');
const genHash = require('../services/genHash');

module.exports = function userRoutes(app) {
  user

  // create user
  .post('/', function* createUser() {
    const requestJson = this.request.body;
    const password = requestJson.userPwHash;
    delete requestJson.userPwHash;
    requestJson.userPwHash = yield genHash(password, 10);
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield query(q);
  })

  // validate password return true or false
  .post('/validate/', function* validateUser() {
    const requestJson = this.request.body;
    const password = requestJson.userPwHash;
    const userName = requestJson.userName;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'userName', userName];
    const result = yield query(q);
    const dbpwhash = result.rows[0].userPwHash;
    this.body = yield validatePw(password, dbpwhash);
  })

  // grab user table info based on user id
  .get('/:userID', function* getUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    const select = ['userID', 'firstName', 'middleName', 'lastName', 'userGeoHash', 'dob', 'userName'];
    q.values = [select, 'user', 'userID', userID];
    this.body = yield query(q);
  })

  // update user data by user id
  .put('/:userID', function* updateUser() {
    const requestJson = this.request.body;
    const password = requestJson.userPwHash;
    const userID = this.params.userID;
    delete requestJson.userPwHash;
    requestJson.userPwHash = yield genHash(password, 10);
    const q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield query(q);
  })

  // delete user by user id
  .delete('/:userID', function* deleteUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield query(q);
  });

  app.use(user.routes())
    .use(user.allowedMethods());
};
