import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facility';
const facilityApi = {};
import _ from 'lodash';

// console.log(token);

facilityApi.getFacilityInfo = (facilityID) => {
  return request
    .get(prefix + '/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#home');
      return err;
    });
};

facilityApi.updateFacilityInfo = (facilityID, facilityEmail, facilityName, facilityGeohash, facilityPwHash, facilityEMR) => {
  const payload = _.omit({facilityID, facilityEmail, facilityName, facilityGeohash, facilityPwHash, facilityEMR}, _.isNull);
  console.log(payload);
  return request
    .put(`${prefix}/${facilityID}`)
    .set(token)
    .send(payload)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#home');
      return err;
    });
};

facilityApi.deleteFacility = (facilityID) => {
  return request
    .delete(prefix + '/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#home');
      return err;
    });
};

export default facilityApi;
