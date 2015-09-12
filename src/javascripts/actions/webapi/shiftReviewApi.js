import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/shift';
const shiftReviewApi = {};

shiftReviewApi.createUserReview = (userID, shiftID, review) => {
  return request
    .post(prefix + '/user/' + userID + '/shift/' + shiftID)
    .set(token)
    .send({review})
    .endAsync().then((res) => {
      return res.body;
    }).catch((err) => {
      return err;
    });
};

shiftReviewApi.getShift = (shiftID) => {
  return request
    .get(prefix + '/' + shiftID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    });
};

shiftReviewApi.getAllHospitalShift = (facilityID) => {
  return request
    .get(prefix + '/facility/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

shiftReviewApi.getActiveHospitalShift = (facilityID) => {
  return request
    .get(prefix + '/active/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

shiftReviewApi.getUserShift = (userID) => {
  return request
    .get(prefix + '/user/' + userID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

shiftReviewApi.getShiftWithGeoHash = (geohash, hashSet, precision) => {
  return request
    .post(prefix + '/geohash/' + userID + '/precision/' + precision)
    .set(token)
    .send({hashSet})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

shiftReviewApi.updateShift = (facilityID, shiftID, specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode) => {
  return request
    .put(prefix + '/facility/' + facilityID + '/shift/' + shiftID)
    .set(token)
    .send({specialtyID, shiftStartHour, shiftDuration, payPerHour, date, shiftDressCode})
    .endAsync().then((res) => {
      return res.body;
    }).catch((err) => {
      return err;
    });
};

shiftReviewApi.deleteShift = (facilityID, shiftID) => {
  return request
    .delete(prefix + '/facilit/' + facilityID + 'shift/' + shiftID)
    .set(token)
    .endAsync().then((res) => {
      return res.body;
    }).catch((err) => {
      return err;
    });
};


export default shiftReviewApi;
