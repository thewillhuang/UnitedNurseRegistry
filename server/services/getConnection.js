'use strict';

const pool = require('./pool');

module.exports = function acquireConnection() {
    return pool.getConnectionAsync().then(function(conn){
      return conn;
    }).disposer(function(connection) {
        connection.release();
    });
};
