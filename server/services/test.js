'ust strict';
const bcrypt = require('./bcrypt');
const mysql = require('mysql');
const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unrdb',
  connectionLimit: 10,
  // ssl: 'Amazon RDS'
};
const pool = mysql.createPool(options);

function test(username, password, done) {
  pool.getConnection(function(connectionError, connection) {
    console.log('connection error', connectionError);
    const q = {};
    q.sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
    q.values = ['userPwHash', 'user', 'userName', username];
    connection.query(q, function(err, rows) {
      console.log('query error', err);
      console.log('rows', rows);
      if (err) {return done(err); }
      if (!rows.length) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      const dbpwhash = rows[0].userPwHash;
      bcrypt.compare(password, dbpwhash, function(hashError, match) {
        console.log('hasherror', hashError);
        if (match) { return done(null, {userName: username}); }
        if (!match) {return done(null, false, {message: 'Incorrect password.'}); }
      });
      connection.close();
    });
    pool.end();
  });
  // User.findOne({ username: username }, function(err, user) {
  //   if (err) { return done(err); }
  //   if (!user) {
  //     return done(null, false, { message: 'Incorrect username.' });
  //   }
  //   if (!user.validPassword(password)) {
  //     return done(null, false, { message: 'Incorrect password.' });
  //   }
  //   return done(null, user);
  // });
  // pool.end();
}

test('fdafdsfdaf', 'fdafdasffd', function(a, b, c) {
  console.log(a);
  console.log(b);
  console.log(c);
});
