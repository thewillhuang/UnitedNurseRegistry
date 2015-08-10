'use strict';

const Router = require('koa-router');
const userAddress = new Router({
  prefix: '/api/useraddress'
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  userAddress

  // create new user address with user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['address', requestJson];
    this.body = yield Promise.using(getTransaction(), function(tx){
      return tx.queryAsync(q).spread(function(rows, fields){
        return {rows, fields};
      }).then(function(result){
        let address = {};
        address.fk_UserAddress_userID = userID;
        address.fk_UserAddress_addressID = result.rows.insertId;
        let q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?';
        q2.values = ['userAddress', address];
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

  //grab user address based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT a.* FROM ?? AS ?? INNER JOIN ?? AS ?? ON (?? = ??) WHERE ?? = ?';
    q.values = ['address', 'a', 'useraddress', 'ua', 'ua.fk_UserAddress_addressID', 'a.addressID', 'ua.fk_UserAddress_userID', userID];
    this.body = yield query(q);
  })

  // update user address based on address ID
  .put('/address/:addressID', function* () {
    let requestJson = this.request.body;
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['address', requestJson, 'addressID', addressID];
    this.body = yield query(q);
  })

  // delete address by address id
  .delete('/address/:addressID', function* () {
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['address', 'addressID', addressID];
    this.body = yield query(q);
  });

  app.use(userAddress.routes())
    .use(userAddress.allowedMethods());
};
