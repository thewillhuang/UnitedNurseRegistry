'use strict';

// all user related routes
module.exports = function(app) {
  require('./shift')(app);
  require('./shiftStatus')(app);
  require('./shiftReviews')(app);
  // require('./userLicense')(app);
  // require('./userPhone')(app);
  // require('./userSchedule')(app);
  // require('./userSpecialty')(app);
  // require('./userWorkHistory')(app);
};
