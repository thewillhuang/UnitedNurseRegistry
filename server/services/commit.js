'use strict';
const commit = function(connection, q) {
    // grabs the connection
    return connection.queryAsync(q).spread(function(rows, fields){
      // returns the result if there is any
      connection.commitAsync().then(function(){
        console.log('commit success');
      }).catch(function(err){
        return connection.rollbackAsync().then(function(){
          return err;
        });
      });
      // release connection on success
      connection.release();
      return {rows, fields};
    }).catch(function(error){
      return connection.rollbackAsync().then(function(){
        connection.release();
        return error;
      });
    });
};

module.exports = commit;
