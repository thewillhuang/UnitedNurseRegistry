'use strict';
const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user
    .get('/:userId', function* () {
      // let data = yield client.query('SELECT 1+1');
      // this.body = data;
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


// co(function* () {
//   var result = yield Promise.resolve(true);
//   return result;
// }).then(function (value) {
//   console.log(value);
// }, function (err) {
//   console.error(err.stack);
// });
