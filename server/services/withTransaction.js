'use strict';
const Promise = require('bluebird');
const acquireConnection = require('./getConnection.js');

module.exports = function withTransaction(fn) {
  return Promise.using(acquireConnection(), function(connection) {
    let tx = connection.beginTransaction();
    return Promise
      .try(fn, tx)
      .then(function(res) { return tx.commitAsync().thenReturn(res); },
            function(err) {
              console.log(err);
              return tx.rollbackAsync()
                .catch(function(e) { console.log('rollback error', e); })
                .thenThrow(err);
            });
  });
};
