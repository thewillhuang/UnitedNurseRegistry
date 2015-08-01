'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var supertest = require('supertest');
var app = require('../server');
var request = supertest(app.listen());
var uuid = require('node-uuid');
chai.use(chaiAsPromised);

describe('user work history api', function () {

  it('should reject invalid get requests', function (done) {
    request.get('/api/userworkhistory/user/')
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown user', function (done) {
    request.get('/api/userworkhistory/user/abc')
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.be.empty;
        expect(err).to.be.a('null');
        done();
      });
  });

  var r1;
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
        r1 = res.body.rows;
        expect(r1).to.be.an('object');
        expect(r1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f1;
  it('should insert a new work history given a correct object', function (done) {
    request.post('/api/facility/')
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: 27898503349316,
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4()
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        f1 = res.body.rows;
        expect(f1).to.be.an('object');
        expect(f1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert work history 1 given a user id', function (done) {
    request.post('/api/userworkhistory/user/' + r1.insertId + '/facility/' + f1.insertId)
      .send({
        months: 1,
        referenceName: uuid.v4(),
        referencePhone: 1234123141
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

  it('insert work history 2 given a user id', function (done) {
    request.post('/api/userworkhistory/user/' + r1.insertId + '/facility/' + f1.insertId)
      .send({
        months: 3,
        referenceName: uuid.v4(),
        referencePhone: 123123412412
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
  it('should have 2 work history given a user id', function (done) {
    request.get('/api/userworkhistory/user/' + r1.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body.rows);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userHistoryID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should 200 given same data', function (done) {
    request.get('/api/userworkhistory/user/' + r1.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body.rows);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(2);
        a1 = res.body.rows[0].userHistoryID;
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete an user work history given an history ID', function (done) {
    request.delete('/api/userworkhistory/history/' + a1)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  var a2;
  it('should have 1 work history instead of 2', function (done) {
    request.get('/api/userworkhistory/user/' + r1.insertId)
      .expect(200)
      .end(function (err, res) {
        a2 = res.body.rows[0].userHistoryID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  var newWorkHistory =  uuid.v4();
  it('should update a work history given an history id', function (done) {
    request.put('/api/userworkhistory/history/' + a2)
      .send({
        months: 3,
        referenceName: newWorkHistory,
        referencePhone: 123123412412
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

  it('should have an updated work history', function (done) {
    request.get('/api/userworkhistory/user/' + r1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.rows).to.have.deep.property('[0].referenceName', newWorkHistory);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete user work history 1 given an history ID', function (done) {
    request.delete('/api/userworkhistory/history/' + a2)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should have 0 work history instead of 1', function (done) {
    request.get('/api/userworkhistory/user/' + r1.insertId)
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
    request.delete('/api/user/' + r1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete a facility given a correct facility id', function (done) {
    request.delete('/api/facility/' + f1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility should not exist', function (done) {
    request.get('/api/facility/' + f1.insertId)
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

  it('the deleted user should not exist', function (done) {
    request.get('/api/user/' + r1.insertId)
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
