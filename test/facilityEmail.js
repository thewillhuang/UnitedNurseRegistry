'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var supertest = require('supertest');
var app = require('../server');
var request = supertest(app.listen());
var uuid = require('node-uuid');


describe('facility email api', function () {

  it('should reject invalid get requests', function (done) {
    request.get('/api/facilityemail/facility/')
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown facility', function (done) {
    request.get('/api/facilityemail/facility/abc')
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.be.empty;
        expect(err).to.be.a('null');
        done();
      });
  });

  var r2;
  it('should create a facility', function (done) {
    request.post('/api/facility')
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: 27898503349316,
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4()
      })
      .expect(200)
      .end(function (err, res) {
        r2 = res.body.rows;
        expect(r2).to.be.an('object');
        expect(r2.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert email 1 given a facility id', function (done) {
    request.post('/api/facilityemail/facility/' + r2.insertId)
      .send({
        emailAddress: uuid.v4()
      })
      .expect(200)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert email 2 given a facility id', function (done) {
    request.post('/api/facilityemail/facility/' + r2.insertId)
      .send({
        emailAddress: uuid.v4()
      })
      .expect(200)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  var a1;
  it('should have 2 email addresses given a facility id', function (done) {
    request.get('/api/facilityemail/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].emailID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 for same request', function (done) {
    request.get('/api/facilityemail/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].emailID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete email 1 given an email ID', function (done) {
    request.delete('/api/facilityemail/email/' + a1)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  var a2;
  it('should have 1 email instead of 2', function (done) {
    request.get('/api/facilityemail/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        a2 = res.body.rows[0].emailID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  var newemail = uuid.v4();
  it('should update an email given an email id', function (done) {
    request.put('/api/facilityemail/email/' + a2)
      .send({
        emailAddress: newemail
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have an updated email', function (done) {
    request.get('/api/facilityemail/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].emailAddress', newemail);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete email 2 given an email ID', function (done) {
    request.delete('/api/facilityemail/email/' + a2)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 address instead of 1', function (done) {
    request.get('/api/facilityemail/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
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

  it('should delete a facility given a correct facility id', function (done) {
    request.delete('/api/facility/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function (done) {
    request.get('/api/facility/' + r2.insertId)
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

});
