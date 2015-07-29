'use strict';
const start = function(connection, q) {
    // grabs the connection
    return connection.queryAsync(q).spread(function(rows, fields){
      // returns the result if there is any
      return {rows, fields};
    }).catch(function(error){
      return connection.rollbackAsync().then(function(){
        connection.release();
        return error;
      });
    });
};

module.exports = start;
