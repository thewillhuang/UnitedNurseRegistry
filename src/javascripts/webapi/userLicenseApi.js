import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '//api.unitednurseregistry.com/api/userlicense';
const userLicenseApi = {};

userLicenseApi.createUserLicense = (userID, licenseNumber, licenseState, licensePhotoUrl, expiration) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({licenseNumber, licenseState, licensePhotoUrl, expiration})
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userLicenseApi.updateUserLicense = (userID, userLicenseID, licenseNumber, licenseState, licensePhotoUrl, expiration) => {
  return request
    .put(`${prefix}/user/${userID}/license/${userLicenseID}`)
    .send({licenseNumber, licenseState, licensePhotoUrl, expiration})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userLicenseApi.getUserLicense = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userLicenseApi.deleteUserAddress = (userID, userLicenseID) => {
  return request
    .delete(`${prefix}/user/${userID}/license/${userLicenseID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default userLicenseApi;
