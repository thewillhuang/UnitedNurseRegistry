'use strict';

const Router = require('koa-router');
const userAddress = new Router({
  prefix: '/api/useraddress',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  userAddress

  // create new user address with user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['address', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q).spread(function(rows, fields) {
          return {rows, fields};
        }).then(function(result) {
          const address = {};
          address.fk_UserAddress_userID = userID;
          address.fk_UserAddress_addressID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['userAddress', address];
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

  // grab user address based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT a.* FROM ?? AS ?? INNER JOIN ?? AS ?? ON (?? = ??) WHERE ?? = ?';
    q.values = ['address', 'a', 'useraddress', 'ua', 'ua.fk_UserAddress_addressID', 'a.addressID', 'ua.fk_UserAddress_userID', userID];
    this.body = yield query(q);
  })

  // update user address based on address ID
  .put('/user/:userID/address/:addressID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const addressID = this.params.addressID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['address', requestJson, 'addressID', addressID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete address by address id
  .delete('/user/:userID/address/:addressID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID.toString() === userID) {
      const addressID = this.params.addressID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['address', 'addressID', addressID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userAddress.routes())
    .use(userAddress.allowedMethods());
};
