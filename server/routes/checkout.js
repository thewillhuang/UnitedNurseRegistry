'use strict';

const stripe = require('stripe')('sk_test_QhkM0TkqmtZinr5Gy7P4CtIq');
const Router = require('koa-router');
const checkout = new Router({
  prefix: '/api/checkout',
});
const query = require('../services/query');

module.exports = function authRoutes(app) {
  checkout

  .post('/', function* saveStripeToken(shiftID, price) {
    const token = JSON.stringify(this.request.body.token);
    const user = this.passport.user;
    const email = user.email;
    const ctx = this;
    stripe.customers.create({
      source: token,
      description: email,
    }).then(function(customer) {
      return stripe.charges.create({
        amount: price, // amount in cents, again
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
      ctx.body = {message: 'customer stored'};
    }).catch(error => {
      ctx.body = {message: error};
      console.log(error);
    });
  });

  app.use(checkout.routes())
    .use(checkout.allowedMethods());
};
