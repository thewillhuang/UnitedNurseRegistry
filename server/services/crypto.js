'use strict';

// Nodejs encryption with CTR
const aes = module.exports = {};
const crypto = require('crypto');
const algorithm = 'AES-256-CTR';
const key = crypto.randomBytes(32);

aes.encrypt = function(text) {
  const iv = new Buffer(crypto.randomBytes(16));
  console.log('iv', iv);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return {payload: crypted, iv: iv.toString('hex')};
};

aes.decrypt = function(encrypted, iv) {
  const ivbuf = new Buffer(iv, 'hex');
  console.log('ivbuf', ivbuf);
  const decipher = crypto.createDecipheriv(algorithm, key, ivbuf);
  let dec = decipher.update(encrypted, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const hw = aes.encrypt('hello world');
console.log(hw);
// outputs hello world
console.log(aes.decrypt(hw.payload, hw.iv));
