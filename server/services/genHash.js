'use strict';
const config = require('../config');
const bcrypt = require('./bcrypt');

module.exports = function(password) {
  return bcrypt.hashAsync(password, config.bcrypt.strength).then(function(hash) {
    return hash;
  }).catch(function(err) {
    return err;
  });
};
