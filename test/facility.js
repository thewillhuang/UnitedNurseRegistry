'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

// store primary key
describe('facility api', function() {
  const email2 = uuid.v4();
  const password2 = uuid.v4();
  let jwt;
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
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should reject invalid get requests', function(done) {
    request.get('/api/facility/')
      .expect(405)
      .set(jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown facility', function(done) {
    request.get('/api/facility/abc')
      .set(jwt)
      .expect(200)
      .end(function(err, res) {
        console.log(res.headers);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  let r1;
  const facilityName = uuid.v4();
  const facilityPwHash = uuid.v4();
  it('should insert a new facility given a correct object', function(done) {
    request.post('/api/facility/')
      .send({
        facilityName: facilityName,
        facilityGeoHash: 27898503349316,
        facilityPwHash: facilityPwHash,
        facilityEMR: uuid.v4(),
      })
      .set(jwt)
      .expect(200)
      .end(function(err, res) {
        r1 = res.body.rows;
        expect(r1).to.be.an('object');
        expect(r1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should validate facility password and facilityname', function(done) {
    request.post('/api/facility/validate/')
      .send({
        facilityName: facilityName,
        facilityPwHash: facilityPwHash,
      })
      .set(jwt)
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should grab a facility given a correct facility id', function(done) {
    request.get('/api/facility/' + r1.insertId)
      .set(jwt)
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

  it('should return a 200 for the same data', function(done) {
    request.get('/api/facility/' + r1.insertId)
      .set(jwt)
      .expect(200)
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

  const updateinfo = uuid.v4();
  it('should update facility info given a correct object and facility id', function(done) {
    request.put('/api/facility/' + r1.insertId)
      .send({
        facilityName: uuid.v4(),
        facilityGeoHash: 27898503349316,
        facilityPwHash: uuid.v4(),
        facilityEMR: updateinfo,
      })
      .set(jwt)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should get an updated facility info', function(done) {
    request.get('/api/facility/' + r1.insertId)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows[0].facilityEMR).to.equal(updateinfo);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should deconste a facility given a correct facility id', function(done) {
    request.delete('/api/facility/' + r1.insertId)
      .expect(200)
      .set(jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deconsted facility should not exist', function(done) {
    request.get('/api/facility/' + r1.insertId)
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
