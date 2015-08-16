'use strict';

const Router = require('koa-router');
const facility = new Router({
  prefix: '/api/facility',
});
const query = require('../services/query');
const validatePw = require('../services/validatePassword');
const genHash = require('../services/genHash');

module.exports = function(app) {
  facility

  // create facility
  .post('/', function* () {
    const requestJson = this.request.body;
    const password = requestJson.facilityPwHash;
    delete requestJson.facilityPwHash;
    requestJson.facilityPwHash = yield genHash(password);
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['facility', requestJson];
    const user = this.passport.user;
    if (user.scope.facilityID !== facilityID) {
      this.body = {message: 'no permission'};
    } else {
      this.body = yield query(q);
    }
  })

  // validate password return true or false
  .post('/validate/', function* validateFacility() {
    const requestJson = this.request.body;
    const password = requestJson.facilityPwHash;
    const facilityName = requestJson.facilityName;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['facilityPwHash', 'facility', 'facilityName', facilityName];
    const user = this.passport.user;
    if (user.scope.facilityID !== facilityID) {
      this.body = {message: 'no permission'};
    } else {
      const result = yield query(q);
      const dbpwhash = result.rows[0].facilityPwHash;
      const success = yield validatePw(password, dbpwhash);
      this.body = {success: success};
    }
  })

  // grab user table info based on user id
  .get('/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    // console.log(q);
    const select = ['facilityName', 'facilityGeohash', 'facilityEMR'];
    q.values = [select, 'facility', 'facilityID', facilityID];
    const user = this.passport.user;
    if (user.scope.facilityID !== facilityID) {
      this.body = {message: 'no permission'};
    } else {
      this.body = yield query(q);
    }
  })

  // update user data by user id
  .put('/:facilityID', function* () {
    const requestJson = this.request.body;
    const facilityID = this.params.facilityID;
    const password = requestJson.facilityPwHash;
    const user = this.passport.user;
    if (user.scope.facilityID !== facilityID) {
      this.body = {message: 'no permission'};
    } else {
      delete requestJson.facilityPwHash;
      requestJson.facilityPwHash = yield genHash(password);
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['facility', requestJson, 'facilityID', facilityID];
      this.body = yield query(q);
    }
  })

  // delete user by user id
  .delete('/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['facility', 'facilityID', facilityID];
    const user = this.passport.user;
    if (user.scope.facilityID !== facilityID) {
      this.body = {message: 'no permission'};
    } else {
      this.body = yield query(q);
    }
  });

  app.use(facility.routes())
    .use(facility.allowedMethods());
};
