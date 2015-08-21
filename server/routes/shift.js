'use strict';

const Router = require('koa-router');
const shift = new Router({
  prefix: '/api/shift',
});
const query = require('../services/query');
const _ = require('lodash');

module.exports = function shiftRoutes(app) {
  shift

  // create shift -- TODO validate facility
  .post('/facility/:facilityID', function* createShift() {
    const user = this.passport.user;
    const requestJson = this.request.body;
    const facilityID = this.params.facilityID;
    const specialtyID = requestJson.specialtyID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      delete requestJson.specialtyID;
      delete requestJson.facilityID;
      delete requestJson.open;
      delete requestJson.pending;
      delete requestJson.completed;
      delete requestJson.facilityPaid;
      delete requestJson.userPaid;
      requestJson.fk_Shift_facilityID = facilityID;
      requestJson.fk_Shift_specialtyID = specialtyID;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['shift', requestJson];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab shift table info based on shift id
  .get('/:shiftID', function* getShiftInfo() {
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'shiftID', shiftID];
    // console.log(q);
    this.body = yield query(q);
  })

  // view all scheduled shifts by hospital id --> returns a list of shift information
  // get
  .get('/facility/:facilityID', function* grabShiftInfoByFacility() {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'fk_Shift_facilityID', facilityID];
    this.body = yield query(q);
  })

  // view all scheduled shifts by userID --> returns a list of shift information
  // get
  .get('/user/:userID', function* grabShiftInfoByUserId() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'fk_Shift_userID', userID];
    this.body = yield query(q);
  })

  // view all the open shifts by location and based on distance --> returns shift information, including facility info
  // get
  .post('/geohash/:geohash/precision/:precision', function* grabOpenShiftByGeohash() {
    const precision = this.params.precision;
    const geohash = this.params.geohash;
    const requestJson = this.request.body;
    const hashSet = requestJson.hashSet;
    // push the current hashset into the array to query, total 9 for proximity search
    hashSet.push(geohash);
    // trim every hashset to the same length as the percision
    const trimmedHashSet = hashSet.map(function trimHash(value) {
      return value.substring(0, precision);
    });
    // take off any elements that is not unique
    const set = _.uniq(trimmedHashSet);
    const q = {};
    q.sql = 'SELECT ??, ??, ?? FROM ?? INNER JOIN ?? ON (?? = ??) INNER JOIN ?? ON (?? = ??) WHERE ?? = ? AND LEFT(??, ?) IN (?)';
    const selectShift = ['shift.shiftID', 'shift.shiftStartHour', 'shift.shiftDuration', 'shift.payPerHour', 'shift.date', 'shift.open'];
    const specialty = ['specialty.specialty'];
    const facility = ['facility.facilityID', 'facility.facilityName', 'facility.facilityEMR', 'facility.facilityGeohash'];
    q.values = [
      selectShift, facility, specialty,
      'shift',
      'facility',
      'shift.fk_Shift_facilityID', 'facility.facilityID',
      'Specialty',
      'specialty.specialtyID', 'fk_Shift_specialtyID',
      'shift.open', 1,
      'facility.facilityGeohash', precision,
      set,
    ];
    // console.log(q);
    this.body = yield query(q);
  })

  // update shift data by shift id -- TODO validate facility ID
  .put('/facility/:facilityID/shift/:shiftID', function* updateShiftByShiftID() {
    const user = this.passport.user;
    const requestJson = this.request.body;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const specialtyID = requestJson.specialtyID;
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
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['shift', requestJson, 'shiftID', shiftID];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete shift by shift id
  .delete('/facility/:facilityID/shift/:shiftID', function* deleteShiftByShiftID() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['shift', 'shiftID', shiftID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(shift.routes())
    .use(shift.allowedMethods());
};
