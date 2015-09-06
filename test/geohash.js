'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('geohash api', function() {
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
        // console.log(r1);
        expect(res.body).to.be.an('object');
        expect(res.headers.authorization).to.be.a('string');
        expect(res.headers.authorization).to.contain('Bearer');
        expect(err).to.be.a('null');
        done();
      });
  });
  it('should make a call to google api to get long and lat', function(done) {
    request.post('/api/geohash')
      .send({
        address: '2950 arboridge ct fullerton ca 92835',
      })
      .set(jwt)
      .expect(200)
      .end(function(err, res) {
        console.log(res.body.results[0].geometry.location);
        expect(res.body.results[0].geometry.location).to.be.an('object');
        // expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });
});
