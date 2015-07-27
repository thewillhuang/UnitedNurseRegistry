'use strict';

const Router = require('koa-router');
const userPhone = new Router({
  prefix: '/api/user/phone'
});
const query = require('../services/query');

module.exports = function (app) {
  userPhone

  //create new user phone with user id
  .post('/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['phone', requestJson];
    let r1 = yield query(q);
    let phone = {};
    phone.fk_UserPhone_userID = userID;
    phone.fk_UserPhone_phoneID = r1.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['userphone', userPhone];
    this.body = yield query(q2);
  })

  //grab user phone based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['p.*', 'phone', 'p', 'userphone', 'up', 'up.fk_UserPhone_phoneID', 'p.phoneID', 'ue.fk_UserPhone_userID', userID];
    this.body = yield query(q);
  })

  // update user phone based on phone ID
  .put('/:phoneID', function* () {
    let requestJson = this.request.body.fields;
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['phone', requestJson, 'phoneID', phoneID];
    this.body = yield query(q);
  })

  // delete phone by phone id
  .delete('/:phoneID', function* () {
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['phone', 'phoneID', phoneID];
    this.body = yield query(q);
  });

  app.use(userPhone.routes())
    .use(userPhone.allowedMethods());
};
