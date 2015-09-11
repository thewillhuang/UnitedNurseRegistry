import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facilityAddress';
const facilityAddressApi = {};

facilityAddressApi.getFacilityAddress = (facilityID) => {
  return request
    .put(prefix + '/facility/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    });
};

facilityAddressApi.addFacilityAddress = (facilityID, address, address2, city, state, zip) => {
  return request
    .post(prefix + '/facility/' + facilityID)
    .set(token)
    .send({address, address2, city, state, zip})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

facilityAddressApi.updateFacilityAddress = (facilityID, addressID, address, address2, city, state, zip) => {
  return request
    .put(prefix + '/facilit/' + facilityID + '/address/' + addressID)
    .set(token)
    .send({address, address2, city, state, zip})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};


facilityAddressApi.deleteFacilityAddress = (facilityID, addressID) => {
  return request
    .delete(prefix + '/facilit/' + facilityID + '/address/' + addressID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    });
};

export default facilityAddressApi;
