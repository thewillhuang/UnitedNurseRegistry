'use strict';

const Promise = require('bluebird');
const mysql = require('mysql');
const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unrdb'
  // multipleStatements: true
};
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
const pool = mysql.createPool(options);
module.exports = pool;
