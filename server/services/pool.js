'use strict';

const Promise = require('bluebird');
const mysql = require('mysql2');
const Pool = require('mysql2/lib/pool');
const Connection = require('mysql2/lib/connection');
const options = {
  database: 'unrdb',
  connectionLimit: 100,
  // aws rds
  host: 'unrdb.c96pt8dvujyx.us-west-2.rds.amazonaws.com',
  user: 'thewillhuang',
  password: 'Voodoo3d1668',
  ssl: 'Amazon RDS',
  // // localhost
  // host: 'localhost',
  // user: 'root',
};

Promise.promisifyAll([Pool, Connection]);
// long stack trace for debug
// Promise.longStackTraces();
const pool = mysql.createPool(options);
module.exports = pool;
