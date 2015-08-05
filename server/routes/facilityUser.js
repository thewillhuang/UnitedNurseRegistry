'use strict';

const Router = require('koa-router');
const facilityuser = new Router({
  prefix: '/api/facilityuser'
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  facilityuser

  //create new facility user with facility id
  .post('/facility/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield Promise.using(getTransaction(), function(tx){
      return tx.queryAsync(q).spread(function(rows, fields){
        return {rows, fields};
      }).then(function(result){
        // console.log(result);
        let user = {};
        user.fk_facilityuser_facilityID = facilityID;
        user.fk_facilityuser_userID = result.rows.insertId;
        let q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?';
        q2.values = ['facilityuser', user];
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

  //grab facility user based on facility id
  .get('/facility/:facilityID', function* () {
    let facilityID = this.params.facilityID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let select = [
      'u.userID',
      'u.firstName',
      'u.middleName',
      'u.lastName',
      'u.userGeoHash',
      'u.dob',
      'u.userName'
    ];
    q.values = [select, 'user', 'u', 'facilityuser', 'fu', 'fu.fk_facilityuser_userID', 'u.userID', 'fu.fk_facilityuser_facilityID', facilityID];
    // console.log(q);
    this.body = yield query(q);
  })

  // update facility user based on user ID
  .put('/user/:userID', function* () {
    let requestJson = this.request.body.fields;
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield query(q);
  })

  // delete user by user id
  .delete('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield query(q);
  });

  app.use(facilityuser.routes())
    .use(facilityuser.allowedMethods());
};
