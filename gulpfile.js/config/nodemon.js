'use strict';

// const config = require('./');

module.exports = {
  script: 'server.js',
  watch: ['server/**/*', 'server.js', 'public/**/*'],
  env: { 'NODE_ENV': 'development' },
};
