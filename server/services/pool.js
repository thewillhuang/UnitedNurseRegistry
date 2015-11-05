'use strict';

const Promise = require('bluebird');
const mysql = require('mysql');
const options = {
  host: 'unrdb.c96pt8dvujyx.us-west-2.rds.amazonaws.com',
  user: 'thewillhuang',
  password: 'Voodoo3d1668',
  database: 'unrdb',
  connectionLimit: 10,
  ssl: 'Amazon RDS',
};
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
// long stack trace for debug
Promise.longStackTraces();
const pool = mysql.createPool(options);
module.exports = pool;
