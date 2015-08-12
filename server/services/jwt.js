'use strict';
const tokenize = module.exports = {};
const jwt = require('jsonwebtoken');
const crypto = require('./crypto');
const cryptos = require('crypto');
const cert = cryptos.randomBytes(32);
const options = {
  algorithm: 'HS256',
  expiresInMinutes: 7 * 24 * 60,
  audience: 'unr clients',
  issuer: 'unr api',
};

// takes a json, encrypt and sign it
tokenize.encryptSign = function(payload) {
  const string = JSON.stringify(payload);
  return jwt.sign(crypto.encrypt(string), cert, options);
};

// returns a json from a token
tokenize.verifyDecrypt = function(token) {
  const decoded = jwt.verify(token, cert, options);
  return JSON.parse(crypto.decrypt(decoded.payload, decoded.iv));
};

// // some testing for speed
// console.time('encode');
// const webtoken = tokenize.encryptSign({email: 'leeroy_jenkins231'});
// console.timeEnd('encode');
// console.log('jwt', webtoken);
//
// console.time('decode');
// const decodedjwt = tokenize.verifyDecrypt(webtoken);
// console.timeEnd('decode');
// console.log(decodedjwt);
