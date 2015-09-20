import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/useraddress';
const userAddressApi = {};

userAddressApi.createUserAddress = (userID, address, address2, city, state, zip, geohash) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({address, address2, city, state, zip, geohash})
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userAddressApi.updateUserAddress = (userID, addressID, address, address2, city, state, zip, geohash) => {
  return request
    .put(`${prefix}/user/${userID}/address/${addressID}`)
    .send({address, address2, city, state, zip, geohash})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userAddressApi.getUserAddress = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

userAddressApi.deleteUserAddress = (userID, addressID) => {
  return request
    .delete(`${prefix}/user/${userID}/address/${addressID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('/');
      return err;
    });
};

export default userAddressApi;
