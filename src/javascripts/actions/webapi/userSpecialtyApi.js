import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/userspecialty';
const userSpecialtyApi = {};

userSpecialtyApi.createUserSpecialty = (userID, specialty) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({specialty})
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userSpecialtyApi.updateUserSpecialty = (userID, oldSpecialtyID, newSpecialtyID) => {
  return request
    .put(`${prefix}/user/${userID}/old/${oldSpecialtyID}/new/${newSpecialtyID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

userSpecialtyApi.getUserSpecialty = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userSpecialtyApi.deleteUserSpecialty = (userID, specialtyID) => {
  return request
    .delete(`${prefix}/user/${userID}/specialty/${specialtyID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

export default userSpecialtyApi;
