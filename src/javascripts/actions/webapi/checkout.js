import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

const prefix = '/api/checkout';
const checkoutApi = {};

checkoutApi.checkout = (token) => {
  return request
    .post(prefix)
    .send({token})
    .endAsync().then(res => {
      return res.body;
    }).catch((e)=> {
      console.log(e);
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

export default checkoutApi;
