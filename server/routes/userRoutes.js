'use strict';
const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user
    .get('/:userId', function* () {
      this.body = yield client.query('SELECT 1+1').catch(function(err){
        console.log(err);
      });
    })

    .post('/:id', function* () {
      this.body = this.params.id;
    });

  app.use(user.routes())
    .use(user.allowedMethods());
};
