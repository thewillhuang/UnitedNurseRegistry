'use strict';

const pool = require('./pool');

module.exports = function acquireConnection() {
    return pool.getConnectionAsync().disposer(function(connection) {
        connection.release();
    });
};
