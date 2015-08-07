'use strict';

const crypto = require('crypto');
const alg = 'aes-256-ctr';
const aes = {};

aes.encrypt = function(text, password) {
  const cipher = crypto.createCipher(alg, password);
  const crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

aes.decrypt = function(text, password) {
  const decipher = crypto.createDecipher(alg, password);
  const dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

module.exports = aes;
