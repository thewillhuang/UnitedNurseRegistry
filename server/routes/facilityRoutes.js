'use strict';

// all user related routes
module.exports = function (app) {
  require('./facility')(app);
  require('./facilityAddress')(app);
  require('./facilityEmail')(app);
  require('./facilityPhone')(app);
  require('./facilityUser')(app);
};
