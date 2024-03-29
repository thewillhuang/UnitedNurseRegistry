'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');


describe('user phone api', function () {
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  let jwt;
  let r1;
  it('should signup with /signup', function (done) {
    request.post('/api/auth/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function (err, res) {
        jwt = { Authorization: res.headers.authorization };
        r1 = res.body.message.scope.userID;
        // console.log(jwt);
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should reject invalid get requests', function (done) {
    request.get('/api/userphone/user/')
      .expect(404)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function (done) {
    request.get('/api/userphone/user/abc')
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.be.empty;
        expect(err).to.be.a('null');
        done();
      });
  });

  // let r2;
  // it('should create a user', function (done) {
  //   request.post('/api/user')
  //     .send({
  //       firstName: 'william',
  //       lastName: 'huang',
  //       middleName: 'w',
  //       userGeoHash: 27898503349316,
  //       userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
  //       dob: '1986-04-08',
  //       email: uuid.v4(),
  //     })
  //     .expect(200)
  //     .set(jwt)
  //     .end(function (err, res) {
  //       r2 = res.body.rows;
  //       expect(r2).to.be.an('object');
  //       expect(r1).to.be.an('number');
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });

  it('insert phone 1 given a user id', function (done) {
    request.post('/api/userphone/user/' + r1)
      .send({
        phoneNumber: 7146869860,
        ext: 121,
        phoneType: 'cell',
      })
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert phone 2 given a user id', function (done) {
    request.post('/api/userphone/user/' + r1)
      .send({
        phoneNumber: 7146740833,
        ext: 1211,
        phoneType: 'mobile',
      })
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let a1;
  it('should have 2 phone numbers given a user id', function (done) {
    request.get('/api/userphone/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].phoneID;
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 given same data', function (done) {
    request.get('/api/userphone/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].phoneID;
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete an user phone given an phone ID', function (done) {
    request.delete('/api/userphone/user/' + r1 + '/phone/' + a1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  let a2;
  it('should have 1 phone number instead of 2', function (done) {
    request.get('/api/userphone/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        a2 = res.body.rows[0].phoneID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const newPhone = '9095699742';
  it('should update a phone number given an phone id', function (done) {
    request.put('/api/userphone/user/' + r1 + '/phone/' + a2)
      .send({
        phoneNumber: newPhone,
        ext: 1337,
        phoneType: 'cell',
      })
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have an updated phone number', function (done) {
    request.get('/api/userphone/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].phoneNumber', newPhone);
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete user phone 1 given an phone ID', function (done) {
    request.delete('/api/userphone/user/' + r1 + '/phone/' + a2)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 phone number instead of 1', function (done) {
    request.get('/api/userphone/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(0);
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a user given a correct user id', function (done) {
    request.delete('/api/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function (done) {
    request.get('/api/user/' + r1)
      .expect(200)
      .set(jwt)
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
