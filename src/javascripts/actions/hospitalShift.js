import shiftConst from '../constants/shiftConstants.js';
import geohash from 'ngeohash';
import Dispatcher from '../dispatcher/appDispatcher.js';
import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

const hospitalShift = {};


hospitalShift.grabAllActive = (facilityID) => {
  request
    .get('/api/shift/active/' + facilityID)
    .set({ Authorization: sessionStorage.getItem('token') })
    .endAsync().then(function(res) {
      console.log(res.body);
    });
};

export default hospitalShift;
