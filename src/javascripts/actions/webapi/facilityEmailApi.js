import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/facilityemail';
const facilityEmailApi = {};

facilityEmailApi.getFacilityEmail = (facilityID) => {
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

facilityEmailApi.addFacilityEmail = (facilityID, emailAddress, emailType) => {
  return request
    .post(prefix + '/facility/' + facilityID)
    .set(token)
    .send({emailAddress, emailType})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

facilityEmailApi.updateFacilityEmail = (facilityID, emailID, emailAddress, emailType) => {
  return request
    .put(prefix + '/facilit/' + facilityID + '/email/' + emailID)
    .set(token)
    .send({emailAddress, emailType})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};


facilityEmailApi.deleteFacilityEmail = (facilityID, emailID) => {
  return request
    .delete(prefix + '/facilit/' + facilityID + '/email/' + emailID)
    .set(token)
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default facilityEmailApi;
