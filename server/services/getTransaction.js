'use strict';

const pool = require('./pool');

module.exports = function acquireTransaction() {
  return pool.getConnectionAsync().then(function(connection) {
    return connection.beginTransactionAsync().then(function() {
      return connection;
    });
  }).disposer(function(connection, promise) {
    if (promise.isFulfilled()) {
      return connection.commitAsync().then(function () {
        connection.release();
      }, function () {
        return connection.rollbackAsync().then(function () {
          connection.release();
        });
      });
    } else {
      return connection.rollbackAsync().then(function () {
        connection.release();
      });
    }
  });
};
