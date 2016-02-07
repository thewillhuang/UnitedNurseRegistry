'use strict';

// all user related routes
module.exports = function (app) {
  require('./shift')(app);
  require('./shiftStatus')(app);
  require('./shiftReviews')(app);
};
