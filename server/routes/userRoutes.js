'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user
    .get('/:userID', function* () {
      let userID = this.params.userID;
      let q = {};
      q.sql = 'SELECT * FROM `user` WHERE userID = ?';
      q.values = [userID];
      this.body = yield client.query(q).catch(function(err){
        console.log(err);
      });
    })

    .post('/', function* () {
      let requestJson = this.request.body.fields;
      let q = {};
      q.sql = 'INSERT INTO `user` SET ?; SELECT LAST_INSERT_ID();';
      q.values = [requestJson];
      let result = yield client.query(q).catch(function(err){
        console.log(err);
      });
      let res = {};
      res.userID = result[1][0]['LAST_INSERT_ID()'];
      this.body = res;
    });

  app.use(user.routes())
    .use(user.allowedMethods());
};
