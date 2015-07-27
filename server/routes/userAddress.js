'use strict';

const Router = require('koa-router');
const userAddress = new Router({
  prefix: '/api/user/address'
});
const mysql = require('../services/mysql');

module.exports = function (app) {
  userAddress

  //create new user address with user id
  .post('/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['address', requestJson];
    let r1 = yield mysql(q);
    let address = {};
    address.fk_UserAddress_userID = userID;
    address.fk_UserAddress_phoneID = r1.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['Address', userAddress];
    this.body = yield mysql(q2);
  })

  //grab user address based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? ON (?? = ??) WHERE ?? = ?';
    q.values = ['a.*', 'address', 'a', 'useraddress', 'ua', 'ua.fk_UserAddress_addressID', 'a.addressID', 'ua.fk_UserAddress_userID', userID];
    this.body = yield mysql(q);
  })

  // update user address based on address ID
  .put('/:addressID', function* () {
    let requestJson = this.request.body.fields;
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['address', requestJson, 'addressID', addressID];
    this.body = yield mysql(q);
  })

  // delete address by address id
  .delete('/:addressID', function* () {
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['address', 'addressID', addressID];
    this.body = yield mysql(q);
  });

  app.use(userAddress.routes())
    .use(userAddress.allowedMethods());
};
