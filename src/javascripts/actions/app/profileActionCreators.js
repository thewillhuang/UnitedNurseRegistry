import shiftConst from '../constants/shiftConstants.js';
import geohash from 'ngeohash';
import shiftDispatcher from '../dispatcher/appDispatcher.js';
import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

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
      if (err.status === 500) {
        window.location.assign('/');
      }
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
    // console.log('loadCurrent payload', data.rows);
    shiftDispatcher.dispatch({
      type: shiftConst.LOAD,
      payload: data.rows,
    });
  });
};

shiftActions.loadAddress = (address) => {
  // console.log('address from action', address);
  request
    .post('/api/geohash')
    .set({
      Authorization: sessionStorage.getItem('token'),
    })
    .send({
      address: address,
    })
    .endAsync().then(function(res) {
      // console.log('res.body from loadAddress', res.body);
      return res.body;
    }).then(function(location) {
      // console.log('location from loadAddress', location);
      // console.log('location.lat', location.lat);
      // console.log('location.lng', location.lng);
      const geohash2 = geohash.encode(location.lat, location.lng, 4);
      const geohashset2 = geohash.neighbors(geohash2);
      return {
        geohash: geohash2,
        geohashset: geohashset2,
      };
    }).then(function(geoHash) {
      // console.log('geoHash', geoHash);
      return shiftActions.queryAsync(geoHash.geohash, geoHash.geohashset);
    }).then(function(res) {
      // console.log('load address payload', res.rows);
      shiftDispatcher.dispatch({
        type: shiftConst.LOAD,
        payload: res.rows,
      });
    }).catch(function(err) {
      console.log(err);
      if (err.status === 500) {
        window.location.assign('/');
      }
    });
};

shiftActions.sortByBestPaying = () => {
  shiftDispatcher.dispatch({
    type: shiftConst.SORTBYPRICEDEC,
  });
};

shiftActions.sortByWorsePaying = () => {
  shiftDispatcher.dispatch({
    type: shiftConst.SORTBYPRICEASC,
  });
};

export default shiftActions;
