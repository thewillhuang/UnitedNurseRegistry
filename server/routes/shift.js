'use strict';

const Router = require('koa-router');
const shift = new Router({
  prefix: '/api/shift'
});
const query = require('../services/query');

module.exports = function (app) {
  shift

  //create shift
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    let specialtyID = requestJson.specialtyID;
    delete requestJson.specialtyID;
    requestJson.fk_Shift_specialtyID = specialtyID;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['shift', requestJson];
    // console.log(q);
    this.body = yield query(q);
  })

  //grab shift table info based on shift id
  .get('/:shiftID', function* () {
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'shiftID', shiftID];
    // console.log(q);
    this.body = yield query(q);
  })

  // update shift data by shift id
  .put('/:shiftID', function* () {
    let requestJson = this.request.body.fields;
    let specialtyID = requestJson.specialtyID;
    delete requestJson.specialtyID;
    requestJson.fk_Shift_specialtyID = specialtyID;
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['shift', requestJson, 'shiftID', shiftID];
    console.log(q);
    this.body = yield query(q);
  })

  // delete shift by shift id
  .delete('/:shiftID', function* () {
    let shiftID = this.params.shiftID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['shift', 'shiftID', shiftID];
    this.body = yield query(q);
  });

  app.use(shift.routes())
    .use(shift.allowedMethods());
};
