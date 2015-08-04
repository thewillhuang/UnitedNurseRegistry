'use strict';

const Router = require('koa-router');
const shift = new Router({
  prefix: '/api/shift'
});
const query = require('../services/query');

module.exports = function (app) {
  shift

  //create shift
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    let specialtyID = requestJson.specialtyID;
    let facilityID = requestJson.facilityID;
    delete requestJson.specialtyID;
    delete requestJson.facilityID;
    requestJson.fk_Shift_facilityID = facilityID;
    requestJson.fk_Shift_specialtyID = specialtyID;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['shift', requestJson];
    // console.log(q);
    this.body = yield query(q);
  })

  //grab shift table info based on shift id
  .get('/:shiftID', function* () {
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'shiftID', shiftID];
    // console.log(q);
    this.body = yield query(q);
  })

  // view all scheduled shifts by hospital id --> returns a list of shift information
  // get
  .get('/hospital/:hospitalID', function* (){
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?'
    q.values = ['shift', 'fk_Shift_facilityID', facilityID];
  })

  // view all scheduled shifts by userID --> returns a list of shift information
  // get
  .get('/user/:userID', function* (){
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?'
    q.values = ['shift', 'fk_Shift_userID', userID];
  })

  //TODO node geohash function
  // view all the open shifts by location and based on distance --> returns shift information, including facility info
  // get
  .get('/geohash/:geohash/precision/:precision', function* (){
    let precision = this.params.precision;
    let geohash = this.params.geohash;
    let requestJson = this.request.body.fields;
    let hashSet = requestJson.hashSet;
    let q = {};
    q.sql = 'SELECT ??, ?? FROM ?? INNER JOIN ?? ON (?? = ??) WHERE ?? = ? AND LEFT(??, ?) IN (?)';
    let shift = ['shift.shiftID', 'shift.fk_Shift_specialtyID', 'shift.shiftStartHour', 'shift.shiftDuration', 'shift.payPerHour', 'shift.date'];
    let facility = ['facility.facilityID', 'facility.facilityName', 'facility.facilityEMR'];
    q.values = [
      shift,
      facility,
      'shift',
      'facility',
      'shift.fk_Shift_facilityID', 'facility.facilityID',
      'shift.open', 1,
      'facility.facilityGeohash', precision,
      hashSet
    ];
    this.body = yield query(q);
  })

  // update shift data by shift id
  .put('/:shiftID', function* () {
    let requestJson = this.request.body.fields;
    let specialtyID = requestJson.specialtyID;
    let facilityID = requestJson.facilityID;
    if (specialtyID) {
      delete requestJson.specialtyID;
      requestJson.fk_Shift_specialtyID = specialtyID;
    }
    if (facilityID) {
      delete requestJson.facilityID;
      requestJson.fk_Shift_facilityID = facilityID;
    }
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['shift', requestJson, 'shiftID', shiftID];
    // console.log(q);
    this.body = yield query(q);
  })

  // delete shift by shift id
  .delete('/:shiftID', function* () {
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'shiftID', shiftID];
    this.body = yield query(q);
  });

  app.use(shift.routes())
    .use(shift.allowedMethods());
};
