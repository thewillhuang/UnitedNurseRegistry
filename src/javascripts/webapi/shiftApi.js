import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '//api.unitednurseregistry.com/api/shift';
const shiftApi = {};

shiftApi.createShift = (facilityID, specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode) => {
  return request
    .post(`${prefix}/facility/${facilityID}`)
    .set(token)
    .send({facilityID, specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode})
    .endAsync().then((res) => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getShift = (shiftID) => {
  return request
    .get(`${prefix}/${shiftID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getAllHospitalShift = (facilityID) => {
  return request
    .get(`${prefix}/facility/${facilityID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getUserShift = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getShiftWithGeoHash = (geohash, hashSet, precision) => {
  return request
    .post(`${prefix}/geohash/${geohash}/precision/${precision}`)
    .set(token)
    .send({hashSet})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.updateShift = (facilityID, shiftID, specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode) => {
  return request
    .put(`${prefix}/facility/${facilityID}/shift/${shiftID}`)
    .set(token)
    .send({specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode})
    .endAsync().then((res) => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.deleteShift = (facilityID, shiftID) => {
  return request
    .delete(`${prefix}/facility/${facilityID}/shift/${shiftID}`)
    .set(token)
    .endAsync().then((res) => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

// getters for userID
shiftApi.getUserAccepted = (userID) => {
  return request
    .get(`${prefix}/accepted/user/${userID}`)
    .set(token)
    .endAsync().then(res=>{
      return res.body;
    }).catch(err=>{
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getUserPending = (userID) => {
  return request
    .get(`${prefix}/pending/user/${userID}`)
    .set(token)
    .endAsync().then(res=>{
      return res.body;
    }).catch(err=>{
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getUserCompleted = (userID) => {
  return request
    .get(`${prefix}/completed/user/${userID}`)
    .set(token)
    .endAsync().then(res=>{
      return res.body;
    }).catch(err=>{
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

// getters for facilityID
shiftApi.getActiveHospitalShift = (facilityID) => {
  return request
    .get(prefix + '/active/' + facilityID)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};


shiftApi.getOpenHospitalShift = (facilityID) => {
  return request
    .get(`${prefix}/open/${facilityID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};


shiftApi.getPendingHospitalShift = (facilityID) => {
  return request
    .get(`${prefix}/pending/${facilityID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getAcceptedHospitalShift = (facilityID) => {
  return request
    .get(`${prefix}/accepted/${facilityID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftApi.getCompletedHospitalShift = (facilityID) => {
  return request
    .get(`${prefix}/completed/${facilityID}`)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default shiftApi;
