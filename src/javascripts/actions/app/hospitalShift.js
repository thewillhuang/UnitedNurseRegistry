// import shiftConst from '../constants/shiftConstants.js';
// import Dispatcher from '../dispatcher/appDispatcher.js';
// import Promise from 'bluebird';
// import superagent from 'superagent';
// const request = Promise.promisifyAll(superagent);
// const token = { Authorization: sessionStorage.getItem('token') };
// const hospitalShift = {};
//
// hospitalShift.grabAllActive = (facilityID) => {
//   request
//     .get('/api/shift/active/' + facilityID)
//     .set(token)
//     .endAsync().then(function(res) {
//       console.log('grabAllActive', res.body);
//     });
// };
//
// hospitalShift.postShift = (payload) => {
//   // first grab a specialty id given a string
//   request
//     .post('');
//
//   // then post a shift with the specialty id
//   request
//     .post('/api/shift/facility/' + payload.facilityID)
//     .set(token)
//     .endAsync().then(function(res) {
//       console.log('postShifts', res.body);
//     });
// };
//
// export default hospitalShift;
