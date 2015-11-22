'use strict';

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app.listen());
const uuid = require('node-uuid');

describe('shift reviews api', function() {
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

  it('should reject invalid get requests', function(done) {
    request.get('/api/shiftReview')
      .expect(404)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should respond with empty array with unknown shift', function(done) {
    request.get('/api/shiftReview/user/shift/313')
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

  it('should respond with empty array with unknown shift', function(done) {
    request.get('/api/shiftReview/facility/shift/313')
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

  it('should update new user given a correct object', function(done) {
    request.put('/api/user/' + u1)
      .send({
        firstName: 'william',
        lastName: 'huang',
        middleName: 'w',
        userGeoHash: 27898503349316,
        userPwHash: '$2a$10$0vm3IMzEqCJwDwGNQzJYxOznt7kjXELjLOpOUcC7BjYTTEEksuhqy',
        dob: '1986-04-08',
        email: uuid.v4(),
      })
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(err).to.be.a('null');
        done();
      });
  });

  it('should insert a new facility given a correct object', function(done) {
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
        expect(res.body).to.be.an('object');
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
        expect(s1).to.be.an('object');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        expect(err).to.be.null;
        done();
      });
  });

  it('should set a shift status as pending', function(done) {
    request.put('/api/shiftstatus/pending/shift/' + s1.insertId + '/user/' + u1 + '/facility/' + f1)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows);
        expect(err).to.be.null;
        done();
      });
  });

  // // user review tests

  it('should post a user review of 5', function(done) {
    request.post('/api/shiftreview/user/' + s1.insertId)
      .send({
        review: 5,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.null;
        done();
      });
  });

  it('should get a user review of the same user back and it review should have a rating of 5', function(done) {
    request.get('/api/shiftreview/user/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(5);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  it('should post a user review of 5', function(done) {
    request.put('/api/shiftreview/user/' + s1.insertId)
      .send({
        review: 4,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.null;
        done();
      });
  });

  it('should get an updated user review of the same user back and it review should have a rating of 4', function(done) {
    request.get('/api/shiftreview/user/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(4);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  let s2;
  it('should insert a new shift (shift 2) given a correct object', function(done) {
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
        s2 = res.body.rows;
        expect(s1).to.be.an('object');
        expect(s1.insertId).to.be.an('number');
        expect(err).to.be.a('null');
        expect(err).to.be.null;
        done();
      });
  });

  it('should set a shift status as pending', function(done) {
    request.put('/api/shiftstatus/pending/shift/' + s2.insertId + '/user/' + u1 + '/facility/' + f1)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body.rows.affectedRows);
        expect(err).to.be.null;
        done();
      });
  });

  it('should post a user review of 1', function(done) {
    request.post('/api/shiftreview/user/' + s2.insertId)
      .send({
        review: 1,
      })
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.null;
        done();
      });
  });

  it('should get a user review of the same user back and it review should have a rating of 1', function(done) {
    request.get('/api/shiftreview/user/shift/' + s2.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(1);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  it('should get an user average review of 2.5, rating 1 and rating updated (4)', function(done) {
    request.get('/api/shiftreview/avg/user/' + u1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].avgReview).to.equal(2.5);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  // facility review tests

  // it('should post a facility review of 5', function(done) {
  //   request.post('/api/shiftreview/facility/' + f1 + '/shift/' + s1.insertId)
  //     .send({
  //       review: 1,
  //     })
  //     .expect(200)
  //     .set(f1jwt)
  //     .end(function(err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.not.empty;
  //       expect(res.body.rows.affectedRows).to.equal(1);
  //       expect(res.body.rows).to.be.an('object');
  //       expect(err).to.be.null;
  //       done();
  //     });
  // });

  it('should post a facility review of 1', function(done) {
    request.post('/api/shiftreview/facility/' + s1.insertId)
    .send({
      review: 1,
    })
    .set(u1jwt)
    .end(function(err, res) {
      expect(res.body).to.be.an('object');
      expect(res.body.rows).to.be.not.empty;
      expect(res.body.rows.affectedRows).to.equal(1);
      expect(res.body.rows).to.be.an('object');
      done();
    });
  });

  it('should get a facility review back and it review should have a rating of 1', function(done) {
    request.get('/api/shiftreview/facility/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(1);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  // it('should update a user review to 5', function(done) {
  //   request.put('/api/shiftreview/facility/' + f1 + '/shift/' + s1.insertId)
  //     .send({
  //       review: 5,
  //     })
  //     .expect(200)
  //     .set(f1jwt)
  //     .end(function(err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.not.empty;
  //       expect(res.body.rows.affectedRows).to.equal(1);
  //       expect(res.body.rows).to.be.an('object');
  //       expect(err).to.be.null;
  //       done();
  //     });
  // });


  it('should post a facility review of 5', function(done) {
    request.put('/api/shiftreview/facility/' + s1.insertId)
    .send({
      review: 5,
    })
    .set(u1jwt)
    .end(function(err, res) {
      expect(res.body).to.be.an('object');
      expect(res.body.rows).to.be.not.empty;
      expect(res.body.rows.affectedRows).to.equal(1);
      expect(res.body.rows).to.be.an('object');
      done();
    });
  });

  it('should get an updated facility review back and it review should have a rating of 5', function(done) {
    request.get('/api/shiftreview/facility/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(5);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  // it('should post a facility review of 1', function(done) {
  //   request.post('/api/shiftreview/facility/' + f1 + '/shift/' + s2.insertId)
  //     .send({
  //       review: 1,
  //     })
  //     .expect(200)
  //     .set(f1jwt)
  //     .end(function(err, res) {
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.rows).to.be.not.empty;
  //       expect(res.body.rows.affectedRows).to.equal(1);
  //       expect(res.body.rows).to.be.an('object');
  //       expect(err).to.be.null;
  //       done();
  //     });
  // });


  it('should post a facility review of 1', function(done) {
    request.post('/api/shiftreview/facility/' + s2.insertId)
    .send({
      review: 1,
    })
    .set(u1jwt)
    .end(function(err, res) {
      expect(res.body).to.be.an('object');
      expect(res.body.rows).to.be.not.empty;
      expect(res.body.rows.affectedRows).to.equal(1);
      expect(res.body.rows).to.be.an('object');
      done();
    });
  });

  it('should get a facility review back and it review should have a rating of 1', function(done) {
    request.get('/api/shiftreview/facility/shift/' + s2.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].review).to.equal(1);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  it('should get an user average review of 3, rating 1 and rating updated (5)', function(done) {
    request.get('/api/shiftreview/avg/facility/' + f1)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows[0].avgReview).to.equal(3);
        expect(res.body.rows).to.be.an('array');
        expect(err).to.be.null;
        done();
      });
  });

  it('should delete a user review 1 given the correct parameters', function(done) {
    request.delete('/api/shiftreview/user/' + u1 + '/shift/' + s1.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.null;
        done();
      });
  });

  it('should delete a user review 2 given the correct parameters', function(done) {
    request.delete('/api/shiftreview/user/' + u1 + '/shift/' + s2.insertId)
      .expect(200)
      .set(u1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.not.empty;
        expect(res.body.rows.affectedRows).to.equal(1);
        expect(res.body.rows).to.be.an('object');
        expect(err).to.be.null;
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

  it('the deleted shift 1 should not exist', function(done) {
    request.get('/api/shift/' + s1.insertId)
      .expect(200)
      .set(f1jwt)
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
      .set(f1jwt)
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

  it('the deleted facility should not exist', function(done) {
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

  it('the deleted user review 1 should not exist', function(done) {
    request.get('/api/shiftreview/user/shift/' + s1.insertId)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        // console.log(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted user review 2 should not exist', function(done) {
    request.get('/api/shiftreview/user/shift/' + s2.insertId)
      .expect(200)
      .set(f1jwt)
      .end(function(err, res) {
        expect(res.body).to.be.an('object');
        expect(res.body.rows).to.be.empty;
        expect(res.body.rows).to.be.an('array');
        expect(res.body.fields).to.be.an('array');
        expect(err).to.be.a('null');
        done();
      });
  });

  it('the deleted facility review 1 by cascading foreign key should not exist', function(done) {
    request.get('/api/shiftreview/facility/shift/' + s1.insertId)
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

  it('the deleted facility review 2 cascading foreign key should not exist', function(done) {
    request.get('/api/shiftreview/facility/shift/' + s2.insertId)
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
