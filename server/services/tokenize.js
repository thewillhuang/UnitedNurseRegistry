'use strict';
const tokenize = module.exports = {};
const jwt = require('./jwt');
const fs = require('fs');
const cert = fs.readFileSync('../../jwt-key.pem');
const crypto = require('./crypto');
const options = {
  algorithm: 'HS256',
  expiresInMinutes: 7 * 24 * 60,
  audience: 'unr clients',
  issuer: 'unr api',
};

console.log(jwt);

tokenize.encryptSign = function(payload) {
  return jwt.sign(payload, cert, options);
};

tokenize.verifyDecrypt = function(token) {
  return jwt.verifyAsync(token, cert, options).then(function(decoded) {
    return decoded;
  }).catch(function(err) {
    return err;
  });
};
