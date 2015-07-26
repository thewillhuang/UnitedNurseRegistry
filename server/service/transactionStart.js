'use strict';
const pool = require('../service/dbConnection');
// a function that takes query parameters
const transaction = function(q, q2) {
  // makes a db connection for a pool.
  return pool.getConnectionAsync().then(function(connection){
    return connection.beginTransactionAsync().then(function(){
      // start of q1
      let result = connection.queryAsync(q).spread(function(rows){
        return rows;
      }).catch(function(err){
        console.log(err);
        return connection.rollback();
      });

      console.log(result);

      //start of q2
      return connection.queryAsync(q2).spread(function(rows){
        //commit the changes and release the connection on query success
        connection.commit();
        connection.release();
        return rows;
      }).catch(function(err){
        console.log(err);
        return connection.rollback();
      });
    });
  });
};

module.exports = transaction;
