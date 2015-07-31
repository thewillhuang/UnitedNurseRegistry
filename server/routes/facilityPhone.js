'use strict';

const Router = require('koa-router');
const facilityphone = new Router({
  prefix: '/api/facilityphone'
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function (app) {
  facilityphone

  //create new facility phone with facility id
  .post('/facility/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['phone', requestJson];
    this.body = yield Promise.using(getTransaction(), function(tx){
      return tx.queryAsync(q).spread(function(rows, fields){
        return {rows, fields};
      }).then(function(result){
        // console.log(result);
        let phone = {};
        phone.fk_FacilityPhone_facilityID = facilityID;
        phone.fk_FacilityPhone_phoneID = result.rows.insertId;
        let q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?';
        q2.values = ['facilityphone', phone];
        return q2;
      }).then(function(q2){
        return tx.queryAsync(q2).spread(function(rows, fields){
          return {rows, fields};
        });
      }).catch(function(error){
        return error;
      });
    });
  })

  //grab facility phone based on facility id
  .get('/facility/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT p.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['phone', 'p', 'facilityphone', 'fp', 'fp.fk_FacilityPhone_phoneID', 'p.phoneID', 'fp.fk_FacilityPhone_facilityID', facilityID];
    this.body = yield query(q);
  })

  // update facility phone based on phone ID
  .put('/phone/:phoneID', function* () {
    let requestJson = this.request.body.fields;
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['phone', requestJson, 'phoneID', phoneID];
    this.body = yield query(q);
  })

  // delete phone by phone id
  .delete('/phone/:phoneID', function* () {
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['phone', 'phoneID', phoneID];
    this.body = yield query(q);
  });

  app.use(facilityphone.routes())
    .use(facilityphone.allowedMethods());
};
