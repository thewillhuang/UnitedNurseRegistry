'use strict';
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('authentication api', function () {
  const email = uuid.v4();
  const password = uuid.v4();
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  const email3 = uuid.v4();
  const password3 = uuid.v4();

  let u1;
  let u1jwt;
  it('should signup with /signup', function (done) {
    request.post('/api/auth/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.headers.authorization.split(' ').pop());
        // console.log(res.headers);
        // console.log(res.body);
        u1jwt = { Authorization: res.headers.authorization };
        u1 = res.body.message.scope.userID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f1;
  let f1jwt;
  it('should signup facility with /signup', function (done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: password3,
        email: email3,
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.headers.authorization.split(' ').pop());
        // console.log(res.headers);
        // console.log(res.body);
        f1jwt = { Authorization: res.headers.authorization };
        f1 = res.body.message.scope.facilityID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not signup facility with /signup due to email taken', function (done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: password,
        email: email3,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not signup with /signup due to email taken', function (done) {
    request.post('/api/auth/signup')
      .send({
        password: password,
        email: email2,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should login with /login', function (done) {
    request.post('/api/auth/login')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should login with facility/login', function (done) {
    request.post('/api/auth/facility/login')
      .send({
        password: password3,
        email: email3,
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login facility with wrong or no user /', function (done) {
    request.post('/api/auth/facility/login')
      .send({
        password: password,
        email: email2,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login with wrong or no user /', function (done) {
    request.post('/api/auth/login')
      .send({
        password: password,
        email: email,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login with wrong password /', function (done) {
    request.post('/api/auth/login')
      .send({
        password: 'fldakjsfdlasfkj',
        email: email2,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not login facility with wrong password /', function (done) {
    request.post('/api/auth/login')
      .send({
        password: 'fldakjsfdlasfkj',
        email: email3,
      })
      .expect(406)
      .end(function (err, res) {
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.undefined;
        expect(err).to.be.a('null');
        done();
      });
  });

  // it('should logout with /logout', function (done) {
  //   request.get('/api/auth/logout')
  //     .expect(302)
  //     .end(function (err, res) {
  //       expect(res.headers.location).to.equal('/');
  //       expect(res.headers.authorization).to.be.undefined;
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });

  it('should delete a user given a correct user id', function (done) {
    request.delete('/api/user/' + u1)
      .expect(200)
      .set(u1jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function (done) {
    request.get('/api/user/' + u1)
      .expect(200)
      .set(u1jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a facility given a correct facility id', function (done) {
    request.delete('/api/facility/' + f1)
      .expect(200)
      .set(f1jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function (done) {
    request.get('/api/facility/' + f1)
      .expect(200)
      .set(f1jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });
});
