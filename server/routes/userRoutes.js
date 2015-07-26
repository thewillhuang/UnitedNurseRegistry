'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const query = require('../service/query');

module.exports = function (app) {
  user
  // post routes ---------------

  //create user
  .post('/', function* () {
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['user', requestJson];
    this.body = yield query(q);
  })

  //create user license given user id
  .post('/license/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserLicense_userID = userID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserLicense', requestJson];
    this.body = yield query(q);
  })

  //create user schedule given user id
  .post('/userschedule/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserSchedule_userID = userID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserSchedule', requestJson];
    this.body = yield query(q);
  })

  //create user schedule given user id
  .post('/userworkhistory/:userID/:facilityID', function* () {
    let userID = this.params.userID;
    let facilityID = this.params.facilityID;
    let requestJson = this.request.body.fields;
    let q = {};
    requestJson.fk_UserSchedule_userID = userID;
    requestJson.fk_UserWorkHistory_facilityID = facilityID;
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['UserSchedule', requestJson];
    this.body = yield query(q);
  })

  //create new user specialty with user id
  .post('/specialty/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['specialty', requestJson];
    let specialty = yield query(q);
    let userSpecialty = {};
    userSpecialty.fk_UserSpecialty_userID = userID;
    userSpecialty.fk_UserSpecialty_specialtyID = specialty.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?;';
    q2.values = ['UserSpecialty', userSpecialty];
    this.body = yield query(q2);
  })

  //create new user email with user id
  .post('/email/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?;';
    q.values = ['email', requestJson];
    let email = yield query(q);
    let userEmail = {};
    userEmail.fk_UserEmail_userID = userID;
    userEmail.fk_UserEmail_emailID = email.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?;';
    q2.values = ['useremail', userEmail];
    this.body = yield query(q2);
  })

  //create new user phone with user id
  .post('/phone/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['phone', requestJson];
    let phone = yield query(q);
    let userPhone = {};
    userPhone.fk_UserPhone_userID = userID;
    userPhone.fk_UserPhone_phoneID = phone.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['userphone', userPhone];
    this.body = yield query(q2);
  })

  //create new user address with user id
  .post('/address/:userID', function* () {
    let userID = this.params.userID;
    let requestJson = this.request.body.fields;
    let q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['address', requestJson];
    let address = yield query(q);
    let userAddress = {};
    userAddress.fk_UserAddress_userID = userID;
    userAddress.fk_UserAddress_phoneID = address.insertId;
    let q2 = {};
    q2.sql = 'INSERT INTO ?? SET ?';
    q2.values = ['Address', userAddress];
    this.body = yield query(q2);
  })

  // get routes ---------------

  //grab user table info based on user id
  .get('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ??, ??, ?? FROM ?? WHERE ?? = ?';
    let select = ['firstName', 'middleName', 'lastName', 'userGeoHash', 'dob'];
    q.values = [select, 'user', 'userID', userID];
    this.body = yield query(q);
  })

  //grab user schedule info based on user id
  .get('/userschedule/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ??, ?? FROM ?? WHERE ?? = ?';
    let select = ['userScheduleID', 'shiftStart', 'shiftDuration', 'dayOfWeek'];
    q.values = [select, 'UserSchedule', 'fk_UserSchedule_userID', userID];
    this.body = yield query(q);
  })

  //grab user table info based on user id
  .get('/userlicense/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ?? FROM ?? WHERE ?? = ?';
    let select = ['licenseNumber', 'licenseState', 'licensePhotoUrl'];
    q.values = [select, 'UserLicense', 'fk_UserLicense_userID', userID];
    this.body = yield query(q);
  })

  //grab user specialty based on user id
  .get('/specialty/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let on = ['us.fk_UserSpecialty_specialtyID', 's.specialtyID'];
    let where = ['us.fk_UserSpecialty_userID', userID];
    q.values = ['s.specialty', 'specialty', 's', 'UserSpecialty', 'us', on, where];
    this.body = yield query(q);
  })

  //grab user work history based on user id
  .get('/userworkhistory/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ??, ??, ??, ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let select = ['f.facilityID', 'f.facilityName', 'uwh.months', 'uwh.referenceName', 'uwh.referencePhone'];
    let on = ['uwh.fk_UserWorkHistory_facilityID', 'f.facilityID'];
    let where = ['us.fk_UserWorkHistory_userID', userID];
    q.values = [select, 'UserWorkHistory', 'uwh', 'Facility', 'f', on, where];
    this.body = yield query(q);
  })

  //grab user emails based on user id
  .get('/email/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let on = ['ue.fk_UserEmail_emailID', 'e.emailID'];
    let where = ['ue.fk_UserEmail_userID', userID];
    q.values = ['e.emailAddress', 'email', 'e', 'useremail', 'ue', on, where];
    this.body = yield query(q);
  })

  //grab user phone based on user id
  .get('/phone/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? AS ?? INNER JOIN ?? AS ?? on (?? = ??) WHERE ?? = ?';
    let on = ['up.fk_UserPhone_phoneID', 'p.phoneID'];
    let where = ['ue.fk_UserPhone_userID', userID];
    q.values = ['p.*', 'phone', 'p', 'userphone', 'up', on, where];
    this.body = yield query(q);
  })

  //grab user address based on user id
  .get('/address/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'SELECT ?? FROM ?? ?? INNER JOIN ?? ?? ON (?? = ??) WHERE ?? = ?';
    let on = ['ua.fk_UserAddress_addressID', 'a.addressID'];
    let where = ['ua.fk_UserAddress_userID', userID];
    q.values = ['a.*', 'address', 'a', 'useraddress', 'ua', on, where];
    this.body = yield query(q);
  })

  // put routes ---------------

  // update user data by user id
  .put('/:userID', function* () {
    let requestJson = this.request.body.fields;
    let userID = this.params.userID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['user', requestJson, 'userID', userID];
    this.body = yield query(q);
  })

  // update user schedule by schedule id
  .put('/userschedule/:scheduleID', function* () {
    let requestJson = this.request.body.fields;
    let scheduleID = this.params.scheduleID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserSchedule', requestJson, 'scheduleID', scheduleID];
    this.body = yield query(q);
  })

  // update UserLicense by license id
  .put('/UserLicense/:UserLicenseID', function* () {
    let requestJson = this.request.body.fields;
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserLicense', requestJson, 'userLicenseID', userLicenseID];
    this.body = yield query(q);
  })

  // update user specialty by specialty id
  .put('/UserSpecialty/:UserSpecialtyID/:newID', function* () {
    // let requestJson = this.request.body.fields;
    let UserSpecialtyID = this.params.UserSpecialtyID;
    let newID = this.params.newID;
    let q = {};
    q.sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    q.values = ['UserSpecialty', 'fk_UserSpecialty_specialtyID', newID, 'fk_UserSpecialty_specialtyID', UserSpecialtyID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/UserWorkHistory/:userHistoryID', function* () {
    let requestJson = this.request.body.fields;
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['UserWorkHistory', requestJson, 'userHistoryID', userHistoryID];
    this.body = yield query(q);
  })

  // update user email based on email ID
  .put('/email/:emailID', function* () {
    let requestJson = this.request.body.fields;
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['email', requestJson, 'emailID', emailID];
    this.body = yield query(q);
  })

  // update user phone based on phone ID
  .put('/phone/:phoneID', function* () {
    let requestJson = this.request.body.fields;
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
    q.values = ['phone', requestJson, 'phoneID', phoneID];
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

  // delete routes ---------------

  // delete user by user id
  .delete('/:userID', function* () {
    let userID = this.params.userID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['user', 'userID', userID];
    this.body = yield query(q);
  })

  // delete user schedule by schedule id
  .delete('/UserSchedule/:userScheduleID', function* () {
    let userScheduleID = this.params.userScheduleID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserSchedule', 'userScheduleID', userScheduleID];
    this.body = yield query(q);
  })

  // delete user license by license id
  .delete('/UserLicense/:userLicenseID', function* () {
    let userLicenseID = this.params.userLicenseID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserLicense', 'userLicenseID', userLicenseID];
    this.body = yield query(q);
  })

  // delete user specialty by user id and specialty id
  .delete('/UserSpecialty/:userID/:specialtyID', function* () {
    let userID = this.params.userID;
    let specialtyID = this.params.specialtyID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ? AND ?? = ?';
    q.values = ['UserSpecialty', 'fk_UserSpecialty_userID', userID, 'fk_UserSpecialty_specialtyID', specialtyID];
    this.body = yield query(q);
  })

  // delete user specialty by user id and specialty id
  .delete('/UserWorkHistory/:userHistoryID', function* () {
    let userHistoryID = this.params.userHistoryID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['UserWorkHistory', 'userHistoryID', userHistoryID];
    this.body = yield query(q);
  })

  // delete useremail by email id
  .delete('/email/:emailID', function* () {
    let emailID = this.params.emailID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['email', 'emailID', emailID];
    this.body = yield query(q);
  })

  // delete phone by phone id
  .delete('/phone/:phoneID', function* () {
    let phoneID = this.params.phoneID;
    let q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['phone', 'phoneID', phoneID];
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

  app.use(user.routes())
    .use(user.allowedMethods());
};
