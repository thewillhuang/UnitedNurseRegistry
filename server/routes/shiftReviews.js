'use strict';

const Router = require('koa-router');
const shiftReview = new Router({
  prefix: '/api/shiftReview',
});
const query = require('../services/query');

module.exports = function shiftReviewRoutes(app) {
  shiftReview

  // user reviews
  .post('/user/:userID/shift/:shiftID', function* createUserReview() {
    const userID = this.params.userID;
    const shiftID = this.params.shiftID;
    const requestJson = this.request.body.fields;
    requestJson.fk_ShiftReviewOnUser_userID = userID;
    requestJson.fk_ShiftReviewOnUser_shiftID = shiftID;
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['ShiftReviewOnUser', requestJson];
    this.body = yield query(q);
  })

  .put('/user/:userID/shift/:shiftID', function* updateUserReview() {
    const userID = this.params.userID;
    const shiftID = this.params.shiftID;
    const requestJson = this.request.body.fields;
    const q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
    q.values = ['ShiftReviewOnUser', requestJson, 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
    this.body = yield query(q);
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
    q.sql = 'SELECT AVG(??) FROM ?? WHERE ?? = ?';
    q.values = ['review', 'ShiftReviewOnUser', 'fk_ShiftReviewOnUser_userID', userID];
    this.body = yield query(q);
  })

  .delete('/user/:userID/shift/:shiftID', function* deleteUserReview() {
    const userID = this.params.userID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['ShiftReviewOnUser', 'fk_ShiftReviewOnUser_userID', userID, 'fk_ShiftReviewOnUser_shiftID', shiftID];
    this.body = yield query(q);
  })

  // facility reviews
  .post('/facility/:facilityID/shift/:shiftID', function* createFacilityReview() {
    const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const requestJson = this.request.body.fields;
    requestJson.fk_ShiftReviewOnFacility_facilityID = facilityID;
    requestJson.fk_ShiftReviewOnFacility_shiftID = shiftID;
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['ShiftReviewOnFacility', requestJson];
    this.body = yield query(q);
  })

  .put('/facility/:facilityID/shift/:shiftID', function* updateFacilityReview() {
    const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const requestJson = this.request.body.fields;
    const q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?';
    q.values = ['ShiftReviewOnFacility', requestJson, 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
    this.body = yield query(q);
  })

  .get('/facility/:facilityID/shift/:shiftID', function* getFacilityReview() {
    const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['review', 'ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
    this.body = yield query(q);
  })

  .get('/avg/facility/:facilityID', function* getAvgFacilityReview() {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT AVG(??) FROM ?? WHERE ?? = ?';
    q.values = ['review', 'ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID];
    this.body = yield query(q);
  })

  .delete('/facility/:facilityID/shift/:shiftID', function* deleteFacilityReview() {
    const facilityID = this.params.facilityID;
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['ShiftReviewOnFacility', 'fk_ShiftReviewOnFacility_facilityID', facilityID, 'fk_ShiftReviewOnFacility_shiftID', shiftID];
    this.body = yield query(q);
  });

  app.use(shiftReview.routes())
    .use(shiftReview.allowedMethods());
};
