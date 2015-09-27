'use strict';

const stripe = require('stripe')('sk_test_QhkM0TkqmtZinr5Gy7P4CtIq');
const Router = require('koa-router');
const checkout = new Router({
  prefix: '/api/checkout',
});
const query = require('../services/query');

module.exports = function authRoutes(app) {
  checkout

  .post('/shift/:shiftID/price/:cents', function* saveStripeToken() {
    const shiftID = this.params.shiftID;
    const cents = this.params.cents;
    const token = JSON.stringify(this.request.body.token);
    const user = this.passport.user;
    const email = user.email;
    const ctx = this;
    const q1 = {};
    q1.sql = 'SELECT ?? AS ? FROM ?? WHERE ?? = ?';
    q1.values = ['fk_Shift_facilityID', 'facilityID', 'Shift', 'shiftID', shiftID];
    const facilityID = yield query(q1);
    console.log(token);
    // console.log('called here');
    // console.log(facilityID.rows[0].facilityID);
    // console.log(user.scope.facilityID);
    if (user.scope.facilityID && user.scope.facilityID === facilityID.rows[0].facilityID) {
      console.log('check passed');
      stripe.customers.create({
        source: token,
        description: email,
      }).then(function(customer) {
        return stripe.charges.create({
          amount: cents, // amount in cents, again
          currency: 'usd',
          customer: customer.id,
        });
      }).then(function(charge) {
        const q = {};
        q.sql = 'INSERT INTO ?? WHERE ?? = ? SET ?? = ?';
        q.values = ['Shift', 'shiftID', shiftID, 'stripeToken', charge.customer];
        return q;
      }).then(function(q) {
        query(q);
        ctx.body = {message: 'charge stored'};
      }).catch(error => {
        ctx.body = {message: error};
        console.log(error);
      });
    }
  })

  .post('/charge/shift/:shiftID', function* chargeByID() {
    const shiftID = this.params.shiftID;
    const q = {};
    q.sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?';
    q.values = ['shiftDuration', 'payPerHour', 'Shift', 'shiftID', shiftID];
    const shiftInfo = yield query(q);
    this.body = shiftInfo;
  });

  app.use(checkout.routes())
    .use(checkout.allowedMethods());
};
