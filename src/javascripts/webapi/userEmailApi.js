import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '//api.unitednurseregistry.com/api/useremail';
const userEmailApi = {};

userEmailApi.createUserEmail = (userID, emailAddress, emailType) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .send({emailAddress, emailType})
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userEmailApi.updateUserEmail = (userID, emailID, emailAddress, emailType) => {
  return request
    .put(`${prefix}/user/${userID}/email/${emailID}`)
    .send({emailAddress, emailType})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userEmailApi.getUserEmail = (userID) => {
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

userEmailApi.deleteUserAddress = (userID, emailID) => {
  return request
    .delete(`${prefix}/user/${userID}/email/${emailID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default userEmailApi;
