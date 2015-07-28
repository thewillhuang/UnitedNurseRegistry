'use strict';
const pool = require('./mysqlConnection');
// a function that takes mysql parameters
const mysql = function(q) {
  // makes a db connection for a pool.
  return pool.getConnectionAsync().then(function(connection){
    // grabs the connection
    // var query = connection.query(q);
    // console.log(query.sql);
    return connection.queryAsync(q).spread(function(rows, fields){
      // release the connection after the mysql
      connection.release();
      // returns the result if there is any
      return {rows, fields};
    }).catch(function(error){
      connection.release();
      // or return the error if there is any
      return error;
    });
  });
};

module.exports = mysql;