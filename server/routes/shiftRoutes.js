'use strict';

// all user related routes
module.exports = function(app) {
  require('./shift')(app);
  // require('./userAddress')(app);
  // require('./userEmail')(app);
  // require('./userLicense')(app);
  // require('./userPhone')(app);
  // require('./userSchedule')(app);
  // require('./userSpecialty')(app);
  // require('./userWorkHistory')(app);
};
