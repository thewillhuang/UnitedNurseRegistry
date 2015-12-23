'use strict';

const Router = require('koa-router');
const beta = new Router({
  prefix: '/api/beta',
});
const query = require('../services/query');

module.exports = function authRoutes(app) {
  beta

  .post('/signup', function* createBetaUser() {
    // console.log(this.request.body);
    const requestJson = this.request.body;
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['BetaUser', requestJson];
    this.body = yield query(q);
  })

  .delete('/signup', function* deleteBetaUser() {
    // console.log(this.request.body);
    const requestJson = this.request.body;
    const q = {};
    q.sql = 'DELETE FROM ?? WHERE ?? = ?';
    q.values = ['BetaUser', 'email', requestJson.email];
    this.body = yield query(q);
  })

  // get all beta users
  .get('/signup', function* getAllBetaUser() {
    const q = {};
    q.sql = 'SELECT * FROM ??';
    q.values = ['BetaUser'];
    this.body = yield query(q);
  });

  app.use(beta.routes());
  app.use(beta.allowedMethods());
};
