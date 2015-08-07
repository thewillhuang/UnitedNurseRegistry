'use strict';

const aes = module.exports = {};
const forge = require('node-forge');
const fs = require('fs');
const cert = fs.readFileSync('../../aes-key.pem');
const alg = 'AES-CTR';
const salt = forge.random.getBytesSync(128);
const key = forge.pkcs5.pbkdf2(cert, salt, 5, 16);

aes.encrypt = function(text) {
  console.log(alg, key);
  const iv = forge.random.getBytesSync(16);
  const cipher = forge.cipher.createCipher(alg, key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(text, 'utf8'));
  cipher.finish();
  const encrypted = cipher.output;
  const crypt = encrypted.toHex();
  const ivhex = forge.util.bytesToHex(iv);
  return {crypt, ivhex};
};

aes.decrypt = function(encrypted, iv) {
  console.log(alg, key);
  const ivbyte = forge.util.hexToBytes(iv);
  const decipher = forge.cipher.createDecipher(alg, key);
  decipher.start({iv: ivbyte});
  decipher.update(encrypted);
  decipher.finish();
  // outputs decrypted hex
  const decrypted = decipher.output;
  const dec = decrypted.toHex();
  return dec;
};

const encrypted2 = aes.encrypt('testing 1');
console.log(encrypted2);
console.log(aes.decrypt(encrypted2.crypt, encrypted2.ivhex));
