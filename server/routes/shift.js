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
    delete requestJson.open;
    delete requestJson.pending;
    delete requestJson.completed;
    delete requestJson.facilityPaid;
    delete requestJson.userPaid;
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
  .get('/facility/:facilityID', function* (){
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?'
    q.values = ['shift', 'fk_Shift_facilityID', facilityID];
    this.body = yield query(q);
  })

  // view all scheduled shifts by userID --> returns a list of shift information
  // get
  .get('/user/:userID', function* (){
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?'
    q.values = ['shift', 'fk_Shift_userID', userID];
    this.body = yield query(q);
  })

  //TODO node geohash function
  // view all the open shifts by location and based on distance --> returns shift information, including facility info
  // get
  .post('/geohash/:geohash/precision/:precision', function* (){
    let precision = this.params.precision;
    let geohash = this.params.geohash;
    let requestJson = this.request.body.fields;
    let hashSet = requestJson.hashSet;
    // push the current hashset into the array to query, total 9
    hashSet.push(geohash);
    // trim every hashset to the same length as the percision
    let trimmedHashSet = hashSet.map(function(value){
      return value.substring(0, precision);
    });
    let q = {};
    q.sql = 'SELECT ??, ??, ?? FROM ?? INNER JOIN ?? ON (?? = ??) INNER JOIN ?? ON (?? = ??) WHERE ?? = ? AND LEFT(??, ?) IN (?)';
    let shift = ['shift.shiftID', 'shift.shiftStartHour', 'shift.shiftDuration', 'shift.payPerHour', 'shift.date'];
    let specialty = ['specialty.specialty'];
    let facility = ['facility.facilityID', 'facility.facilityName', 'facility.facilityEMR', 'facility.facilityGeohash'];
    q.values = [
      shift, facility, specialty,
      'shift',
      'facility',
      'shift.fk_Shift_facilityID', 'facility.facilityID',
      'Specialty',
      'specialty.specialtyID', 'fk_Shift_specialtyID',
      'shift.open', 1,
      'facility.facilityGeohash', precision,
      trimmedHashSet
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
    delete requestJson.open;
    delete requestJson.pending;
    delete requestJson.completed;
    delete requestJson.facilityPaid;
    delete requestJson.userPaid;
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
