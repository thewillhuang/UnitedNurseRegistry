'use strict';
const Promise = require('bluebird');
const getConnection = require('./getConnection');

// a function that takes mysql query object
module.exports = function query(q) {
  return Promise.using(getConnection(), function(connection) {
    return connection.queryAsync(q);
  }).spread(function(rows, fields) {
      // returns the result if there is any
      return {rows, fields};
    }).catch(function(error) {
      // or return the error if there is any
      return error;
    });
};
