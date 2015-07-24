'use strict';

const Router = require('koa-router');
const user = new Router({
  prefix: '/api/user'
});
const client = require('../service/dbConnection');

module.exports = function (app) {
  user

    //create user
    .post('/', function* () {
      let requestJson = this.request.body.fields;
      let q = {};
      q.sql = 'INSERT INTO ?? SET ?';
      q.values = ['user', requestJson];
      this.body = yield client.query(q).catch(function(err){
        console.log(err);
      });
    })

    //grab user based on id
    .get('/:userID', function* () {
      let userID = this.params.userID;
      let q = {};
      q.sql = 'SELECT * FROM ?? WHERE userID = ?';
      q.values = ['user', userID];
      this.body = yield client.query(q).catch(function(err){
        console.log(err);
      });
    })

    // update user data
    .put('/:userID', function* (){
      let requestJson = this.request.body.fields;
      let userID = this.params.userID;
      let q = {};
      q.sql = 'UPDATE ?? SET ? WHERE ?? = ?';
      q.values = ['user', requestJson, 'userID', userID];
      this.body = yield client.query(q).catch(function(err){
        console.log(err);
      });
    })

    // delete user by id
    .delete('/:userID', function* (){
      let userID = this.params.userID;
      let q = {};
      q.sql = 'DELETE from ?? WHERE ?? = ?';
      q.values = ['user', 'userID', userID];
      this.body = yield client.query(q).catch(function(err){
        console.log(err);
      });
    });

  app.use(user.routes()).use(user.allowedMethods());
};
