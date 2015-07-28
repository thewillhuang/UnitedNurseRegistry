'use strict';
const pool = require('./dbConnection');
// a function that takes mysql parameters
const transaction = function(q, q2, setColumns) {
  // makes a db connection for a pool.
  return pool.getConnectionAsync().then(function(connection){
    return connection.beginTransactionAsync().then(function(){
      // start of q1
      let result = connection.mysqlAsync(q).spread(function(rows, fields){
        return {rows, fields};
      }).catch(function(err){
        console.log(err);
        return connection.rollback();
      });

      console.log(result);

      //start of q2
      return connection.mysqlAsync(q2).spread(function(rows, fields){
        //commit the changes and release the connection on mysql success
        connection.commit();
        connection.release();
        return {rows, fields};
      }).catch(function(err){
        console.log(err);
        return connection.rollback();
      });

    });
  });
};

module.exports = transaction;
