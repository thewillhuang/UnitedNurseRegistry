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

tokenize.encryptSign = function(payload) {
  const string = JSON.stringify(payload);
  return jwt.sign(crypto.encrypt(string), cert, options);
};

tokenize.verifyDecrypt = function(token) {
  const decoded = jwt.verify(token, cert, options);
  console.log(decoded);
  return JSON.parse(crypto.decrypt(decoded.payload, decoded.iv));
};

const webtoken = tokenize.encryptSign({msg: 'testing'});
console.log(webtoken);

console.log(tokenize.verifyDecrypt(webtoken));
