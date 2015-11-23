'use strict';
const Promise = require('bluebird');
const getConnection = require('./getConnection');

// a function that takes mysql query object
module.exports = function query(q) {
  return Promise.using(getConnection(), function(db) {
    return db.queryAsync(q);
  }).then(function(rows) {
    return {rows};
  }).catch(function(error) {
    return error;
  });
};
