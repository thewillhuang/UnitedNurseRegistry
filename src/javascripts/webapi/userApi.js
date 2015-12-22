import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = 'http://api.unitednurseregistry.com/api/user';
const userApi = {};
import _ from 'lodash';

userApi.getUser = (userID) => {
  return request
    .get(`${prefix}/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userApi.updateUser = (userID, firstName, lastName, middleName, profilePic, email, userGeohash, dob) => {
  const payload = _.omit({userID, firstName, lastName, middleName, profilePic, email, userGeohash, dob}, _.isNull);
  return request
    .put(`${prefix}/${userID}`)
    .send(payload)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userApi.deleteUser = (userID) => {
  return request
    .delete(`${prefix}/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function (err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default userApi;
