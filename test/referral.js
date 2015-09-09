'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('referral api', function() {
  // creating users
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  let jwt;
  let r1;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/signup')
      .send({
        password: password2,
        email: email2,
      })
      .expect(200)
      .end(function(err, res) {
        jwt = { Authorization: res.headers.authorization };
        // console.log(jwt);
        // console.log(res.headers);
        // console.log(res.body);
        r1 = res.body.message.scope.userID;
        // console.log(r1);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  const email1 = uuid.v4();
  const password1 = uuid.v4();
  let jwt2;
  let r2;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/signup')
      .send({
        password: password1,
        email: email1,
      })
      .expect(200)
      .end(function(err, res) {
        jwt2 = { Authorization: res.headers.authorization };
        // console.log(jwt);
        // console.log(res.headers);
        // console.log(res.body);
        r2 = res.body.message.scope.userID;
        // console.log(r1);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });
  // end of creating users
  // creating facility
  const email = uuid.v4();
  const password = uuid.v4();
  let fjwt;
  let facilityr1;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: email,
        email: password,
      })
      .expect(200)
      .end(function(err, res) {
        fjwt = { Authorization: res.headers.authorization };
        // console.log(jwt);
        // console.log(res.headers);
        // console.log(res.body);
        facilityr1 = res.body.message.scope.facilityID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should grab a facility given a correct facility id', function(done) {
    // console.log('facilityjwt', fjwt);
    request.get('/api/facility/' + facilityr1)
      .set(fjwt)
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

  // end of creating facility

  it('should reject invalid get requests', function(done) {
    request.get('/api/users')
      .expect(404)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function(done) {
    request.get('/api/user/abc')
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

  it('should grab a user given a correct user id', function(done) {
    request.get('/api/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  // start of referral testing
  // for adding users
  it('child should set referral for parent', function(done) {
    request.post('/api/referral/user/' + r1)
      .expect(200)
      .set(jwt2)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        // console.log(res.body);
        done();
      });
  });

  it('should get user referral for parent', function(done) {
    request.get('/api/referral/user/' + r1)
      .expect(200)
      .set(jwt2)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows[0].count).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  // start of wrong testing
  // using facility token
  it('child should set referral for parent', function(done) {
    request.post('/api/referral/user/' + r2)
      .expect(406)
      .set(fjwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(err).to.be.a('null');
        expect(res.body.message).to.equal('no permission');
        done();
      });
  });
  // using own token
  it('should not set yourself as your own referral', function(done) {
    request.post('/api/referral/user/' + r1)
      .expect(406)
      .set(jwt)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.body.message).to.equal('no permission');
        done();
      });
  });

  // for adding facilities
  it('child facility should set referral for parent', function(done) {
    console.log('facilityjwt', fjwt);
    request.post('/api/referral/facility/' + r1)
      .expect(200)
      .set(fjwt)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });

  it('should get facility referral for parent', function(done) {
    request.get('/api/referral/facility/' + r1)
      .expect(200)
      .set(jwt2)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });

  // test using wrong type of token
  // for falsely adding facilities
  it('child facility should set referral for parent', function(done) {
    request.post('/api/referral/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });

  it('should get facility referral for parent', function(done) {
    request.get('/api/referral/facility/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        console.log(res.body);
        done();
      });
  });

  // start of clean up

  it('should delete a user2 given a correct user id', function(done) {
    request.delete('/api/user/' + r2)
      .expect(200)
      .set(jwt2)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user2 should not exist', function(done) {
    request.get('/api/user/' + r2)
      .expect(200)
      .set(jwt2)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a user given a correct user id', function(done) {
    request.delete('/api/user/' + r1)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function(done) {
    request.get('/api/user/' + r1)
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

  it('should delete a facility given a correct facility id', function(done) {
    request.delete('/api/facility/' + facilityr1)
      .expect(200)
      .set(fjwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function(done) {
    request.get('/api/facility/' + facilityr1)
      .expect(200)
      .set(fjwt)
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
