'use strict';

import shiftConst from '../constants/shiftConstants.js';
import geohash from 'ngeohash';
const shiftDispatcher = require('../dispatcher/userDispatcher.js');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('superagent'));

const shiftActions = {};

shiftActions.getLocation = (cb) => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const success = (pos) => {
    const geoHash = geohash.encode(pos.coords.latitude, pos.coords.longitude, 4);
    const geoHashSet = geohash.neighbors(geoHash);
    shiftActions.queryDb(geoHash, geoHashSet, cb);
  };
  const error = (err) => {
    console.log(err);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

shiftActions.queryDb = (geoHash, geohashSet, cb) => {
  request
    .post('/api/shift/geohash/' + geoHash + '/precision/' + 4)
    .set({
      Authorization: sessionStorage.getItem('token'),
    })
    .send({
      hashSet: geohashSet,
    })
    .endAsync().then(function(res) {
      cb(res.body);
      return res.body;
    }).catch(function(err) {
      console.log(err);
    });
};

shiftActions.queryAsync = (geoHash, geohashSet) => {
  return request
    .post('/api/shift/geohash/' + geoHash + '/precision/' + 4)
    .set({
      Authorization: sessionStorage.getItem('token'),
    })
    .send({
      hashSet: geohashSet,
    })
    .endAsync().then(function(res) {
      return res.body;
    }).catch(function(err) {
      return err;
    });
};

shiftActions.loadCurrent = () => {
  shiftActions.getLocation(function(data) {
    console.log(data);
    shiftDispatcher.dispatch({
      type: shiftConst.LOAD,
      payload: data.rows,
    });
  });
};

shiftActions.loadAddress = (address) => {
  console.log('address from action', address);
  request
    .post('/api/geohash')
    .set({
      Authorization: sessionStorage.getItem('token'),
    })
    .send({
      address: address,
    })
    .endAsync().then(function(res) {
      return res.body;
    }).then(function(location) {
      const geohash2 = geohash.encode(location.lat, location.lng, 4);
      const geohashset2 = geohash.neighbors(geohash2);
      return {
        geohash: geohash2,
        geohashset: geohashset2,
      };
    }).then(function(geoHash) {
      return shiftActions.queryAsync(geoHash.geohash, geoHash.geohashset);
    }).then(function(res) {
      console.log(res);
      shiftDispatcher.dispatch({
        type: shiftConst.LOAD,
        payload: res.rows,
      });
    }).catch(function(err) {
      console.log(err);
    });
};

export default shiftActions;
