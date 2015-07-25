'use strict';
const pool = require('../service/dbConnection');
const query = function(q) {
  return pool.getConnectionAsync().then(function(connection){
    return connection.queryAsync(q).spread(function(rows){
      connection.release();
      return rows;
    }).catch(function(error){
      return error;
    });
  });
};

module.exports = query;
