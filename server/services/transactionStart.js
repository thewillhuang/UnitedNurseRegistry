'use strict';
const pool = require('./dbConnection');
// a function that takes mysql parameters
const transaction = function(q, q2, primaryKeyColumn) {
  // makes a db connection for a pool.
  return pool.getConnectionAsync().then(function(connection){
    return connection.beginTransactionAsync().then(function(){
      // start of q1
      let result = connection.mysqlAsync(q).spread(function(rows){
        return rows;
      }).catch(function(err){
        console.log(err);
        return connection.rollback();
      });

      // add the insertId of the previous transaction to the specified column.
      q2[primaryKeyColumn] = result.insertId;

      //start of q2
      return connection.mysqlAsync(q2).spread(function(rows){
        //commit the changes and release the connection on mysql success
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
