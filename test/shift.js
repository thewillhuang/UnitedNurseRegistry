'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');
chai.use(chaiAsPromised);

// store primary key

describe('shift api', function () {

  it('should reject invalid get requests', function (done) {
    request.get('/api/shifts')
      .expect(404)
      .end(function (err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown shift', function (done) {
    request.get('/api/shift/abc')
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

  let u1;
  it('should insert a new user given a correct object', function (done) {
    request.post('/api/user/')
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
        u1 = res.body.rows;
        expect(u1).to.be.an('object');
        // expect(u1).to.contain('insertId');
        expect(u1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f1;
  it('should insert a new facility given a correct object', function (done) {
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
        // expect(f1).to.contain('insertId');
        expect(f1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert specialty 1 given a user id', function (done) {
    request.post('/api/userspecialty/user/' + u1.insertId)
      .send({
        specialty: 'icu'
      })
      .expect(200)
      .end(function (err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let sp1;
  it('should have 1 specialty given a user id', function (done) {
    request.get('/api/userspecialty/user/' + u1.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body.rows);
        sp1 = res.body.rows[0].specialtyID;
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(1);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  let s1;
  it('should insert a new shift given a correct object', function (done) {
    request.post('/api/shift/')
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 40.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f1.insertId
      })
      .expect(200)
      .end(function (err, res) {
        s1 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should grab a shift given a correct shift id', function (done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should return a 200 for the same data', function (done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .end(function (err, res) {
        // console.log(res);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  let updateinfo = 45.62;
  it('should update shift info given a correct object and shift id', function (done) {
    request.put('/api/shift/' + s1.insertId)
      .send({
        // shiftStartHour: 7,
        // date: '2015-09-13',
        payPerHour: updateinfo,
        // specialtyID: sp1,
        // shiftDuration: 12
      })
      .expect(200)
      .end(function (err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should get an updated shift info', function (done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows[0].payPerHour).to.equal(updateinfo);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });


  it('should delete a shift given a correct shift id', function (done) {
    request.delete('/api/shift/' + s1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift should not exist', function (done) {
    request.get('/api/shift/' + s1.insertId)
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

  it('should delete a user given a correct user id', function (done) {
    request.delete('/api/user/' + u1.insertId)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function (done) {
    request.get('/api/user/' + u1.insertId)
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
