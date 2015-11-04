import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facilityphone';
const facilityPhoneApi = {};
import _ from 'lodash';

facilityPhoneApi.getFacilityPhone = (facilityID) => {
  return request
    .put(prefix + '/facility/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

facilityPhoneApi.addFacilityPhone = (facilityID, phoneNumber, ext, phoneType) => {
  const payload = _.omit({phoneNumber, ext, phoneType}, _.isNull);
  return request
    .post(prefix + '/facility/' + facilityID)
    .set(token)
    .send(payload)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

facilityPhoneApi.updateFacilityPhone = (facilityID, phoneID, phoneNumber, ext, phoneType) => {
  return request
    .put(prefix + '/facilit/' + facilityID + '/phone/' + phoneID)
    .set(token)
    .send({phoneNumber, ext, phoneType})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};


facilityPhoneApi.deleteFacilityPhone = (facilityID, phoneID) => {
  return request
    .delete(prefix + '/facilit/' + facilityID + '/phone/' + phoneID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default facilityPhoneApi;
