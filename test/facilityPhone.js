'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');


describe('facility phone api', function () {
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  let jwt;
  let r1;
  it('should signup with /signup', function (done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function (err, res) {
        jwt = { Authorization: res.headers.authorization };
        r1 = res.body.message.scope.facilityID;
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
    request.get('/api/facilityphone/facility/')
      .set(jwt)
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown facility', function (done) {
    request.get('/api/facilityphone/facility/abc')
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
  // it('should create a facility', function (done) {
  //   request.post('/api/facility')
  //     .send({
  //       facilityName: uuid.v4(),
  //       facilityGeoHash: 27898503349316,
  //       facilityPwHash: uuid.v4(),
  //       facilityEMR: uuid.v4(),
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

  it('insert phone 1 given a facility id', function (done) {
    request.post('/api/facilityphone/facility/' + r1)
      .send({
        phoneNumber: 7146869860,
        ext: 121,
        phoneType: 'cell',
      })
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert phone 2 given a facility id', function (done) {
    request.post('/api/facilityphone/facility/' + r1)
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
  it('should have 2 phone numbers given a facility id', function (done) {
    request.get('/api/facilityphone/facility/' + r1)
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
    request.get('/api/facilityphone/facility/' + r1)
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

  it('should delete an facility phone given an phone ID', function (done) {
    request.delete('/api/facilityphone/facility/' + r1 + '/phone/' + a1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  let a2;
  it('should have 1 phone number instead of 2', function (done) {
    request.get('/api/facilityphone/facility/' + r1)
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
    request.put('/api/facilityphone/facility/' + r1 + '/phone/' + a2)
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
    request.get('/api/facilityphone/facility/' + r1)
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

  it('should delete facility phone 1 given an phone ID', function (done) {
    request.delete('/api/facilityphone/facility/' + r1 + '/phone/' + a2)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 phone number instead of 1', function (done) {
    request.get('/api/facilityphone/facility/' + r1)
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

  it('should delete a facility given a correct facility id', function (done) {
    request.delete('/api/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function (done) {
    request.get('/api/facility/' + r1)
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
