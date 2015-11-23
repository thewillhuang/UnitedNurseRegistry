'use strict';

const Promise = require('bluebird');
const mysql = require('mysql');
const options = {
  database: 'unrdb',
  connectionLimit: 100,
  host: 'unrdb.c96pt8dvujyx.us-west-2.rds.amazonaws.com',
  user: 'thewillhuang',
  password: 'Voodoo3d1668',
  ssl: 'Amazon RDS',
  // // localhost
  // host: 'localhost',
  // user: 'root',
};
const Pool = require('mysql/lib/Pool');
const Connection = require('mysql/lib/Connection');
Promise.promisifyAll([Pool, Connection]);
// long stack trace for debug
Promise.longStackTraces();
const pool = mysql.createPool(options);
module.exports = pool;
