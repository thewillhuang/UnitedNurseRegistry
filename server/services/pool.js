'use strict';
const config = require('../config');
const Promise = require('bluebird');
const mysql = require('mysql2');
const Pool = require('mysql2/lib/pool');
const Connection = require('mysql2/lib/connection');

Promise.promisifyAll([Pool, Connection]);
// long stack trace for debug
// Promise.longStackTraces();
const pool = mysql.createPool(config.mysql);
module.exports = pool;
