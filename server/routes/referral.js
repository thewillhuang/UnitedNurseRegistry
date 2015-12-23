'use strict';

const Router = require('koa-router');
const referral = new Router({
  prefix: '/api/referral',
});
const query = require('../services/query');

module.exports = function userRoutes(app) {
  referral

  // create user referral
  .post('/user/:parentId', function* createUserReferral() {
    const parentId = this.params.parentId;
    const user = this.passport.user;
    // console.log('create user parent id', parentId, 'create user user.scope.userID', user.scope.userID);
    if (user.scope.userID && user.scope.userID.toString() !== parentId) {
      const payload = {};
      payload.parent = parentId;
      payload.child = user.scope.userID;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['UserReferral', payload];
      this.body = yield query(q);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  // create facility referral
  .post('/facility/:parentId', function* createFacilityReferral() {
    const parentId = this.params.parentId;
    const user = this.passport.user;
    // console.log(parentId, user, user.scope.userID, user.scope.facilityID);
    if (user.scope.facilityID && user.scope.facilityID.toString() !== parentId) {
      const payload = {};
      payload.parent = parentId;
      payload.child = user.scope.facilityID;
      const q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['FacilityReferral', payload];
      this.body = yield query(q);
    } else {
      this.status = 406;
      this.body = {message: 'no permission'};
    }
  })

  // grab # of user referrals based on user id
  .get('/user/:userID', function* getUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT count(*) AS count FROM ?? WHERE ?? = ?';
    q.values = ['UserReferral', 'parent', userID];
    this.body = yield query(q);
  })

  // grab # of facility referrals based on user id
  .get('/facility/:userID', function* getUser() {
    const userID = this.params.userID;
    const q = {};
    q.sql = 'SELECT count(*) AS count FROM ?? WHERE ?? = ?';
    q.values = ['FacilityReferral', 'parent', userID];
    this.body = yield query(q);
  });

  app.use(referral.routes());
  app.use(referral.allowedMethods());
};
