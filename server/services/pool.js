'use strict';

const Promise = require('bluebird');
const mysql = require('mysql');
const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unrdb',
  connectionLimit: 100,
  // ssl: 'Amazon RDS'
};
Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
// long stack trace for debug
Promise.longStackTraces();
const pool = mysql.createPool(options);
module.exports = pool;
