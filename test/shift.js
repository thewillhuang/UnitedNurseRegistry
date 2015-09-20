'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');
const geohash = require('ngeohash');

describe('shift api', function() {
  let u1jwt;
  let u1;
  it('should signup with /signup', function(done) {
    request.post('/api/auth/signup')
      .send({
        password: uuid.v4(),
        email: uuid.v4(),
      })
      .expect(200)
      .end(function(err, res) {
        u1jwt = { Authorization: res.headers.authorization };
        u1 = res.body.message.scope.userID;
        // console.log(u1jwt);
        // console.log(res.headers);
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f1;
  let f1jwt;
  it('should signup facility with /facility/signup', function(done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: uuid.v4(),
        email: uuid.v4(),
      })
      .expect(200)
      .end(function(err, res) {
        f1jwt = { Authorization: res.headers.authorization };
        // console.log(u1jwt);
        // console.log(res.headers);
        // console.log(res.body);
        f1 = res.body.message.scope.facilityID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f2;
  let f2jwt;
  it('should signup facility with /facility/signup', function(done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: uuid.v4(),
        email: uuid.v4(),
      })
      .expect(200)
      .end(function(err, res) {
        f2jwt = { Authorization: res.headers.authorization };
        // console.log(u1jwt);
        // console.log(res.headers);
        // console.log(res.body);
        f2 = res.body.message.scope.facilityID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  let f3;
  let f3jwt;
  it('should signup facility with /facility/signup', function(done) {
    request.post('/api/auth/facility/signup')
      .send({
        password: uuid.v4(),
        email: uuid.v4(),
      })
      .expect(200)
      .end(function(err, res) {
        f3jwt = { Authorization: res.headers.authorization };
        // console.log(u1jwt);
        // console.log(res.headers);
        // console.log(res.body);
        f3 = res.body.message.scope.facilityID;
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should reject invalid get requests', function(done) {
    request.get('/api/shifts')
      .expect(404)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown shift', function(done) {
    request.get('/api/shift/abc')
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should update a new facility given a correct object', function(done) {
    request.put('/api/facility/' + f1)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: '9qh0b55sd',
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4(),
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not update a new facility given a correct object but wrong token', function(done) {
    request.put('/api/facility/' + f1)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: '9qh0b55sd',
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4(),
      })
      .expect(200)
      .set(f2jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.message).to.equal('no permission');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should update a new facility given a correct object', function(done) {
    request.put('/api/facility/' + f2)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: '9qh109',
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4(),
      })
      .expect(200)
      .set(f2jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not update a new facility given a correct object but wrong id', function(done) {
    request.put('/api/facility/' + f2)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: '9qh109',
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4(),
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.message).to.equal('no permission');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should update a new facility given a correct object', function(done) {
    request.put('/api/facility/' + f3)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: '9qh0b5',
        facilityPwHash: uuid.v4(),
        facilityEMR: uuid.v4(),
      })
      .expect(200)
      .set(f3jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('insert specialty 1 given a user id', function(done) {
    request.post('/api/userspecialty/user/' + u1)
      .send({
        specialty: 'icu',
      })
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res).to.be.an('object');
        expect(res.body.rows.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let sp1;
  it('should have 1 specialty given a user id', function(done) {
    request.get('/api/userspecialty/user/' + u1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
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
  it('should insert a new shift given a correct object', function(done) {
    request.post('/api/shift/facility/' + f1)
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 40.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f1,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        s1 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should grab a shift given a correct shift id', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should return a 200 for the same data', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const updateinfo = 45.62;
  it('should update shift info given a correct object and shift id', function(done) {
    request.put('/api/shift/facility/' + f1 + '/shift/' + s1.insertId)
      .send({
        payPerHour: updateinfo,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should get an updated shift info', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body.rows[0].payPerHour).to.equal(updateinfo);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  const updateinfo2 = 34.43;
  it('make an unauthroized update to the status of the shift with the shift id', function(done) {
    request.put('/api/shift/facility/' + f1 + '/shift/' + s1.insertId)
      .send({
        payPerHour: updateinfo2,
        facilityPaid: 1,
        open: 0,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should not change shift status related to the payment of the shift ', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows[0].facilityPaid).to.equal(0);
        expect(res.body.rows[0].payPerHour).to.equal(updateinfo2);
        expect(res.body.rows[0].open).to.equal(1);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  let s2;
  it('should insert shift 2 given a correct object', function(done) {
    request.post('/api/shift/facility/' + f1)
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 41.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f1.insertId,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        s2 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let s3;
  it('should insert shift 3 given a correct object', function(done) {
    request.post('/api/shift/facility/' + f1)
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 60.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f1.insertId,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        s3 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should return an array of 3 different shifts posted by the hospital', function(done) {
    request.get('/api/shift/facility/' + f1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length(3);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete shift 1 given a correct shift id', function(done) {
    request.delete('/api/shift/facility/' + f1 + '/shift/' + s1.insertId)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  let s4;
  it('should insert shift 4 given a correct object', function(done) {
    request.post('/api/shift/facility/' + f2)
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 60.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f2.insertId,
      })
      .expect(200)
      .set(f2jwt)
      .end(function(err, res) {
        s4 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  let s5;
  it('should insert shift 5 given a correct object', function(done) {
    request.post('/api/shift/facility/' + f3)
      .send({
        shiftStartHour: 7,
        date: '2015-09-13',
        payPerHour: 60.60,
        specialtyID: sp1,
        shiftDuration: 12,
        facilityID: f3.insertId,
      })
      .expect(200)
      .set(f3jwt)
      .end(function(err, res) {
        s5 = res.body.rows;
        // console.log(s1);
        expect(s1).to.be.an('object');
        // expect(s1).to.contain('insertId');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  const hash = '9qh1';
  const hashset = geohash.neighbors(hash);
  it('should return an array of 4 different open shifts posted by different hospitals matching the search area', function(done) {
    request.post('/api/shift/geohash/' + hash + '/precision/' + 4)
      .send({
        hashSet: hashset,
      })
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        // console.log(res.body.rows[0]);
        // console.log(res.headers);
        // console.log(res.body.rows);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].open).to.equal(1);
        expect(res.body.rows[1].open).to.equal(1);
        expect(res.body.rows[2].open).to.equal(1);
        expect(res.body.rows[3].open).to.equal(1);
        expect(res.body.rows).to.be.an('array');
        expect(res.body.rows).to.have.length.above(3);
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  // it should get active shifts for the hospital given the right token and facility ID
  it('should return active shifts, open and pending shifts from the hospital', function(done) {
    request.get('/api/shift/active/' + f1)
    .expect(200)
    .set(f1jwt)
    .end(function(err, res) {
      console.log(res.body);
      expect(res.body).to.be.an('object');
      expect(res.body.rows).to.be.not.empty;
      expect(res.body.rows[0].open).to.equal(1);
      expect(res.body.rows[1].open).to.equal(1);
      // expect(res.body.rows[2].open).to.equal(1);
      expect(res.body.rows).to.be.an('array');
      expect(res.body.rows).to.have.length.above(1);
      expect(res.body.fields).to.be.an('array');
      expect(err).to.be.a('null');
      done();
    });
  });

  // it should not get active shifts for the hospital given the wrong facility token and facility ID
  it('should not return active shifts, open and pending shifts from the hospital', function(done) {
    request.get('/api/shift/active/' + f1)
    .expect(406)
    .set(f2jwt)
    .end(function(err, res) {
      expect(res.body.message).to.equal('no permission');
      expect(err).to.be.a('null');
      done();
    });
  });


  // it should not get active shifts for the hospital given the wrong user token and facility ID
  it('should not return active shifts, open and pending shifts from the hospital', function(done) {
    request.get('/api/shift/active/' + f1)
    .expect(406)
    .set(u1jwt)
    .end(function(err, res) {
      expect(res.body.message).to.equal('no permission');
      expect(err).to.be.a('null');
      done();
    });
  });

  it('should delete shift 2 given a correct shift id', function(done) {
    request.delete('/api/shift/facility/' + f1 + '/shift/' + s2.insertId)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete shift 3 given a correct shift id', function(done) {
    request.delete('/api/shift/facility/' + f1 + '/shift/' + s3.insertId)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete shift 4 given a correct shift id', function(done) {
    request.delete('/api/shift/facility/' + f2 + '/shift/' + s4.insertId)
      .expect(200)
      .set(f2jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete shift 5 given a correct shift id', function(done) {
    request.delete('/api/shift/facility/' + f3 + '/shift/' + s5.insertId)
      .expect(200)
      .set(f3jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift 1 should not exist', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift 2 should not exist', function(done) {
    request.get('/api/shift/' + s2.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift 3 should not exist', function(done) {
    request.get('/api/shift/' + s3.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift 4 should not exist', function(done) {
    request.get('/api/shift/' + s4.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted shift 5 should not exist', function(done) {
    request.get('/api/shift/' + s5.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete facility 1 given a correct facility id', function(done) {
    request.delete('/api/facility/' + f1)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete facility 2 given a correct facility id', function(done) {
    request.delete('/api/facility/' + f2)
      .expect(200)
      .set(f2jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should delete facility 3 given a correct facility id', function(done) {
    request.delete('/api/facility/' + f3)
      .expect(200)
      .set(f3jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility 1 should not exist', function(done) {
    request.get('/api/facility/' + f1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility 2 should not exist', function(done) {
    request.get('/api/facility/' + f2)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility 3 should not exist', function(done) {
    request.get('/api/facility/' + f3)
      .expect(200)
      .set(u1jwt)
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
    request.delete('/api/user/' + u1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user should not exist', function(done) {
    request.get('/api/user/' + u1)
      .expect(200)
      .set(u1jwt)
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
