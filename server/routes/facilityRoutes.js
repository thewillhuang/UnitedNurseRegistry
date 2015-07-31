'use strict';

// all user related routes
module.exports = function(app) {
  require('./facility')(app);
  require('./facilityAddress')(app);
};
