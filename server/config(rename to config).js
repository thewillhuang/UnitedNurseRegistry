'use strict';
const crypto = require('crypto');
module.exports = {
  mysql: {
    database: '<database name>',
    connectionLimit: 100,
    // aws rds
    host: '<host address>',
    user: '<user>',
    password: '<password>',
    ssl: 'Amazon RDS',
    // // localhost
    // host: 'localhost',
    // user: 'root',
  },
  bcrypt: {
    strength: 10,
  },
  encryption: {
    alg: 'AES-256-CBC',
    key: crypto.randomBytes(32),
  },
  jwt: {
    cert: crypto.randomBytes(32),
    options: {
      algorithm: 'HS256',
      issuer: 'unr api',
    },
  },
  googlePlacesApi: {
    API_KEY: '&key=' + '<api key>',
    googleUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
  },
};
