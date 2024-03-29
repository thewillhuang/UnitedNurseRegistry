import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '//api.unitednurseregistry.com/api/referral';
const referralApi = {};

referralApi.createUserReferral = (parentId) => {
  return request
    .post(prefix + '/user/' + parentId)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

referralApi.createFacilityReferral = (parentId) => {
  return request
    .post(prefix + '/facility/' + parentId)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

referralApi.getUserReferral = (userID) => {
  return request
    .get(prefix + '/user/' + userID)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

referralApi.getFacilityReferral = (userID) => {
  return request
    .get(prefix + '/facility/' + userID)
    .set(token)
    .endAsync().then(function (res) {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default referralApi;
