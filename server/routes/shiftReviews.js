'use strict';

const Router = require('koa-router');
const shiftReview = new Router({
  prefix: '/api/shiftReview',
});
const query = require('../services/query');

module.exports = function shiftReviewRoutes(app) {
  shiftReview

  // user reviews TODO validate user ID
  .post('/user/:userID/shift/:shiftID', function* createUserReview() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const shiftID = this.params.shiftID;
      const requestJson = this.request.body;
      requestJson.fk_ShiftReviewOnUser_userID = userID;
      requestJson.fk_ShiftReviewOnUser_shiftID = shiftID;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['ShiftReviewOnUser', requestJson];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // TODO validate userID
  .put('/user/:userID/shift/:shiftID', function* updateUserReview() {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const shiftID = this.params.shiftID;
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      q.values = ['ShiftReviewOnUser', requestJson, 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  .get('/user/:userID/shift/:shiftID', function* getUserReview() {
    const userID = this.params.userID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['review', 'ShiftReviewOnUser', 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
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

  // facility reviews TODO validate facility ID
  .post('/facility/:facilityID/shift/:shiftID', function* createFacilityReview() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const requestJson = this.request.body;
      requestJson.fk_ShiftReviewOnFacility_facilityID = facilityID;
      requestJson.fk_ShiftReviewOnFacility_shiftID = shiftID;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['ShiftReviewOnFacility', requestJson];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // TODO validate facility ID
  .put('/facility/:facilityID/shift/:shiftID', function* updateFacilityReview() {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const shiftID = this.params.shiftID;
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
      q.values = ['ShiftReviewOnFacility', requestJson, 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  .get('/facility/:facilityID/shift/:shiftID', function* getFacilityReview() {
    const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['review', 'ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
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

  // TODO validate facility ID
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
