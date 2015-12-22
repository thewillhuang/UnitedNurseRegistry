import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

const prefix = 'api.unitednurseregistry.com/api/auth';
const authApi = {};

authApi.getFacebook = () => {
  return request
    .get(prefix + '/facebook')
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

authApi.login = (email, password) => {
  return request
    .post(prefix + '/login')
    .send({email, password})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

authApi.facilityLogin = (email, password) => {
  return request
    .post(prefix + '/facility/login')
    .send({email, password})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

authApi.facilitySignup = (email, password) => {
  return request
    .post(prefix + '/facility/signup')
    .send({email, password})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

authApi.signup = (email, password) => {
  return request
    .post(prefix + '/siguup')
    .send({email, password})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

export default authApi;
