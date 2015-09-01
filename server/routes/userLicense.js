'use strict';

const Router = require('koa-router');
const userLicense = new Router({
  prefix: '/api/userlicense',
});
const query = require('../services/query');

module.exports = function(app) {
  userLicense

  // create user license given user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      if (requestJson.licenseVetted) {
        delete requestJson.licenseVetted;
      }
      requestJson.fk_UserLicense_userID = userID;
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['UserLicense', requestJson];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab user table info based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT ul.* FROM ?? AS ?? WHERE ?? = ?';
    q.values = ['UserLicense', 'ul', 'fk_UserLicense_userID', userID];
    this.body = yield query(q);
  })

  // update UserLicense by license id
  .put('/user/:userID/license/:userLicenseID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      // console.log(requestJson);
      if (requestJson.licenseVetted) {
        delete requestJson.licenseVetted;
      }
      const userLicenseID = this.params.userLicenseID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['UserLicense', requestJson, 'userLicenseID', userLicenseID];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user license by license id
  .delete('/user/:userID/license/:userLicenseID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const userLicenseID = this.params.userLicenseID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['UserLicense', 'userLicenseID', userLicenseID];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userLicense.routes())
    .use(userLicense.allowedMethods());
};
