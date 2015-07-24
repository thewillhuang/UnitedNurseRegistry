'use strict';

const wrapper = require('co-mysql');
const mysql = require('mysql');
const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unrdb',
  multipleStatements: true
};
const pool = mysql.createPool(options);
const p = wrapper(pool);

module.exports = p;
