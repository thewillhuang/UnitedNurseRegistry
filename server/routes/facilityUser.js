'use strict';

const Router = require('koa-router');
const facilityuser = new Router({
  prefix: '/api/facilityuser',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  facilityuser

  // create new facility user with facility id
  .post('/facility/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      // console.log(requestJson);
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['User', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q).then(function(rows) {
          return {rows};
        }).then(function(result) {
          // console.log(result);
          const userData = {};
          userData.fk_facilityuser_facilityID = facilityID;
          userData.fk_facilityuser_userID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?';
          q2.values = ['FacilityUser', userData];
          return q2;
        }).then(function(q2) {
          return tx.queryAsync(q2).then(function(rows) {
            return {rows};
          });
        }).catch(function(error)  {
          return error;
        });
      });
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // grab facility user based on facility id
  .get('/facility/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const q = {};
      q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
      const select = [
        'u.userID',
        'u.firstName',
        'u.middleName',
        'u.lastName',
        'u.userGeoHash',
        'u.dob',
        'u.email',
      ];
      q.values = [select, 'User', 'u', 'FacilityUser', 'fu', 'fu.fk_facilityuser_userID', 'u.userID', 'fu.fk_facilityuser_facilityID', facilityID];
      // console.log(q);
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // update facility user based on user ID
  .put('/facility/:facilityID/user/:userID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const userID = this.params.userID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['User', requestJson, 'userID', userID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete user by user id
  .delete('/facility/:facilityID/user/:userID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const userID = this.params.userID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['User', 'userID', userID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(facilityuser.routes())
    .use(facilityuser.allowedMethods());
};
