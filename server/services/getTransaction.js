'use strict';

const Promise = require('bluebird');
const getConnection = require('./getConnection');

module.exports = function acquireTransaction() {
  return Promise.using(getConnection(), function(tx) {
    return tx.beginTransactionAsync().then(function() {
      return tx;
    });
  }).disposer(function(tx, promise) {
    return promise.isFulfilled() ? tx.commitAsync() : tx.rollbackAsync();
  });
};
