'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user
  //create user
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //create new user email
  .post('/email/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['email', requestJson];
    let email = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
    let userEmailJson = { 'fk_UserEmail_userID': userID, 'fk_UserEmail_emailID': email.insertId };
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = [
      'useremail',
      userEmailJson
    ];
    this.body = yield client.query(q2)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user table info based on userid
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['firstName', 'middleName', 'lastName', 'userGeoHash', 'user', 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user emails based on userid
  .get('/email/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'select ?? from ?? ?? join ?? ?? on (?? = ??) where ?? = ?';
    q.values = ['e.emailAddress', 'email', 'e', 'useremail', 'ue', 'ue.fk_UserEmail_emailID', 'e.emailID', 'ue.fk_UserEmail_userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user data
  .put('/:userID', function* () {
    let requestJson = this.request.body.fields;
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user email based on emailID
  .put('/email/:emailID', function* () {
    let requestJson = this.request.body.fields;
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['email', requestJson, 'emailID', emailID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete user by id
  .delete('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete useremail by emailid
  .delete('/email/:emailID', function* () {
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['email', 'emailID', emailID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  });

  app.use(user.routes()).use(user.allowedMethods());
};
