'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('user schedule api', function () {
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
    request.get('/api/userschedule/user/')
      .expect(404)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function (done) {
    request.get('/api/userschedule/user/abc')
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

  it('insert schedule 1 given a user id', function (done) {
    request.post('/api/userschedule/user/' + r1)
      .send({
        shiftStart: 7,
        shiftDuration: 12,
        dayOfWeek: 1,
        minimumPayPerHour: 40.52,
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

  it('insert schedule 2 given a user id', function (done) {
    request.post('/api/userschedule/user/' + r1)
      .send({
        shiftStart: 7,
        shiftDuration: 12,
        dayOfWeek: 1,
        minimumPayPerHour: 40.51,
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
  it('should have 2 schedule given a user id', function (done) {
    request.get('/api/userschedule/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body.rows);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userScheduleID;
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 given same data', function (done) {
    request.get('/api/userschedule/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        // console.log(res.body.rows);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userScheduleID;
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete an user schedule given an schedule ID', function (done) {
    request.delete('/api/userschedule/user/' + r1 + '/schedule/' + a1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  let a2;
  it('should have 1 schedule instead of 2', function (done) {
    request.get('/api/userschedule/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        a2 = res.body.rows[0].userScheduleID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const newSchedule = 7;
  it('should update a schedule given an schedule id', function (done) {
    request.put('/api/userschedule/user/' + r1 + '/schedule/' + a2)
      .send({
        shiftStart: 7,
        shiftDuration: 12,
        dayOfWeek: newSchedule,
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

  it('should have an updated schedule', function (done) {
    request.get('/api/userschedule/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].dayOfWeek', newSchedule);
        // expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete user schedule 1 given an schedule ID', function (done) {
    request.delete('/api/userschedule/user/' + r1 + '/schedule/' + a2)
      .expect(200)
      .set(jwt)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 phone number instead of 1', function (done) {
    request.get('/api/userschedule/user/' + r1)
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
