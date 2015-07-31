'use strict';

const pool = require('./pool');

module.exports = function acquireTransaction() {
  return pool.getConnectionAsync().then(function(connection) {
    return connection.beginTransactionAsync().then(function() {
      return connection;
    });
  }).disposer(function(connection, promise) {
    if (promise.isFulfilled()) {
      // console.log('commit transaction');
      return connection.commitAsync().then(function () {
        connection.release();
      }).catch(function(e){
        // console.log('commit failed', e);
        return connection.rollbackAsync().then(function () {
          connection.release();
          return e;
        });
      });
    } else {
      // console.log('query failed, rollback');
      return connection.rollbackAsync().then(function () {
        connection.release();
      });
    }
  });
};
