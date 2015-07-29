'use strict';

const Router = require('koa-router');
const userSpecialty = new Router({
  prefix: '/api/userspecialty'
});
const query = require('../services/query');

module.exports = function (app) {
  userSpecialty

  //create new user specialty with user id
  .post('/user/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['specialty', requestJson];
    let r1 = yield query(q);
    let specialty = {};
    specialty.fk_UserSpecialty_userID = userID;
    specialty.fk_UserSpecialty_specialtyID = r1.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?;';
    q2.values = ['UserSpecialty', userSpecialty];
    this.body = yield query(q2);
  })

  //grab user specialty based on user id
  .get('/user/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    q.values = ['s.specialty', 'specialty', 's', 'UserSpecialty', 'us', 'us.fk_UserSpecialty_specialtyID', 's.specialtyID', 'us.fk_UserSpecialty_userID', userID];
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
