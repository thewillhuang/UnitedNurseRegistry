'use strict';

const Router = require('koa-router');
const userSchedule = new Router({
  prefix: '/api/userschedule'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  userSchedule

  //create user schedule given user id
  .post('/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserSchedule_userID = userID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserSchedule', requestJson];
    this.body = yield mysql(q);
  })

  //grab user schedule info based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    let select = ['userScheduleID', 'shiftStart', 'shiftDuration', 'dayOfWeek'];
    q.values = [select, 'UserSchedule', 'fk_UserSchedule_userID', userID];
    this.body = yield mysql(q);
  })

  // update user schedule by schedule id
  .put('/:scheduleID', function* () {
    let requestJson = this.request.body.fields;
    let scheduleID = this.params.scheduleID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserSchedule', requestJson, 'scheduleID', scheduleID];
    this.body = yield mysql(q);
  })

  // delete user schedule by schedule id
  .delete('/:userScheduleID', function* () {
    let userScheduleID = this.params.userScheduleID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserSchedule', 'userScheduleID', userScheduleID];
    this.body = yield mysql(q);
  });

  app.use(userSchedule.routes())
    .use(userSchedule.allowedMethods());
};
