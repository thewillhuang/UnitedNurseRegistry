import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/user';
const userApi = {};

userApi.getUser = (userID) => {
  return request
    .get(`${prefix}/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userApi.updateUser = (userID, firstName, lastName, middleName, profilePic, email, userGeohash, dob) => {
  return request
    .put(`${prefix}/${userID}`)
    .send({firstName, lastName, middleName, profilePic, email, userGeohash, dob})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

userApi.deleteUser = (userID) => {
  return request
    .delete(`${prefix}/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

export default userApi;
