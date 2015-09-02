'use strict';

const Router = require('koa-router');
const beta = new Router({
  prefix: '/api/beta',
});
const query = require('../services/query');

module.exports = function authRoutes(app) {
  beta

  .post('/signup', function* createBetaUser() {
    console.log(this.request.body);
    const requestJson = this.request.body;
    const q = {};
    q.sql = 'INSERT INTO ?? SET ?';
    q.values = ['betaUser', requestJson];
    this.body = yield query(q);
  })

  // get all beta users
  .get('/signup', function* getAllBetaUser() {
    const q = {};
    q.sql = 'SELECT * FROM ??';
    q.values = ['betaUser'];
    this.body = yield query(q);
  });

  app.use(beta.routes())
    .use(beta.allowedMethods());
};
