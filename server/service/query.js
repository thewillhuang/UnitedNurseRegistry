'use strict';
const pool = require('../service/dbConnection');
// a function that takes query parameters
const query = function(q) {
  // makes a db connection for a pool.
  return pool.getConnectionAsync().then(function(connection){
    // grabs the connection
    return connection.queryAsync(q).spread(function(rows){
      // release the connection after the query
      connection.release();
      // returns the result if there is any
      return rows;
    }).catch(function(error){
      connection.release();
      // or return the error if there is any
      return error;
    });
  });
};

module.exports = query;
