'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');


describe('facility user api', function() {
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  let jwt;
  let r1;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function(err, res) {
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

  it('should reject invalid get requests', function(done) {
    request.get('/api/facilityuser/facility/')
      .expect(404)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown facility', function(done) {
    request.get('/api/facilityuser/facility/abc')
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.be.equal('no permission');
        expect(err).to.be.a('null');
        done();
      });
  });

  // let r2;
  // it('should create a facility', function(done) {
  //   request.post('/api/facility')
  //     .send({
  //       facilityName: uuid.v4(),
  //       facilityGeoHash: 27898503349316,
  //       facilityPwHash: uuid.v4(),
  //       facilityEMR: uuid.v4(),
  //     })
  //     .expect(200)
  //     .set(jwt)
  //     .end(function(err, res) {
  //       r2 = res.body.rows;
  //       expect(r2).to.be.an('object');
  //       expect(r1).to.be.an('number');
  //       expect(err).to.be.a('null');
  //       done();
  //     });
  // });

  it('insert user 1 given a facility id', function(done) {
    request.post('/api/facilityuser/facility/' + r1)
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: uuid.v4(),
        dob: '1986-04-08',
        email: uuid.v4(),
      })
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert user 2 given a facility id', function(done) {
    request.post('/api/facilityuser/facility/' + r1)
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: uuid.v4(),
        dob: '1986-04-08',
        email: uuid.v4(),
      })
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let a1;
  it('should have 2 user numbers given a facility id', function(done) {
    request.get('/api/facilityuser/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 given same data', function(done) {
    request.get('/api/facilityuser/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete an facility user given an user ID', function(done) {
    request.delete('/api/facilityuser/facility/' + r1 + '/user/' + a1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  let a2;
  it('should have 1 user number instead of 2', function(done) {
    request.get('/api/facilityuser/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        a2 = res.body.rows[0].userID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const newuser = uuid.v4();
  it('should update a user number given an user id', function(done) {
    request.put('/api/facilityuser/facility/' + r1 + '/user/' + a2)
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: uuid.v4(),
        dob: '1986-04-08',
        email: newuser,
      })
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have an updated user name', function(done) {
    request.get('/api/facilityuser/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        // console.log(res.body);
        // console.log(newuser);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].email', newuser);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete facility user 1 given an user ID', function(done) {
    request.delete('/api/facilityuser/facility/' + r1 + '/user/' + a2)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 user number instead of 1', function(done) {
    request.get('/api/facilityuser/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(0);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a facility given a correct facility id', function(done) {
    request.delete('/api/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function(done) {
    request.get('/api/facility/' + r1)
      .expect(200)
      .set(jwt)
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
