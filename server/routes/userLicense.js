'use strict';

const Router = require('koa-router');
const userLicense = new Router({
  prefix: '/api/userlicense'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  userLicense

  //create user license given user id
  .post('/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserLicense_userID = userID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserLicense', requestJson];
    this.body = yield mysql(q);
  })

  //grab user table info based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? WHERE ?? = ?';
    q.values = ['ul.*', 'UserLicense', 'ul', 'fk_UserLicense_userID', userID];
    this.body = yield mysql(q);
  })

  // update UserLicense by license id
  .put('/:UserLicenseID', function* () {
    let requestJson = this.request.body.fields;
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserLicense', requestJson, 'userLicenseID', userLicenseID];
    this.body = yield mysql(q);
  })

  // delete user license by license id
  .delete('/:userLicenseID', function* () {
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserLicense', 'userLicenseID', userLicenseID];
    this.body = yield mysql(q);
  });

  app.use(userLicense.routes())
    .use(userLicense.allowedMethods());
};
