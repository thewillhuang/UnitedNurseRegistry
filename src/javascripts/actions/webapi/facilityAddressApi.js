import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
import _ from 'lodash';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facilityAddress';
const facilityAddressApi = {};

facilityAddressApi.getFacilityAddress = (facilityID) => {
  return request
    .put(prefix + '/facility/' + facilityID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(()=> {
      window.sessionStorage.clear();
    });
};

facilityAddressApi.addFacilityAddress = (facilityID, address, address2, city, state, zip) => {
  return request
    .post(prefix + '/facility/' + facilityID)
    .set(token)
    .send(_.omit({address, address2, city, state, zip}, _.isNull))
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    }).catch(()=> {
      window.sessionStorage.clear();
      window.location.assign('#/home');
    });
};

facilityAddressApi.updateFacilityAddress = (facilityID, addressID, address, address2, city, state, zip) => {
  return request
    .put(`${prefix}/facility/${facilityID}/address/${addressID}`)
    .set(token)
    .send(_.omit({address, address2, city, state, zip}, _.isNull))
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};


facilityAddressApi.deleteFacilityAddress = (facilityID, addressID) => {
  return request
    .delete(prefix + '/facilit/' + facilityID + '/address/' + addressID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

export default facilityAddressApi;
