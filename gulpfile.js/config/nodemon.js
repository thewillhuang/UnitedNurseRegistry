'use strict';

// const config = require('./');

module.exports = {
  script: 'index.js',
  watch: ['server/**/*', 'server.js'],
  env: { 'NODE_ENV': 'development' },
};
