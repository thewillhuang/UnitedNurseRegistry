import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facility';
const facilityApi = {};

console.log(token);

facilityApi.getFacilityInfo = (facilityID) => {
  return request
    .get(prefix + '/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    });
};

facilityApi.updateFacilityInfo = (facilityID, facilityEmail, facilityName, facilityGeohash, facilityPwHash, facilityEMR) => {
  return request
    .put(prefix + '/' + facilityID)
    .set(token)
    .send({facilityID, facilityEmail, facilityName, facilityGeohash, facilityPwHash, facilityEMR})
    .endAsync().then(function(res) {
      return res.body;
    });
};

facilityApi.deleteFacility = (facilityID) => {
  return request
    .delete(prefix + '/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    });
};

export default facilityApi;
