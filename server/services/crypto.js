'use strict';

const config = require('../config');
// Nodejs encryption with CTR
const aes = module.exports = {};
const crypto = require('crypto');
const algorithm = config.encryption.alg;
// for aes 256, length of key need to be exactically 32 bytes
// generate a cryptographically strong 32 byte data
const key = config.encryption.key;
// console.log(key);
// console.log(key.toString('hex'));

aes.encrypt = function (string) {
  // console.time('encrypt');
  // iv must be a buffer, the length must be 16.
  // every single iv for every single message that is encrypted will be different
  const iv = new Buffer(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(string, 'utf8', 'base64');
  crypted += cipher.final('base64');
  // console.timeEnd('encrypt');
  // convert iv to base64 encoding
  return {payload: crypted, iv: iv.toString('base64')};
};

aes.decrypt = function (string, iv) {
  // console.time('decrypt');
  // convert iv from hex coding to a buffer, default is utf-8, will get error wrong length
  const ivbuf = new Buffer(iv, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, ivbuf);
  let dec = decipher.update(string, 'base64', 'utf8');
  dec += decipher.final('utf8');
  // console.timeEnd('decrypt');
  return dec;
};

// // normal string is utf-8 encoding
// console.time('encryption');
// const hw = aes.encrypt('hello world');
// console.timeEnd('encryption');
// console.log(hw);
// // outputs hello world
// console.time('dec');
// console.log(aes.decrypt(hw.payload, hw.iv));
// console.timeEnd('dec');
