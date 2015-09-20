import Promise from 'bluebird';
import superagent from 'superagent';
import token from '../../utils/grabToken.js';
const request = Promise.promisifyAll(superagent);
const prefix = '/api/geohash';
const geoHashApi = {};

geoHashApi.addressLatLng = (address) => {
  return request
    .post(prefix + '/')
    .set(token)
    .send({address})
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      window.sessionStorage.clear();
      window.location.assign('#/home');
      return err;
    });
};

export default geoHashApi;
