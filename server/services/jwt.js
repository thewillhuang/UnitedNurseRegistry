'use strict';
const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
module.exports = jwt;
