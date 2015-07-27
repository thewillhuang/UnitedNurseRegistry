'use strict';

const Router = require('koa-router');
const userEmail = new Router({
  prefix: '/api/user/email'
});
const query = require('../services/query');

module.exports = function (app) {
  userEmail

  //create new user email with user id
  .post('/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['email', requestJson];
    let r1 = yield query(q);
    let email = {};
    email.fk_UserEmail_userID = userID;
    email.fk_UserEmail_emailID = r1.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?;';
    q2.values = ['useremail', userEmail];
    this.body = yield query(q2);
  })

  //grab user emails based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['e.*', 'email', 'e', 'useremail', 'ue', 'ue.fk_UserEmail_emailID', 'e.emailID', 'ue.fk_UserEmail_userID', userID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/:emailID', function* () {
    let requestJson = this.request.body.fields;
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['email', requestJson, 'emailID', emailID];
    this.body = yield query(q);
  })

  // delete useremail by email id
  .delete('/:emailID', function* () {
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['email', 'emailID', emailID];
    this.body = yield query(q);
  });

  app.use(userEmail.routes())
    .use(userEmail.allowedMethods());
};
