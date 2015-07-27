'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  user

  //create user
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    console.log(this.request.body);
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield mysql(q);
  })

  //grab user table info based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    let select = ['userID', 'firstName', 'middleName', 'lastName', 'userGeoHash', 'dob'];
    q.values = [select, 'user', 'userID', userID];
    this.body = yield mysql(q);
  })

  // update user data by user id
  .put('/:userID', function* () {
    let requestJson = this.request.body.fields;
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield mysql(q);
  })

  // delete user by user id
  .delete('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield mysql(q);
  });

  app.use(user.routes())
    .use(user.allowedMethods());
};
