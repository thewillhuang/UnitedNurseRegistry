'use strict';

const bcrypt = require('./bcrypt');

module.exports = function(password, saltORsteps) {
  return bcrypt.hashAsync(password, saltORsteps).then(function(hash) {
    return hash;
  }).catch(function(err) {
    return err;
  });
};
