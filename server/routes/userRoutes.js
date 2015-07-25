'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user
  //create user
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //create new user email with user id
  .post('/email/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['email', requestJson];
    let email = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
    let userEmailJson = {
      'fk_UserEmail_userID': userID,
      'fk_UserEmail_emailID': email.insertId
    };
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['useremail', userEmailJson];
    this.body = yield client.query(q2)
      .catch(function (err) {
        console.log(err);
      });
  })

  //create new user phone with user id
  .post('/phone/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['phone', requestJson];
    let phone = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
    let userPhoneJson = {
      'fk_UserPhone_userID': userID,
      'fk_UserPhone_phoneID': phone.insertId
    };
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['userphone', userPhoneJson];
    this.body = yield client.query(q2)
      .catch(function (err) {
        console.log(err);
      });
  })

  //create new user address with user id
  .post('/address/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['address', requestJson];
    let address = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
    let userAddressJson = {
      'fk_UserAddress_userID': userID,
      'fk_UserAddress_phoneID': address.insertId
    };
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['Address', userAddressJson];
    this.body = yield client.query(q2)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user table info based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['firstName', 'middleName', 'lastName', 'userGeoHash', 'user', 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user emails based on user id
  .get('/email/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'select ?? from ?? ?? join ?? ?? on (?? = ??) where ?? = ?';
    q.values = ['e.emailAddress', 'email', 'e', 'useremail', 'ue', 'ue.fk_UserEmail_emailID', 'e.emailID', 'ue.fk_UserEmail_userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user phone based on user id
  .get('/phone/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'select ?? from ?? ?? join ?? ?? on (?? = ??) where ?? = ?';
    q.values = ['p.*', 'phone', 'p', 'userphone', 'up', 'up.fk_UserPhone_phoneID', 'p.phoneID', 'ue.fk_UserPhone_userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  //grab user address based on user id
  .get('/address/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'select ?? from ?? ?? join ?? ?? on (?? = ??) where ?? = ?';
    q.values = ['a.*', 'address', 'a', 'useraddress', 'ua', 'ua.fk_UserAddress_addressID', 'a.phoneID', 'ua.fk_UserAddress_userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user data by user id
  .put('/:userID', function* () {
    let requestJson = this.request.body.fields;
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user email based on email ID
  .put('/email/:emailID', function* () {
    let requestJson = this.request.body.fields;
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['email', requestJson, 'emailID', emailID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user phone based on phone ID
  .put('/phone/:phoneID', function* () {
    let requestJson = this.request.body.fields;
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['phone', requestJson, 'phoneID', phoneID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // update user address based on address ID
  .put('/address/:addressID', function* () {
    let requestJson = this.request.body.fields;
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['address', requestJson, 'addressID', addressID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete user by user id
  .delete('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete useremail by email id
  .delete('/email/:emailID', function* () {
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['email', 'emailID', emailID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete phone by phone id
  .delete('/phone/:phoneID', function* () {
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['phone', 'phoneID', phoneID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  })

  // delete address by address id
  .delete('/address/:addressID', function* () {
    let addressID = this.params.addressID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['address', 'addressID', addressID];
    this.body = yield client.query(q)
      .catch(function (err) {
        console.log(err);
      });
  });

  app.use(user.routes())
    .use(user.allowedMethods());
};
