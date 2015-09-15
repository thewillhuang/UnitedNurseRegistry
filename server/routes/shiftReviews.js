'use strict';

const Router = require('koa-router');
const shiftReview = new Router({
  prefix: '/api/shiftReview',
});
const query = require('../services/query');

module.exports = function shiftReviewRoutes(app) {
  shiftReview

  // only a facility should be able to post a review on the shift, and therefore the user
  .post('/user/:shiftID', function* createUserReview() {
    const shiftID = this.params.shiftID;
    const user = this.passport.user;
    const q = {};
    // take the shiftID, make a query and get the user and the facilityID on the shift
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['fk_Shift_facilityID', 'fk_Shift_userID', 'Shift', 'shiftID', shiftID];
    const result = yield query(q);
    const facilityID = result.rows[0].fk_Shift_facilityID;
    const userID = result.rows[0].fk_Shift_userID;
    // console.log('userID', userID, 'user facility id', user.scope.facilityID, 'facilityID from query', facilityID);
    // do a check on the token for the facility, if they match continue to add review else throw 406
    if (user.scope.facilityID && user.scope.facilityID === facilityID) {
    // insert statement on shift revew on user table, by using the userID, facilityID and review from shift table
      const q2 = {};
      const requestJson = this.request.body;
      requestJson.fk_ShiftReviewOnUser_userID = userID;
      requestJson.fk_ShiftReviewOnUser_shiftID = shiftID;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['ShiftReviewOnUser', requestJson];
      this.body = yield query(q2);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  .put('/user/:shiftID', function* updateUserReview() {
    const shiftID = this.params.shiftID;
    const user = this.passport.user;
    const q = {};
    // take the shiftID, make a query and get the user and the facilityID on the shift
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['fk_Shift_facilityID', 'fk_Shift_userID', 'Shift', 'shiftID', shiftID];
    const result = yield query(q);
    const facilityID = result.rows[0].fk_Shift_facilityID;
    const userID = result.rows[0].fk_Shift_userID;
    // console.log('user facility id', user.scope.facilityID, 'facilityID from query', facilityID);
    // do a check on the token for the facility, if they match continue to add review else throw 406
    if (user.scope.facilityID && user.scope.facilityID === facilityID) {
    // insert statement on shift revew on user table, by using the userID, facilityID and review from shift table
      const q2 = {};
      const requestJson = this.request.body;
      q2.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      q2.values = ['ShiftReviewOnUser', requestJson, 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
      this.body = yield query(q2);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  .get('/user/shift/:shiftID', function* getUserReview() {
    // const userID = this.params.userID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['review', 'ShiftReviewOnUser', 'fk_ShiftReviewOnUser_shiftID', shiftID];
    this.body = yield query(q);
  })

  .get('/avg/user/:userID', function* getAvgUserReview() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT AVG(??) AS ?? FROM ?? WHERE ?? = ?';
    q.values = ['review', 'avgReview', 'ShiftReviewOnUser', 'fk_ShiftReviewOnUser_userID', userID];
    this.body = yield query(q);
  })

  // TODO validate userID
  .delete('/user/:userID/shift/:shiftID', function* deleteUserReview() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
      q.values = ['ShiftReviewOnUser', 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  .post('/facility/:shiftID', function* createUserReview() {
    const shiftID = this.params.shiftID;
    const user = this.passport.user;
    const q = {};
    // take the shiftID, make a query and get the user and the facilityID on the shift
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['fk_Shift_facilityID', 'fk_Shift_userID', 'Shift', 'shiftID', shiftID];
    const result = yield query(q);
    const facilityID = result.rows[0].fk_Shift_facilityID;
    const userID = result.rows[0].fk_Shift_userID;
    // console.log('userID', userID, 'user id', user.scope.userID, 'facilityID from query', facilityID);
    // do a check on the token for the facility, if they match continue to add review else throw 406
    if (user.scope.userID && user.scope.userID === userID) {
    // insert statement on shift revew on user table, by using the userID, facilityID and review from shift table
      const q2 = {};
      const requestJson = this.request.body;
      requestJson.fk_ShiftReviewOnFacility_facilityID = facilityID;
      requestJson.fk_ShiftReviewOnFacility_shiftID = shiftID;
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['ShiftReviewOnFacility', requestJson];
      this.body = yield query(q2);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  .put('/facility/:shiftID', function* updateUserReview() {
    const shiftID = this.params.shiftID;
    const user = this.passport.user;
    const q = {};
    // take the shiftID, make a query and get the user and the facilityID on the shift
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['fk_Shift_facilityID', 'fk_Shift_userID', 'Shift', 'shiftID', shiftID];
    const result = yield query(q);
    const facilityID = result.rows[0].fk_Shift_facilityID;
    const userID = result.rows[0].fk_Shift_userID;
    // console.log('user facility id', user.scope.facilityID, 'facilityID from query', facilityID);
    // do a check on the token for the facility, if they match continue to add review else throw 406
    if (user.scope.userID && user.scope.userID === userID) {
    // insert statement on shift revew on user table, by using the userID, facilityID and review from shift table
      const q2 = {};
      const requestJson = this.request.body;
      q2.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      q2.values = ['ShiftReviewOnFacility', requestJson, 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
      this.body = yield query(q2);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  .get('/facility/shift/:shiftID', function* getFacilityReview() {
    // const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['review', 'ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_shiftID', shiftID];
    // console.log(q);
    this.body = yield query(q);
  })

  .get('/avg/facility/:facilityID', function* getAvgFacilityReview() {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT AVG(??) AS ?? FROM ?? WHERE ?? = ?';
    q.values = ['review', 'avgReview', 'ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID];
    this.body = yield query(q);
  })

  .delete('/facility/:facilityID/shift/:shiftID', function* deleteFacilityReview() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
      q.values = ['ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(shiftReview.routes())
    .use(shiftReview.allowedMethods());
};
