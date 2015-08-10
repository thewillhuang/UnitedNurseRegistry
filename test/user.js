'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('user api', function() {
  it('should reject invalid get requests', function(done) {
    request.get('/api/users')
      .expect(404)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function(done) {
    request.get('/api/user/abc')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  let r1;
  const password = uuid.v4();
  const userName = uuid.v4();
  it('should insert a new user given a correct object', function(done) {
    request.post('/api/user/')
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: password,
        dob: '1986-04-08',
        userName: userName,
      })
      .expect(200)
      .end(function(err, res) {
        r1 = res.body.rows;
        expect(r1).to.be.an('object');
        // expect(r1).to.contain('insertId');
        expect(r1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should validate user password and user name', function(done) {
    request.post('/api/user/validate/')
      .send({
        userPwHash: password,
        userName: userName,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should login with /', function(done) {
    request.post('/api/auth/')
      .send({
        password: password,
        username: userName,
      })
      .expect(200)
      .end(function(err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        // expect(res.body).to.be.an('object');
        // expect(res.body.success).to.equal(true);
        // expect(err).to.be.a('null');
        done();
      });
  });

  it('should login with /login', function(done) {
    request.post('/api/auth/login')
      .send({
        password: password,
        username: userName,
      })
      .expect(200)
      .end(function(err, res) {
        console.log('headers', res.headers);
        // expect(res.body).to.be.an('object');
        // expect(res.body.success).to.equal(true);
        // expect(err).to.be.a('null');
        done();
      });
  });

  it('should grab a user given a correct user id', function(done) {
    request.get('/api/user/' + r1.insertId)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should return a 200 for the same data', function(done) {
    request.get('/api/user/' + r1.insertId)
      .expect(200)
      .end(function(err, res) {
        // console.log(res);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const updateinfo = uuid.v4();
  it('should update user info given a correct object and user id', function(done) {
    request.put('/api/user/' + r1.insertId)
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
        dob: '1986-04-08',
        userName: updateinfo,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should get an updated user info', function(done) {
    request.get('/api/user/' + r1.insertId)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows[0].userName).to.equal(updateinfo);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a user given a correct user id', function(done) {
    request.delete('/api/user/' + r1.insertId)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function(done) {
    request.get('/api/user/' + r1.insertId)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });
});
