'use strict';

const wrapper = require('co-mysql');
const mysql = require('mysql');
const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unrdb'
};
const pool = mysql.createPool(options);
const p = wrapper(pool);

let client = {};
client.pool = pool;
client.p = p;
module.exports = client;
