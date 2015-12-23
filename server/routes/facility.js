'use strict';

const Router = require('koa-router');
const facility = new Router({
  prefix: '/api/facility',
});
const query = require('../services/query');
const genHash = require('../services/genHash');

module.exports = function (app) {
  facility

  // // create facility
  // .post('/', function* () {
  //   const requestJson = this.request.body;
  //   const password = requestJson.facilityPwHash;
  //   delete requestJson.facilityPwHash;
  //   requestJson.facilityPwHash = yield genHash(password);
  //   const q = {};
  //   q.sql = 'INSERT INTO ?? SET ?';
  //   q.values = ['facility', requestJson];
  //   this.body = yield query(q);
  // })

  // // validate password return true or false
  // .post('/validate/', function* validateFacility() {
  //   const user = this.passport.user;
  //   console.log(user);
  //   const requestJson = this.request.body;
  //   const facilityID = requestJson.facilityID;
  //   if (user.scope.facilityID === facilityID) {
  //     const password = requestJson.facilityPwHash;
  //     const q = {};
  //     q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
  //     q.values = ['facilityPwHash', 'facility', 'facilityID', facilityID];
  //     const result = yield query(q);
  //     const dbpwhash = result.rows[0].facilityPwHash;
  //     const success = yield validatePw(password, dbpwhash);
  //     this.body = {success: success};
  //   } else {
  //     this.body = {message: 'no permission'};
  //   }
  // })

  // grab user table info based on user id
  .get('/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    // console.log(q);
    const select = ['facilityName', 'facilityGeohash', 'facilityEMR'];
    q.values = [select, 'Facility', 'facilityID', facilityID];
    this.body = yield query(q);
  })

  // update user data by user id
  .put('/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const password = requestJson.facilityPwHash;
      delete requestJson.facilityPwHash;
      delete requestJson.facilityVetted;
      if (password) {
        requestJson.facilityPwHash = yield genHash(password);
      }
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['Facility', requestJson, 'facilityID', facilityID];
      this.body = yield query(q);
    } else {
      this.body = { message: 'no permission' };
    }
  })

  // delete user by user id
  .delete('/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const user = this.passport.user;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['Facility', 'facilityID', facilityID];
      this.body = yield query(q);
    } else {
      this.body = { message: 'no permission' };
    }
  });

  app.use(facility.routes());
  app.use(facility.allowedMethods());
};
