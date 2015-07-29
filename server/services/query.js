'use strict';
const Promise = require('bluebird');
const getConnection = require('./getConnection');
// const pool = require('./pool');

// a function that takes mysql parameters
module.exports = function query(q) {
  // method 1
  return Promise.using(getConnection(), function(connection){
    return connection.queryAsync(q);
  }).spread(function(rows, fields){
      // returns the result if there is any
      return {rows, fields};
  }).catch(function(error){
      // or return the error if there is any
      return error;
  });

  // method 2
  // makes a db connection for a pool.
  // return pool.getConnectionAsync().then(function(connection){
  //   // grabs the connection
  //   return connection.queryAsync(q).spread(function(rows, fields){
  //     // release the connection after the mysql
  //     connection.release();
  //     // returns the result if there is any
  //     return {rows, fields};
  //   }).catch(function(error){
  //     connection.release();
  //     // or return the error if there is any
  //     return error;
  //   });
  // });
};
