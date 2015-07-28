'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var supertest = require('supertest');
var app = require('../server');
var request = supertest(app.listen());
var uuid = require('node-uuid');
chai.use(chaiAsPromised);

describe('user address api', function () {

  it('should reject invalid get requests', function (done) {
    request.get('/api/useraddress/user/')
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function (done) {
    request.get('/api/useraddress/user/abc')
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
  it('should create a user', function (done) {
    request.post('/api/user')
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
        dob: '1986-04-08',
        userName: uuid.v4()
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

  it('insert address 1 given a user id', function (done) {
    request.post('/api/useraddress/user/' + r2.insertId)
      .send({
        address: '2950 arboridge ct.',
        city: 'fullerton',
        state: 'ca',
        zip: '92835'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert address 2 given a user id', function (done) {
    request.post('/api/useraddress/user/' + r2.insertId)
      .send({
        address: '2952 arboridge ct.',
        city: 'fullerton',
        state: 'ca',
        zip: '92835'
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  var a1;
  it('should have 2 address given a user id', function (done) {
    request.get('/api/useraddress/user/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].addressID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });


  it('should delete user address 1 given an address ID', function (done) {
    request.delete('/api/useraddress/address/' + a1)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  var a2;
  it('should have 1 address instead of 2', function (done) {
    request.get('/api/useraddress/user/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        a2 = res.body.rows[0].addressID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should update an address given an address id', function (done) {
    request.put('/api/useraddress/address/' + a2)
      .send({
        address: '2952 arboridge ct.',
        city: 'irvine',
        state: 'ca',
        zip: '92835'
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

  it('should have an updated address', function (done) {
    request.get('/api/useraddress/user/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].city', 'irvine');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete user address 2 given an address ID', function (done) {
    request.delete('/api/useraddress/address/' + a2)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 address instead of 1', function (done) {
    request.get('/api/useraddress/user/' + r2.insertId)
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

  it('should delete a user given a correct user id', function (done) {
    request.delete('/api/user/' + r2.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

});
