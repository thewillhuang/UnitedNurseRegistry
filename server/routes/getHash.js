'use strict';
const config = require('../config');
const Router = require('koa-router');
const geohash = new Router({
  prefix: '/api/geohash',
});
const query = require('../services/query');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('superagent'));
const API_KEY = config.googlePlacesApi.API_KEY;
const googleUrl = config.googlePlacesApi.googleUrl;

module.exports = function authRoutes(app) {
  geohash

  .post('/', function* convertToGeoHash() {
    // console.log(this.request.body);
    if (this.request.body.address) {
      const address = this.request.body.address.replace(/\s+/g, '+');
      const q = {};
      q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
      q.values = ['lat', 'lng', 'Geohash', 'address', address];
      const dbquery = yield query(q);
      // if theres nothing, ask google
      // console.log(dbquery);
      if (!dbquery.rows.length) {
        // console.log('google', dbquery.rows);
        const url = googleUrl + address + API_KEY;
        const response = yield request.get(url)
        .endAsync().then(function (res) {
          // console.log(res.body.results[0].geometry.location);
          return res.body.results[0].geometry.location;
        }).catch(function (err) {
          return err;
        });

        // store the result for future use.
        const q2 = {};
        q2.sql = 'INSERT INTO ?? SET ?';
        const payload = {
          address: address,
          lat: response.lat,
          lng: response.lng,
        };
        q2.values = ['Geohash', payload];
        yield query(q2);
        this.body = yield response;
      } else {
        // console.log('no google', dbquery.rows[0]);
        this.body = dbquery.rows[0];
      }
    } else {
      this.status = 400;
    }
  });

  app.use(geohash.routes())
    .use(geohash.allowedMethods());
};
