'use strict'
const config = require('./');

module.exports = {
  src: config.sourceAssets + '/fonts/**/*',
  dest: config.publicAssets + '/fonts',
};
