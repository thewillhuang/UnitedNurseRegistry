import shiftConst from '../constants/shiftConstants.js';
import geohash from 'ngeohash';
import Dispatcher from '../dispatcher/appDispatcher.js';
import Promise from 'bluebird';
import superagent from 'superagent';
const request = Promise.promisifyAll(superagent);

const hospitalShift = {};


hospitalShift.grabAll = () => {
  
};

export default hospitalShift;
