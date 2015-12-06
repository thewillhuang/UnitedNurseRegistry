'use strict';

const Router = require('koa-router');
const userSchedule = new Router({
  prefix: '/api/userschedule',
});
const query = require('../services/query');

module.exports = function (app) {
  userSchedule

  // create user schedule given user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      requestJson.fk_UserSchedule_userID = userID;
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['UserSchedule', requestJson];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab user schedule info based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    const select = ['userScheduleID', 'shiftStart', 'shiftDuration', 'dayOfWeek'];
    q.values = [select, 'UserSchedule', 'fk_UserSchedule_userID', userID];
    this.body = yield query(q);
  })

  // update user schedule by schedule id
  .put('/user/:userID/schedule/:scheduleID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const scheduleID = this.params.scheduleID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['UserSchedule', requestJson, 'userScheduleID', scheduleID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user schedule by schedule id
  .delete('/user/:userID/schedule/:userScheduleID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const userScheduleID = this.params.userScheduleID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['UserSchedule', 'userScheduleID', userScheduleID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userSchedule.routes())
    .use(userSchedule.allowedMethods());
};
