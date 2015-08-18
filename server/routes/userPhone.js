'use strict';

const Router = require('koa-router');
const userPhone = new Router({
  prefix: '/api/userphone',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  userPhone

  // create new user phone with user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['phone', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q).spread(function(rows, fields) {
          return {rows, fields};
        }).then(function(result) {
          const phone = {};
          phone.fk_UserPhone_userID = userID;
          phone.fk_UserPhone_phoneID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['userphone', phone];
          return q2;
        }).then(function(q2) {
          return tx.queryAsync(q2).spread(function(rows, fields) {
            return {rows, fields};
          });
        }).catch(function(error) {
          return error;
        });
      });
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab user phone based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT p.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['phone', 'p', 'userphone', 'up', 'up.fk_UserPhone_phoneID', 'p.phoneID', 'up.fk_UserPhone_userID', userID];
    this.body = yield query(q);
  })

  // update user phone based on phone ID
  .put('/user/:userID/phone/:phoneID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const phoneID = this.params.phoneID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['phone', requestJson, 'phoneID', phoneID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete phone by phone id
  .delete('/user/:userID/phone/:phoneID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const phoneID = this.params.phoneID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['phone', 'phoneID', phoneID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userPhone.routes())
    .use(userPhone.allowedMethods());
};
