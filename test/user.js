'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
chai.use(chaiAsPromised);

describe('user api', function () {

  it('should reject invalid get requests', function (done) {
    request.get('/api/users')
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function (done) {
    request.get('/api/user/1')
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should insert a new user given a correct object', function (done) {
    request.post('/api/user/')
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
        dob: '1986-04-08',
        userName: 'thewillhuang'
      })
      .expect(200)
      .end(function (err, res) {
        console.log(res.body);
        done();
      });
  });

  // it('should respond with empty array with unknown user', function (done) {
  //   request.get('/api/user/1')
  //     .expect(200)
  //     .end(function (err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.empty;
  //       expect(res.body.rows).to.be.an('array');
  //       expect(res.body.fields).to.be.an('array');
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });
  //
  // it('should respond with empty array with unknown user', function (done) {
  //   request.get('/api/user/1')
  //     .expect(200)
  //     .end(function (err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.empty;
  //       expect(res.body.rows).to.be.an('array');
  //       expect(res.body.fields).to.be.an('array');
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });
  //
  // it('should respond with empty array with unknown user', function (done) {
  //   request.get('/api/user/1')
  //     .expect(200)
  //     .end(function (err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.empty;
  //       expect(res.body.rows).to.be.an('array');
  //       expect(res.body.fields).to.be.an('array');
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });


});
