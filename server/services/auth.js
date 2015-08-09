'use strict';
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const query = require('./query');
const bcrypt = require('./bcrypt');
// const pool = require('./pool');
// const mysql = require('mysql');
// const options = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'unrdb',
//   connectionLimit: 100,
//   // ssl: 'Amazon RDS'
// };
// const pool = mysql.createPool(options);


// promise version
passport.use(new LocalStrategy({session: false},
  function(username, password, done) {
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'userName', username];
    query(q).then(function(result) {
      if (!result.rows.length) { return done(null, false, {message: 'Incorrect username.'}); }
      return result.rows[0].userPwHash;
    }).then(function(dbpwhash) {
      return bcrypt.compareAsync(password, dbpwhash);
    }).then(function(isMatch) {
      if (!isMatch) { return done(null, false, {message: 'Incorrect password.'}); }
      return done(null, {userName: username});
    }).catch(function(error) {
      console.log(error);
    });
  }
));

// // callback version
// passport.use(new LocalStrategy({session: false},
//   function(username, password, done) {
//     pool.getConnection(function(connectionError, connection) {
//       console.log('connection error', connectionError);
//       const q = {};
//       q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
//       q.values = ['userPwHash', 'user', 'userName', username];
//       connection.query(q, function(err, rows) {
//         console.log('query error', err);
//         console.log('rows', rows);
//         if (err) {return done(err); }
//         if (!rows.length) {
//           return done(null, false, {message: 'Incorrect username.'});
//         }
//         const dbpwhash = rows[0].userPwHash;
//         bcrypt.compare(password, dbpwhash, function(hashError, match) {
//           console.log('hasherror', hashError);
//           if (match) { return done(null, {userName: username}); }
//           if (!match) {return done(null, false, {message: 'Incorrect password.'}); }
//         });
//         connection.close();
//       });
//       pool.end();
//     });
//   }
// ));

// test
// const test = function(username, password, done) {
//     // promise version
//     const q = {};
//     q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
//     q.values = ['userPwHash', 'user', 'userName', username];
//     query(q).then(function(result) {
//       if (!result.rows.length) { return done(null, false, {message: 'Incorrect username.'}); }
//       return result.rows[0].userPwHash;
//     }).then(function(dbpwhash) {
//       return bcrypt.compareAsync(password, dbpwhash);
//     }).then(function(isMatch) {
//       if (!isMatch) { return done(null, false, {message: 'Incorrect password.'}); }
//       return done(null, {userName: username});
//     }).catch(function(error) {
//       // console.log(error);
//     });
//   };
//
// test('afdsdfa', 'fdsafdsafds', function(a, b, c) {
//   console.log(a);
//   console.log(b);
//   console.log(c);
// });

// const FacebookStrategy = require('passport-facebook').Strategy
// passport.use(new FacebookStrategy({
//     clientID: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))
//
// const TwitterStrategy = require('passport-twitter').Strategy
// passport.use(new TwitterStrategy({
//     consumerKey: 'your-consumer-key',
//     consumerSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))
//
// const GoogleStrategy = require('passport-google-auth').Strategy
// passport.use(new GoogleStrategy({
//     clientId: 'your-client-id',
//     clientSecret: 'your-secret',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user)
//   }
// ))
