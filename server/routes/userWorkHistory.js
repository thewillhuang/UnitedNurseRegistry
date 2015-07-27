'use strict';

const Router = require('koa-router');
const userWorkHistory = new Router({
  prefix: '/api/user/userWorkHistory'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  userWorkHistory

  //create user schedule given user id
  .post('/:userID/:facilityID', function* () {
    let userID = this.params.userID;
    let facilityID = this.params.facilityID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserSchedule_userID = userID;
    requestJson.fk_UserWorkHistory_facilityID = facilityID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserSchedule', requestJson];
    this.body = yield mysql(q);
  })

  //grab user work history based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let select = ['uwh.userHistoryID', 'f.facilityID', 'f.facilityName', 'uwh.months', 'uwh.referenceName', 'uwh.referencePhone'];
    q.values = [select, 'UserWorkHistory', 'uwh', 'Facility', 'f', 'uwh.fk_UserWorkHistory_facilityID', 'f.facilityID', 'us.fk_UserWorkHistory_userID', userID];
    this.body = yield mysql(q);
  })

  // update user email based on email ID
  .put('/:userHistoryID', function* () {
    let requestJson = this.request.body.fields;
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserWorkHistory', requestJson, 'userHistoryID', userHistoryID];
    this.body = yield mysql(q);
  })

  // delete user specialty by user id and specialty id
  .delete('/:userHistoryID', function* () {
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserWorkHistory', 'userHistoryID', userHistoryID];
    this.body = yield mysql(q);
  });

  app.use(userWorkHistory.routes())
    .use(userWorkHistory.allowedMethods());
};
