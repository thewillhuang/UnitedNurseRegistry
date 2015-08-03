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
  .get('/shiftID', function* (){
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?'
    q.values = ['shiftStatus', 'shift', 'shiftID', shiftID];
    let res = query(q);
    if (res.rows.shiftStatus == 0) {
      console.log(res);
      this.body = 'open';
    } else if (res.rows.shiftStatus == 1) {
      console.log(res);
      this.body = 'pending';
    } else {
      console.log(res);
      this.body = 'completed';
    }
  })

  // view all the open shifts by location and based on distance --> returns shift information, including facility info
  // get
  .get('/shiftID/')

  // view all open shifts by hospital id --> return a list of shift information
  // get

  // view all open shifts by userID --> returns a list of shift information
  // get

  // reject an open shift by shiftID --> reject an open shift with shift ID
  // post

  // accept an open shift by shiftID -->  accept the shift and move it to pending shift with shift ID
  // post

  // view %viewed status by shiftID  --> returns number of views, and number of rejected views based on shift ID
  // get

  // view all scheduled shifts by hospital id --> returns a list of shift information
  // get

  // view all scheduled shifts by userID --> returns a list of shift information
  // get

  // mark shift as completed by shiftID
  // post

  //grab shiftStatus info based on shift id
  .get('/:shiftID', function* () {
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['openshifts', 'fk_OpenShifts_shiftID', shiftID];
    let openShifts = yield query(q);
    console.log(openShifts);
    // this.body = yield query(q);
  })

  // update shiftStatus data by shiftStatus id
  .put('/:shiftStatusID', function* () {
    let requestJson = this.request.body.fields;
    let specialtyID = requestJson.specialtyID;
    delete requestJson.specialtyID;
    requestJson.fk_shiftStatus_specialtyID = specialtyID;
    let shiftStatusID = this.params.shiftStatusID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['shiftStatus', requestJson, 'shiftStatusID', shiftStatusID];
    // console.log(q);
    this.body = yield query(q);
  })

  // delete shiftStatus by shiftStatus id
  .delete('/:shiftStatusID', function* () {
    let shiftStatusID = this.params.shiftStatusID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['shiftStatus', 'shiftStatusID', shiftStatusID];
    this.body = yield query(q);
  });

  app.use(shiftStatus.routes())
    .use(shiftStatus.allowedMethods());
};
