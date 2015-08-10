'use strict';

const Router = require('koa-router');
const userWorkHistory = new Router({
  prefix: '/api/userworkhistory'
});
const query = require('../services/query');

module.exports = function(app) {
  userWorkHistory

  //create user work history given user id and facility id
  .post('/user/:userID/facility/:facilityID', function* () {
    let userID = this.params.userID;
    let facilityID = this.params.facilityID;
    let requestJson = this.request.body;
    let q = {};
    requestJson.fk_UserWorkHistory_userID = userID;
    requestJson.fk_UserWorkHistory_facilityID = facilityID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['userworkhistory', requestJson];
    // console.log(q);
    this.body = yield query(q);
  })

  //grab user work history based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let select = ['uwh.userHistoryID', 'f.facilityID', 'f.facilityName', 'uwh.months', 'uwh.referenceName', 'uwh.referencePhone'];
    q.values = [select, 'UserWorkHistory', 'uwh', 'Facility', 'f', 'uwh.fk_UserWorkHistory_facilityID', 'f.facilityID', 'uwh.fk_UserWorkHistory_userID', userID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/history/:userHistoryID', function* () {
    let requestJson = this.request.body;
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserWorkHistory', requestJson, 'userHistoryID', userHistoryID];
    this.body = yield query(q);
  })

  // delete user specialty by user id and specialty id
  .delete('/history/:userHistoryID', function* () {
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserWorkHistory', 'userHistoryID', userHistoryID];
    this.body = yield query(q);
  });

  app.use(userWorkHistory.routes())
    .use(userWorkHistory.allowedMethods());
};
