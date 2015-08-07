'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user',
});
const query = require('../services/query');
const bcrypt = require('../services/bcrypt');

module.exports = function userRoutes(app) {
  user

  // create user
  .post('/', function* createUser() {
    const requestJson = this.request.body.fields;
    const password = requestJson.userPwHash;
    delete requestJson.userPwHash;
    requestJson.userPwHash = yield bcrypt.hashAsync(password, 10).then(function(hash) {
      return hash;
    }).catch(function(err) {
      return err;
    });
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    console.log('post user', q);
    this.body = yield query(q);
  })

  // validate password return true or false
  .post('/validate/', function* validateUser() {
    const requestJson = this.request.body.fields;
    const password = requestJson.userPwHash;
    const userName = requestJson.userName;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'userName', userName];
    const result = yield query(q);
    const dbpwhash = result.rows[0].userPwHash;
    console.log('dbpwhash', dbpwhash);
    this.body = yield bcrypt.compareAsync(password, dbpwhash).then(function(res) {
      return {validated: res};
    }).catch(function(err) {
      return err;
    });
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
    const requestJson = this.request.body.fields;
    const userID = this.params.userID;
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
