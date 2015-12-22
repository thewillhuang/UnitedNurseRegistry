import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

const prefix = 'http://api.unitednurseregistry.com/api/beta';
const betaApi = {};

betaApi.signup = (email, password) => {
  return request
    .post(prefix + '/signup')
    .send({email, password})
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

betaApi.getAllBeta = () => {
  return request
    .post(prefix + '/signup')
    .endAsync().then(function (res) {
      return res.body;
    }).catch(() => {
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

export default betaApi;
