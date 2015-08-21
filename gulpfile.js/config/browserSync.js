var config = require('./')
var morgan = require('morgan');

module.exports = {
  server: {
    baseDir: config.publicDirectory,
    middleware: [morgan('dev')],
  },
  files: ['public/**/*.html']
}
