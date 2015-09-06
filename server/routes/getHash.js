'use strict';

const Router = require('koa-router');
const geohash = new Router({
  prefix: '/api/geohash',
});
const query = require('../services/query');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('superagent'));
const API_KEY = '&key=' + 'AIzaSyCYjPRBL33MXDv_Z230il4oibGj607wdTI';

module.exports = function authRoutes(app) {
  geohash

  .post('/', function* convertToGeoHash() {
    console.log(this.request.body);
    const address = this.request.body.address.replace(/\s+/g, '+');
    console.log(address);
    // first check our own database before asking google
    const q = {};
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['lat', 'lng', 'geohash', 'address', address];
    const dbquery = yield query(q);
    if (!dbquery.rows.length) {
      console.log(dbquery);
      const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
      const url = googleUrl + address + API_KEY;
      const response = request.get(url)
      .endAsync().then(function(res) {
        console.log(res.body.results[0].geometry.location);
        return res.body.results[0].geometry.location;
      }).catch(function(err) {
        return err;
      });
      this.body = yield response;
      const q2 = {};
      q2.sql = 'INSERT INTO ?? SET ?';
      q2.payload = {
        address: address,
        lat: response.lat,
        lng: response.lng,
      };
      q2.values = ['geohash', q2.payload];
    } else {
      console.log(dbquery);
      this.body = dbquery;
    }
  });

  app.use(geohash.routes())
    .use(geohash.allowedMethods());
};
