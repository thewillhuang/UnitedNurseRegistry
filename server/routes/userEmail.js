'use strict';

const Router = require('koa-router');
const userEmail = new Router({
  prefix: '/api/useremail'
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function (app) {
  userEmail

  //create new user email with user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['email', requestJson];
    this.body = yield Promise.using(getTransaction(), function(tx){
      return tx.queryAsync(q).spread(function(rows, fields){
        return {rows, fields};
      }).then(function(result){
        let email = {};
        email.fk_UserEmail_userID = userID;
        email.fk_UserEmail_emailID = result.rows.insertId;
        let q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?;';
        q2.values = ['useremail', email];
        return q2;
      }).then(function(q2){
        return tx.queryAsync(q2).spread(function(rows, fields){
          return {rows, fields};
        });
      }).catch(function(error){
        return error;
      });
    });
  })

  //grab user emails based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT e.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['email', 'e', 'useremail', 'ue', 'ue.fk_UserEmail_emailID', 'e.emailID', 'ue.fk_UserEmail_userID', userID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/email/:emailID', function* () {
    let requestJson = this.request.body.fields;
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['email', requestJson, 'emailID', emailID];
    this.body = yield query(q);
  })

  // delete useremail by email id
  .delete('/email/:emailID', function* () {
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['email', 'emailID', emailID];
    this.body = yield query(q);
  });

  app.use(userEmail.routes())
    .use(userEmail.allowedMethods());
};
