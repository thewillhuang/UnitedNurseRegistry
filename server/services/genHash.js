'use strict';

const bcrypt = require('./bcrypt');

module.exports = function(password) {
  return bcrypt.hashAsync(password, 5).then(function(hash) {
    return hash;
  }).catch(function(err) {
    return err;
  });
};
