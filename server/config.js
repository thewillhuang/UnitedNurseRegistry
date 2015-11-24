'use strict';
const crypto = require('crypto');
module.exports = {
  mysql: {
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
    API_KEY: '&key=' + 'AIzaSyCYjPRBL33MXDv_Z230il4oibGj607wdTI',
    googleUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
  },
};
