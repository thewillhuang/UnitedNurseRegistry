'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('beta api', function() {
  const email = uuid.v4();
  const email2 = uuid.v4();
  const email3 = uuid.v4();
  const email4 = uuid.v4();

  it('should signup with /signup', function(done) {
    request.post('/api/beta/signup')
      .send({
        email: email,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should signup with /signup', function(done) {
    request.post('/api/beta/signup')
      .send({
        email: email2,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should signup with /signup', function(done) {
    request.post('/api/beta/signup')
      .send({
        email: email3,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should signup with /signup', function(done) {
    request.post('/api/beta/signup')
      .send({
        email: email4,
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should get all beta users with /signup', function(done) {
    request.get('/api/beta/signup')
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body.rows).to.be.a('array');
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should delete email /signup', function(done) {
    request.delete('/api/beta/signup')
      .send({
        email: email,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body.rows).to.be.an('object');
        expect(res.body.rows.affectedRows).to.eql(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should delete email2 /signup', function(done) {
    request.delete('/api/beta/signup')
      .send({
        email: email2,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body.rows).to.be.an('object');
        expect(res.body.rows.affectedRows).to.eql(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should delete email3 /signup', function(done) {
    request.delete('/api/beta/signup')
      .send({
        email: email3,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body.rows).to.be.an('object');
        expect(res.body.rows.affectedRows).to.eql(1);
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should delete email4 /signup', function(done) {
    request.delete('/api/beta/signup')
      .send({
        email: email4,
      })
      .expect(200)
      .end(function(err, res) {
        console.log(res.body);
        expect(res.body.rows).to.be.an('object');
        expect(res.body.rows.affectedRows).to.eql(1);
        expect(err).to.be.a('null');
        done();
      });
  });
});
