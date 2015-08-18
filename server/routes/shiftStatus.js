'use strict';

const Router = require('koa-router');
const shiftStatus = new Router({
  prefix: '/api/shiftStatus',
});
const query = require('../services/query');

module.exports = function shiftStatusRoutes(app) {
  shiftStatus

  // grab the shift status by shift id --> returns open, pending or completed
  .get('/shift/:shiftID', function* getShiftStatus() {
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    const select = ['open', 'pending', 'completed'];
    q.values = [select, 'shift', 'shiftID', shiftID];
    this.body = yield query(q);
  })

  // insert view count by unique userID TODO validate userID
  .post('/viewed/shift/:shiftID/user/:userID', function* addViews() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const shiftID = this.params.shiftID;
      const payload = {
        fk_ShiftViewed_shiftID: shiftID,
        fk_ShiftViewed_userID: userID,
      };
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['ShiftViewed', payload];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // view count by shiftID  --> returns number of views, and number of rejected views based on shift ID
  .get('/viewed/shift/:shiftID', function* returnUniqueViews() {
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT count(*) AS ? FROM ?? WHERE ?? = ?';
    q.values = ['unique', 'ShiftViewed', 'fk_ShiftViewed_shiftID', shiftID];
    this.body = yield query(q);
  })

  // mark shift as completed by shiftID TODO validate facility ID
  .post('/completed/shift/:shiftID/facility/:facilityID', function* markAsComplete() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      const set = {open: 0, pending: 0, completed: 1};
      q.values = ['shift', set, 'shiftID', shiftID, 'fk_Shift_facilityID', facilityID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // mark shift as pending by shiftID TODO validate facility ID
  .post('/pending/shift/:shiftID/user/:userID/facility/:facilityID', function* markAsPending() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID.toString() === facilityID) {
      const userID = this.params.userID;
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      const set = {open: 0, pending: 1, completed: 0, fk_Shift_userID: userID};
      q.values = ['shift', set, 'shiftID', shiftID, 'fk_Shift_facilityID', facilityID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // mark shift as open by shiftID TODO validate facility ID
  .post('/open/shift/:shiftID/facility/:facilityID', function* markAsOpen() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      const set = {open: 1, pending: 0, completed: 0, fk_Shift_userID: null};
      q.values = ['shift', set, 'shiftID', shiftID, 'fk_Shift_facilityID', facilityID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // view all open shifts by hospital id --> return a list of shift information
  .get('/open/facility/:facilityID', function* viewOpenShiftByHospital() {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['shift', 'open', 1, 'fk_Shift_facilityID', facilityID];
    this.body = yield query(q);
  })

  // view all shifts by userID --> returns a list of shift information
  .get('/open/user/:userID', function* viewOpenShiftByUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'fk_Shift_userID', userID];
    this.body = yield query(q);
  });

  app.use(shiftStatus.routes())
    .use(shiftStatus.allowedMethods());
};
