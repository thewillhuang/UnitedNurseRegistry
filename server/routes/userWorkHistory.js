'use strict';

const Router = require('koa-router');
const userWorkHistory = new Router({
  prefix: '/api/userworkhistory',
});
const query = require('../services/query');

module.exports = function (app) {
  userWorkHistory

  // create user work history given user id and facility id
  .post('/user/:userID/facility/:facilityID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const facilityID = this.params.facilityID;
      const requestJson = this.request.body;
      const q = {};
      requestJson.fk_UserWorkHistory_userID = userID;
      requestJson.fk_UserWorkHistory_facilityID = facilityID;
      if (requestJson.workHistoryVetted) {
        delete requestJson.workHistoryVetted;
      }
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['UserWorkHistory', requestJson];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab user work history based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    const select = ['uwh.userHistoryID', 'f.facilityID', 'f.facilityName', 'uwh.months', 'uwh.referenceName', 'uwh.referencePhone'];
    q.values = [select, 'UserWorkHistory', 'uwh', 'Facility', 'f', 'uwh.fk_UserWorkHistory_facilityID', 'f.facilityID', 'uwh.fk_UserWorkHistory_userID', userID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/user/:userID/history/:userHistoryID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const userHistoryID = this.params.userHistoryID;
      const q = {};
      if (requestJson.workHistoryVetted) {
        delete requestJson.workHistoryVetted;
      }
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['UserWorkHistory', requestJson, 'userHistoryID', userHistoryID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user specialty by user id and specialty id
  .delete('/user/:userID/history/:userHistoryID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const userHistoryID = this.params.userHistoryID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['UserWorkHistory', 'userHistoryID', userHistoryID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userWorkHistory.routes())
    .use(userWorkHistory.allowedMethods());
};
