'use strict';

const Router = require('koa-router');
const facilityAddress = new Router({
  prefix: '/api/facilityAddress',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  facilityAddress

  // create new facility address with facility id
  .post('/facility/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['address', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q).spread(function(rows, fields) {
          return {rows, fields};
        }).then(function(result) {
          const address = {};
          address.fk_FacilityAddress_facilityID = facilityID;
          address.fk_FacilityAddress_addressID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['facilityAddress', address];
          return q2;
        }).then(function(q2) {
          return tx.queryAsync(q2).spread(function(rows, fields) {
            return {rows, fields};
          });
        }).catch(function(error) {
          return error;
        });
      });
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab facility address based on facility id
  .get('/facility/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT a.* FROM ?? AS ?? INNER JOIN ?? AS ?? ON (?? = ??) WHERE ?? = ?';
    q.values = ['address', 'a', 'facilityaddress', 'fa', 'fa.fk_facilityAddress_addressID', 'a.addressID', 'fa.fk_facilityAddress_facilityID', facilityID];
    this.body = yield query(q);
  })

  // update user address based on address ID
  .put('/facility/:facilityID/address/:addressID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const addressID = this.params.addressID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['address', requestJson, 'addressID', addressID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete address by address id
  .delete('/facility/:facilityID/address/:addressID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const addressID = this.params.addressID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['address', 'addressID', addressID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(facilityAddress.routes())
    .use(facilityAddress.allowedMethods());
};
