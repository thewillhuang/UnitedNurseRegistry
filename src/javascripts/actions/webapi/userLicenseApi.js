import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/userlicense';
const userLicenseApi = {};

userLicenseApi.createUserLicense = (userID, licenseNumber, licenseState, licensePhotoUrl, expiration) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({licenseNumber, licenseState, licensePhotoUrl, expiration})
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
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
    });
};

userLicenseApi.getUserLicense = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userLicenseApi.deleteUserAddress = (userID, userLicenseID) => {
  return request
    .delete(`${prefix}/user/${userID}/license/${userLicenseID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

export default userLicenseApi;
