'use strict';
const tokenize = module.exports = {};
const jwt = require('jsonwebtoken');
const crypto = require('./crypto');
const cryptos = require('crypto');
const cert = cryptos.randomBytes(32);
const options = {
  algorithm: 'HS256',
  issuer: 'unr api',
};

// takes a json, encrypt and sign it
tokenize.encryptSign = function(payload) {
  const string = JSON.stringify(payload);
  return jwt.sign(crypto.encrypt(string), cert, options);
};

// returns a json from a token
tokenize.verifyDecrypt = function(token, done) {
  jwt.verify(token, cert, options, function(err, decoded) {
    if (err) {
      done(err, null);
    } else {
      done(null, JSON.parse(crypto.decrypt(decoded.payload, decoded.iv)));
    }
  });
};
