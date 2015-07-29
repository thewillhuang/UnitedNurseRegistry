'use strict';

const Router = require('koa-router');
const userAddress = new Router({
  prefix: '/api/useraddress'
});
const query = require('../services/query');
// const withTransaction = require('../services/withTransaction');
// const transaction = require('../services/transaction');
// const getTransaction = require('../services/getTransaction');
// const Promise = require('bluebird');

module.exports = function (app) {
  userAddress

  //create new user address with user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['address', requestJson];
    let r1 = yield query(q);
    let address = {};
    address.fk_UserAddress_userID = userID;
    address.fk_UserAddress_addressID = r1.rows.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['userAddress', address];
    this.body = yield query(q2);

    // let userID = this.params.userID;
    // let requestJson = this.request.body.fields;
    // let q = {};
    // q.sql = 'INSERT INTO ?? SET ?';
    // q.values = ['address', requestJson];
    // let res = yield Promise.using(getTransaction(), function(tx){
    //   return tx.queryAsync(q).spread(function(rows, fields){
    //     console.log(rows, fields);
    //     let r1 = rows;
    //     let address = {};
    //     address.fk_UserAddress_userID = userID;
    //     address.fk_UserAddress_addressID = r1.rows.insertId;
    //     let q2 = {};
    //     q2.sql = 'INSERT INTO ?? SET ?';
    //     q2.values = ['userAddress', address];
    //     return tx.queryAsync(q2).spread(function(rows2, fields2){
    //       return {rows2, fields2};
    //     });
    //   });
    // });
    // this.body = res;

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
    let requestJson = this.request.body.fields;
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
