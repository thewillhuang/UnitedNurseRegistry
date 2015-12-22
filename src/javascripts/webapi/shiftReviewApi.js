import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = 'http://api.unitednurseregistry.com/api/shiftReview';
const shiftReviewApi = {};

shiftReviewApi.createUserReview = (shiftID, review) => {
  return request
    .post(`${prefix}/user/${shiftID}`)
    .set(token)
    .send({review})
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.updateUserReview = (shiftID, review) => {
  return request
    .get(`${prefix}/user/${shiftID}`)
    .send({review})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.createFacilityReview = (shiftID, review) => {
  return request
    .post(`${prefix}/facility/${shiftID}`)
    .send({review})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.updateFacilityReview = (shiftID, review) => {
  return request
    .put(`${prefix}/facility/${shiftID}`)
    .send({review})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.getUserReview = (shiftID) => {
  return request
    .get(`${prefix}/user/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.getFacilityReview = (shiftID) => {
  return request
    .get(`${prefix}/user/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.getAvgFacilityReview = (shiftID) => {
  return request
    .get(`${prefix}/user/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.getAvgUserReview = (userID) => {
  return request
    .get(`${prefix}/avg/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.deleteFacilityReview = (facilityID) => {
  return request
    .get(`${prefix}/avg/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

shiftReviewApi.deleteUserReview = (shiftID, userID) => {
  return request
    .delete(`${prefix}/user/${userID}/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};


export default shiftReviewApi;
