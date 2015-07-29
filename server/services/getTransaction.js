'use strict';

const pool = require('./pool');

module.exports = function getTransaction() {
    return pool.getConnectionAsync().then(function(connection){
      return connection.beginTransactionAsync().then(function(conn){
        return conn;
      });
    }).disposer(function(connection, promise) {
        var p = promise.isFulfilled() ? connection.commitAsync() : connection.rollbackAsync();
        return p.finally(function () {
          connection.release();
        });
    });
};
