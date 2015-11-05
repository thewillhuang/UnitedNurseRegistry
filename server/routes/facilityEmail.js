'use strict';

const Router = require('koa-router');
const facilityEmail = new Router({
  prefix: '/api/facilityemail',
});
const query = require('../services/query');
const getTransaction = require('../services/getTransaction');
const Promise = require('bluebird');

module.exports = function(app) {
  facilityEmail

  // create new user email with user id
  .post('/facility/:facilityID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?;';
      q.values = ['Email', requestJson];
      this.body = yield Promise.using(getTransaction(), function(tx) {
        return tx.queryAsync(q).spread(function(rows, fields) {
          return {rows, fields};
        }).then(function(result) {
          const email = {};
          email.fk_facilityEmail_facilityID = facilityID;
          email.fk_facilityEmail_emailID = result.rows.insertId;
          const q2 = {};
          q2.sql = 'INSERT INTO ?? SET ?;';
          q2.values = ['FacilityEmail', email];
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

  // grab user emails based on user id
  .get('/facility/:facilityID', function* () {
    const facilityID = this.params.facilityID;
    const q = {};
    q.sql = 'SELECT e.* FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['Email', 'e', 'FacilityEmail', 'fe', 'fe.fk_facilityEmail_emailID', 'e.emailID', 'fe.fk_facilityEmail_facilityID', facilityID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/facility/:facilityID/email/:emailID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const requestJson = this.request.body;
      const emailID = this.params.emailID;
      const q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['Email', requestJson, 'emailID', emailID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  })

  // delete useremail by email id
  .delete('/facility/:facilityID/email/:emailID', function* () {
    const user = this.passport.user;
    const facilityID = this.params.facilityID;
    if (user.scope.facilityID && user.scope.facilityID.toString() === facilityID) {
      const emailID = this.params.emailID;
      const q = {};
      q.sql = 'DELETE FROM ?? WHERE ?? = ?';
      q.values = ['Email', 'emailID', emailID];
      this.body = yield query(q);
    } else {
      this.body = {message: 'no permission'};
    }
  });

  app.use(facilityEmail.routes())
    .use(facilityEmail.allowedMethods());
};
