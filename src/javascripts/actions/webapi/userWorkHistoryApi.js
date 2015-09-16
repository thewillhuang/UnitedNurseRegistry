import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/userworkhistory';
const userWorkHistoryApi = {};

userWorkHistoryApi.createUserWorkHistory = (userID, facilityID, months, referenceName, referencePhone) => {
  return request
    .post(`${prefix}/user/${userID}/facility/${facilityID}`)
    .set(token)
    .send({months, referenceName, referencePhone})
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userWorkHistoryApi.updateUserWorkHistory = (userID, userHistoryID, facilityID, months, referenceName, referencePhone) => {
  const fk_UserWorkHistory_facilityID = facilityID;
  return request
    .put(`${prefix}/user/${userID}/history/${userHistoryID}`)
    .set(token)
    .send({fk_UserWorkHistory_facilityID, months, referenceName, referencePhone})
    .endAsync().then(res => {
      return res.body;
    });
};

userWorkHistoryApi.getUserWorkHistory = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(err => {
      return err;
    });
};

userWorkHistoryApi.deleteUserWorkHistory = (userID, userHistoryID) => {
  return request
    .delete(`${prefix}/user/${userID}/history/${userHistoryID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    });
};

export default userWorkHistoryApi;
