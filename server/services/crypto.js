'use strict';

// Nodejs encryption with CTR
const aes = module.exports = {};
const crypto = require('crypto');
const algorithm = 'AES-256-CTR';
// for aes 256, length of key need to be exactically 32 bytes
// generate a cryptographically strong 32 byte data
const key = crypto.randomBytes(32);

aes.encrypt = function(payload) {
  // iv must be a buffer, the length must be 16.
  const iv = new Buffer(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(payload, 'utf8', 'hex');
  crypted += cipher.final('hex');
  // convert iv to hex encoding
  return {payload: crypted, iv: iv.toString('hex')};
};

aes.decrypt = function(payload, iv) {
  // convert iv from hex coding to a buffer, default is utf-8, will get error wrong length
  const ivbuf = new Buffer(iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, ivbuf);
  let dec = decipher.update(payload, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

// normal string is utf-8 encoding
const hw = aes.encrypt('hello world');
console.log(hw);
// outputs hello world
console.log(aes.decrypt(hw.payload, hw.iv));
