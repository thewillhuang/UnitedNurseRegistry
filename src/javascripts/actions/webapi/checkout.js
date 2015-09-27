import Promise from 'bluebird';
import superagent from 'superagent';
import jwt from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);

const prefix = '/api/checkout';
const checkoutApi = {};

// checkoutApi.saveCharges = (token, shiftID, price) => {
//   return request
//     .post(`${prefix}/shift/${shiftID}/price/${price}`)
//     .set(jwt)
//     .send({token})
//     .endAsync().then(res => {
//       return res.body;
//     }).catch((e)=> {
//       console.log(e);
//       window.sessionStorage.clear();
//       window.location.assign('/');
//     });
// };

checkoutApi.charge = (shiftID) => {
  return request
    .post(`${prefix}/charge/shift/${shiftID}`)
    .set(jwt)
    .endAsync().then(res => {
      return res.body;
    }).catch(e=> {
      console.log(e);
      window.sessionStorage.clear();
      window.location.assign('/');
    });
};

export default checkoutApi;
