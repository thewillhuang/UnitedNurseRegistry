import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/shiftStatus';
const shiftStatusApi = {};

shiftStatusApi.grabShiftStatus = (shiftID) => {
  return request
    .post(`${prefix}/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.viewedShift = (shiftID, userID) => {
  return request
    .get(`${prefix}/viewed/shift/${shiftID}/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.getViewCount = (shiftID) => {
  return request
    .get(`${prefix}/viewed/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.markShiftAsComplete = (shiftID, facilityID) => {
  return request
    .put(`${prefix}/completed/shift/${shiftID}/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.markShiftAsPending = (shiftID, userID, facilityID) => {
  return request
    .put(`${prefix}/pending/shift/${shiftID}/user/${userID}/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.markShiftAsOpen = (shiftID, facilityID) => {
  return request
    .put(`${prefix}/open/shift/${shiftID}/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.viewOpenShiftsByHospitalID = (facilityID) => {
  return request
    .get(`${prefix}/open/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.viewAllShiftByUserID = (userID) => {
  return request
    .get(`${prefix}/open/user/${userID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.deleteFacilityReview = (facilityID) => {
  return request
    .get(`${prefix}/avg/facility/${facilityID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

shiftStatusApi.deleteUserReview = (shiftID, userID) => {
  return request
    .delete(`${prefix}/user/${userID}/shift/${shiftID}`)
    .set(token)
    .endAsync().then(res => {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};


export default shiftStatusApi;
