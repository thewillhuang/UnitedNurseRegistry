'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var supertest = require('supertest');
var app = require('../server');
var request = supertest(app.listen());
var uuid = require('node-uuid');

describe('user license api', function() {

  it('should reject invalid get requests', function(done) {
    request.get('/api/userlicense/user/')
      .expect(404)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function(done) {
    request.get('/api/userlicense/user/abc')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.be.empty;
        expect(err).to.be.a('null');
        done();
      });
  });

  var r2;
  it('should create a user', function(done) {
    request.post('/api/user')
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
        dob: '1986-04-08',
        email: uuid.v4()
      })
      .expect(200)
      .end(function(err, res) {
        r2 = res.body.rows;
        expect(r2).to.be.an('object');
        expect(r2.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert userlicense 1 given a user id', function(done) {
    request.post('/api/userlicense/user/' + r2.insertId)
      .send({
        licenseNumber: uuid.v4(),
        licenseState: 'ca',
        licensePhotoUrl: uuid.v4(),
        expiration: '2015-04-08'
      })
      .expect(200)
      .end(function(err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert userlicense 2 given a user id', function(done) {
    request.post('/api/userlicense/user/' + r2.insertId)
      .send({
        licenseNumber: uuid.v4(),
        licenseState: 'ca',
        licensePhotoUrl: uuid.v4(),
        expiration: '2015-04-08'
      })
      .expect(200)
      .end(function(err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  var a1;
  it('should have 2 license given a user id', function(done) {
    request.get('/api/userlicense/user/' + r2.insertId)
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userLicenseID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 given same data', function(done) {
    request.get('/api/userlicense/user/' + r2.insertId)
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userLicenseID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete userlicense 1 given an userlicense ID', function(done) {
    request.delete('/api/userlicense/license/' + a1)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  var a2;
  it('should have 1 userlicense instead of 2', function(done) {
    request.get('/api/userlicense/user/' + r2.insertId)
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        a2 = res.body.rows[0].userLicenseID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  var newLicense = 'D6262649';
  it('should update a userlicense given an userlicense id', function(done) {
    request.put('/api/userlicense/license/' + a2)
      .send({
        licenseNumber: newLicense,
        licenseState: 'ca',
        licensePhotoUrl: uuid.v4()
      })
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have an updated userlicense', function(done) {
    request.get('/api/userlicense/user/' + r2.insertId)
      .expect(200)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].licenseNumber', newLicense);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete userlicense 2 given an userlicense ID', function(done) {
    request.delete('/api/userlicense/license/' + a2)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 userlicense instead of 1', function(done) {
    request.get('/api/userlicense/user/' + r2.insertId)
      .expect(200)
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

  it('should delete a user given a correct user id', function(done) {
    request.delete('/api/user/' + r2.insertId)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function(done) {
    request.get('/api/user/' + r2.insertId)
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
