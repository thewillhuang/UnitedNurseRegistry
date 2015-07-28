'use strict';

const Router = require('koa-router');
const userLicense = new Router({
  prefix: '/api/userlicense'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  userLicense

  //create user license given user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserLicense_userID = userID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserLicense', requestJson];
    this.body = yield mysql(q);
  })

  //grab user table info based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ul.* FROM ?? AS ?? WHERE ?? = ?';
    q.values = ['UserLicense', 'ul', 'fk_UserLicense_userID', userID];
    this.body = yield mysql(q);
  })

  // update UserLicense by license id
  .put('/license/:userLicenseID', function* () {
    let requestJson = this.request.body.fields;
    // console.log(requestJson);
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserLicense', requestJson, 'userLicenseID', userLicenseID];
    // console.log(q);
    this.body = yield mysql(q);
  })

  // delete user license by license id
  .delete('/license/:userLicenseID', function* () {
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserLicense', 'userLicenseID', userLicenseID];
    // console.log(q);
    this.body = yield mysql(q);
  });

  app.use(userLicense.routes())
    .use(userLicense.allowedMethods());
};
