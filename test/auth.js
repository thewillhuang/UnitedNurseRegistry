'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');


describe('authentication api', function() {
  const email = uuid.v4();
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  const password = uuid.v4();

  let jwt;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(302)
      .end(function(err, res) {
        jwt = res.headers.authorization.split(' ').pop();
        console.log(jwt);
        expect(res.body).to.be.an('object');
        expect(res.headers.location).to.equal('/app');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not signup with /signup due to email taken', function(done) {
    request.post('/api/auth/signup')
      .send({
        password: password,
        email: email2,
      })
      .expect(401)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should login with /login', function(done) {
    request.post('/api/auth/login')
      .send({
        password: password2,
        email: email2,
      })
      .expect(302)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.headers.location).to.equal('/app');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login with wrong or no user /', function(done) {
    request.post('/api/auth/login')
      .send({
        password: password,
        email: email,
      })
      .expect(401)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login with wrong password /', function(done) {
    request.post('/api/auth/login')
      .send({
        password: 'fldakjsfdlasfkj',
        email: email2,
      })
      .expect(401)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should logout with /logout', function(done) {
    request.get('/api/auth/logout')
      .expect(302)
      .end(function(err, res) {
        expect(res.headers.location).to.equal('/');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });
});
