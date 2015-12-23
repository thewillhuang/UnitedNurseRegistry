'use strict';

const Router = require('koa-router');
const facilityphone = new Router({
  prefix: '/api/facilityphone',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function (app) {
  facilityphone

  // create new facility phone with facility id
  .post('/facility/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['Phone', requestJson];
      this.body = yield Promise.using(getTransaction(), function (tx) {
        return tx.queryAsync(q).then(function (rows) {
          return {rows};
        }).then(function (result) {
          // console.log(result);
          const phone = {};
          phone.fk_FacilityPhone_facilityID = facilityID;
          phone.fk_FacilityPhone_phoneID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['FacilityPhone', phone];
          return q2;
        }).then(function (q2) {
          return tx.queryAsync(q2).then(function (rows) {
            return {rows};
          });
        }).catch(function (error) {
          return error;
        });
      });
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab facility phone based on facility id
  .get('/facility/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT p.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['Phone', 'p', 'FacilityPhone', 'fp', 'fp.fk_FacilityPhone_phoneID', 'p.phoneID', 'fp.fk_FacilityPhone_facilityID', facilityID];
    this.body = yield query(q);
  })

  // update facility phone based on phone ID
  .put('/facility/:facilityID/phone/:phoneID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const phoneID = this.params.phoneID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['Phone', requestJson, 'phoneID', phoneID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete phone by phone id
  .delete('/facility/:facilityID/phone/:phoneID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const phoneID = this.params.phoneID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['Phone', 'phoneID', phoneID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(facilityphone.routes());
  app.use(facilityphone.allowedMethods());
};
