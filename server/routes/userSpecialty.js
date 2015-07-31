'use strict';

const Router = require('koa-router');
const userSpecialty = new Router({
  prefix: '/api/userspecialty'
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function (app) {
  userSpecialty

  //create new user specialty with user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['Specialty', requestJson];
    let q1 = {};
    q1.sql = 'SELECT * FROM ?? WHERE ?';
    q1.values = ['specialty', requestJson];
    this.body = yield Promise.using(getTransaction(), function(tx){
      return tx.queryAsync(q1).spread(function(rows, fields){
        // result from the select to see if theres a duplicate
        return {rows, fields};
      }).then(function(result){
        // if there is a specialtyID, return the result,
        return (result.rows.length !== 0)
        ? result
        // else make another query to get an insert id
        : tx.queryAsync(q).spread(function(rows, fields){
            return {rows, fields};
          });
      }).then(function(result){
        // construct the query to make the intersection table
        let specialty = {};
        specialty.fk_UserSpecialty_userID = userID;
        specialty.fk_UserSpecialty_specialtyID = result.rows.insertId || result.rows[0].specialtyID;
        let q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?';
        q2.values = ['UserSpecialty', specialty];
        return q2;
      }).then(function(q2){
        // make the query and return the final result
        return tx.queryAsync(q2).spread(function(rows, fields){
          return {rows, fields};
        });
      }).catch(function(error){
        return error;
      });
    });
  })

  //grab user specialty based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT s.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['specialty', 's', 'UserSpecialty', 'us', 'us.fk_UserSpecialty_specialtyID', 's.specialtyID', 'us.fk_UserSpecialty_userID', userID];
    this.body = yield query(q);
  })

  // update user specialty by userID, old specialty Id, new specialty ID
  .put('/user/:userID/old/:oldSpecialtyID/new/:newSpecialtyID', function* () {
    let userID = this.params.userID;
    let oldSpecialtyID = this.params.oldSpecialtyID;
    let newSpecialtyID = this.params.newSpecialtyID;
    let q = {};
    q.sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?';
    q.values = ['UserSpecialty', 'fk_UserSpecialty_specialtyID', newSpecialtyID, 'fk_UserSpecialty_userID', userID, 'fk_UserSpecialty_specialtyID', oldSpecialtyID];
    this.body = yield query(q);
  })

  // delete user specialty by user id and specialty id
  .delete('/user/:userID/specialty/:specialtyID', function* () {
    let userID = this.params.userID;
    let specialtyID = this.params.specialtyID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['UserSpecialty', 'fk_UserSpecialty_userID', userID, 'fk_UserSpecialty_specialtyID', specialtyID];
    this.body = yield query(q);
  });

  app.use(userSpecialty.routes())
    .use(userSpecialty.allowedMethods());
};
