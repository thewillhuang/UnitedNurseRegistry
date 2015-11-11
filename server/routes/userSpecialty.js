'use strict';
const Router = require('koa-router');
const userSpecialty = new Router({
  prefix: '/api/userspecialty',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  userSpecialty

  // create new user specialty with user id
  .post('/user/:userID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?;';
      q.values = ['Specialty', requestJson];
      const q1 = {};
      q1.sql = 'SELECT * FROM ?? WHERE ?';
      q1.values = ['Specialty', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q1).spread(function(rows, fields) {
          // result from the select to see if theres a duplicate
          return {rows, fields};
        }).then(function(result) {
          // if there is a an existing specialty, return the result,
          return (result.rows.length !== 0)
          ? result
          // else make another query to get an insert id
          : tx.queryAsync(q).spread(function(rows, fields) {
            // return that for the next promise
            return {rows, fields};
          });
        }).then(function(result) {
          // construct the query to make the intersection table
          const specialty = {};
          specialty.fk_UserSpecialty_userID = userID;
          specialty.fk_UserSpecialty_specialtyID = result.rows.insertId || result.rows[0].specialtyID;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['UserSpecialty', specialty];
          return q2;
        }).then(function(q2) {
          // make the query and return the final result
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

  // grab user specialty based on user id
  .get('/user/:userID', function* () {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT s.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['Specialty', 's', 'UserSpecialty', 'us', 'us.fk_UserSpecialty_specialtyID', 's.specialtyID', 'us.fk_UserSpecialty_userID', userID];
    this.body = yield query(q);
  })

  // grab a list of IDs
  .get('/', function* () {
    const q = {};
    q.sql = 'SELECT * FROM ??';
    q.values = ['Specialty'];
    this.body = yield query(q);
  })

  .post('/new/:specialty', function* () {
    const specialty = this.params.specialty;
    const q = {};
    q.sql = 'SELECT * FROM ?? WHERE ?? = ?';
    q.values = ['Specialty', 'specialty', specialty];
    const result1 = yield query(q);
    if (result1.rows.length === 0) {
      const q2 = {};
      q2.payload = {specialty: specialty};
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.values = ['Specialty', q2.payload];
      const result2 = yield query(q2);
      this.body = {
        specialty: specialty,
        specialtyID: result2.rows.insertId,
      };
    } else {
      this.body = result1.rows[0];
    }
  })

  // update user specialty by userID, old specialty Id, new specialty ID
  .put('/user/:userID/old/:oldSpecialtyID/new/:newSpecialtyID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const oldSpecialtyID = this.params.oldSpecialtyID;
      const newSpecialtyID = this.params.newSpecialtyID;
      const q = {};
      q.sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?';
      q.values = ['UserSpecialty', 'fk_UserSpecialty_specialtyID', newSpecialtyID, 'fk_UserSpecialty_userID', userID, 'fk_UserSpecialty_specialtyID', oldSpecialtyID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user specialty by user id and specialty id
  .delete('/user/:userID/specialty/:specialtyID', function* () {
    const user = this.passport.user;
    const userID = this.params.userID;
    if (user.scope.userID && user.scope.userID.toString() === userID) {
      const specialtyID = this.params.specialtyID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
      q.values = ['UserSpecialty', 'fk_UserSpecialty_userID', userID, 'fk_UserSpecialty_specialtyID', specialtyID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(userSpecialty.routes())
    .use(userSpecialty.allowedMethods());
};
