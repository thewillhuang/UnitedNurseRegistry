'use strict';

const Router = require('koa-router');
const shiftStatus = new Router({
  prefix: '/api/shiftStatus'
});
const query = require('../services/query');

module.exports = function (app) {
  shiftStatus

  // grab the shift status by shift id --> rturns open, pending or completed
  // get
  .get('/shift/:shiftID', function* (){
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?'
    let select = ['open', 'pending', 'completed'];
    q.values = [select, 'shift', 'shiftID', shiftID];
    this.body = yield query(q);
  })

  // view count by shiftID  --> returns number of views, and number of rejected views based on shift ID
  // get
  .get('/viewed/shift/:shiftID', function* (){
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT count(*) FROM ?? WHERE ?? = ?'
    q.values = ['ShiftViewed', 'fk_ShiftViewed_shiftID', shiftID];
  })

  // mark shift as completed by shiftID
  // post
  .post('/completed/shift/:shiftID', function*(){
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    let set = {open: 0, pending: 0, completed: 1};
    q.values = ['shift', set, 'shiftID', shiftID];
    this.body = yield query(q);
  })

  // mark shift as pending by shiftID
  // post
  .post('/pending/shift/:shiftID/user/:userID', function*(){
    let userID = this.params.userID;
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    let set = {open: 0, pending: 1, completed: 0, fk_Shift_userID: userID};
    q.values = ['shift', set, 'shiftID', shiftID];
    this.body = yield query(q);
  })

  // mark shift as open by shiftID
  // post
  .post('/open/shift/:shiftID', function*(){
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    let set = {open: 1, pending: 0, completed: 0};
    q.values = ['shift', set, 'shiftID', shiftID];
    this.body = yield query(q);
  })

  // view all open shifts by hospital id --> return a list of shift information
  // get
  .get('/open/facility/:facilityID', function*(){
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?'
    q.values = ['shift', 'open', 1, 'fk_Shift_facilityID', facilityID];
    this.body = yield query(q);
  })

  // view all open shifts by userID --> returns a list of shift information
  // get
  .get('/open/user/:userID', function*(){
    let userID = this.params.userID;
    let q = {}
    q.sql = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?'
    q.values = ['shift', 'open', 1, 'fk_Shift_userID', userID];
    this.body = yield query(q);
  });

  app.use(shiftStatus.routes())
    .use(shiftStatus.allowedMethods());
};
