'use strict';

const Router = require('koa-router');
const facility = new Router({
  prefix: '/api/facility'
});
const query = require('../services/query');

module.exports = function (app) {
  facility

  //create facility
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    // console.log(requestJson);
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['facility', requestJson];
    this.body = yield query(q);
  })

  //grab user table info based on user id
  .get('/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    // console.log(q);
    let select = ['facilityName', 'facilityGeohash', 'facilityEMR'];
    q.values = [select, 'facility', 'facilityID', facilityID];
    this.body = yield query(q);
  })

  // update user data by user id
  .put('/:facilityID', function* () {
    let requestJson = this.request.body.fields;
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['facility', requestJson, 'facilityID', facilityID];
    this.body = yield query(q);
  })

  // delete user by user id
  .delete('/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['facility', 'facilityID', facilityID];
    this.body = yield query(q);
  });

  app.use(facility.routes())
    .use(facility.allowedMethods());
};
