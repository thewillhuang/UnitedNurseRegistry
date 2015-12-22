import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = 'http://api.unitednurseregistry.com/api/userphone';
const userPhoneApi = {};

userPhoneApi.createUserPhone = (userID, phoneNumber, ext, phoneType) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({phoneNumber, ext, phoneType})
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userPhoneApi.updateUserPhone = (userID, phoneID, phoneNumber, ext, phoneType) => {
  return request
    .put(`${prefix}/user/${userID}/phone/${phoneID}`)
    .send({phoneNumber, ext, phoneType})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userPhoneApi.getUserPhone = (userID) => {
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

userPhoneApi.deleteUserAddress = (userID, phoneID) => {
  return request
    .delete(`${prefix}/user/${userID}/phone/${phoneID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default userPhoneApi;
