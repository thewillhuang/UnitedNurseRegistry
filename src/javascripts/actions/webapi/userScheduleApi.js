import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/userschedule';
const userScheduleApi = {};

userScheduleApi.createUserSchedule = (userID, shiftStart, shiftDuration, dayOfWeek) => {
  return request
    .post(`${prefix}/user/${userID}`)
    .set(token)
    .send({shiftStart, shiftDuration, dayOfWeek})
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

userScheduleApi.updateUserSchedule = (userID, scheduleID, shiftStart, shiftDuration, dayOfWeek) => {
  return request
    .put(`${prefix}/user/${userID}/schedule/${scheduleID}`)
    .send({shiftStart, shiftDuration, dayOfWeek})
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

userScheduleApi.getUserSchedule = (userID) => {
  return request
    .get(`${prefix}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

userScheduleApi.deleteUserAddress = (userID, userScheduleID) => {
  return request
    .delete(`${prefix}/user/${userID}/schedule/${userScheduleID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

export default userLicenseApi;
