'use strict';

const bcrypt = require('./bcrypt');

module.exports = function(password, dbpwhash) {
  return bcrypt.compareAsync(password, dbpwhash).then(function(res) {
    return {valid: res};
  }).catch(function(err) {
    return err;
  });
};
