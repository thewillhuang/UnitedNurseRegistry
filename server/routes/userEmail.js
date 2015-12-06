'use strict';

const Router = require('koa-router');
const userEmail = new Router({
  prefix: '/api/useremail',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function (app) {
  userEmail

  // create new user email with user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?;';
      q.values = ['Email', requestJson];
      this.body = yield Promise.using(getTransaction(), function (tx) {
        return tx.queryAsync(q).then(function (rows) {
          return {rows};
        }).then(function (result) {
          const email = {};
          email.fk_UserEmail_userID = userID;
          email.fk_UserEmail_emailID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?;';
          q2.values = ['UserEmail', email];
          return q2;
        }).then(function (q2) {
          return tx.queryAsync(q2).then(function (rows) {
            return {rows};
          });
        }).catch(function (error) {
          return error;
        });
      });
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab user emails based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT e.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['Email', 'e', 'UserEmail', 'ue', 'ue.fk_UserEmail_emailID', 'e.emailID', 'ue.fk_UserEmail_userID', userID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/user/:userID/email/:emailID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const emailID = this.params.emailID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['Email', requestJson, 'emailID', emailID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete useremail by email id
  .delete('/user/:userID/email/:emailID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const emailID = this.params.emailID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['Email', 'emailID', emailID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userEmail.routes())
    .use(userEmail.allowedMethods());
};
