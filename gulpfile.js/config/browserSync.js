'use strict';
// var config = require('./')
// const morgan = require('morgan');

module.exports = {
  // reloadDelay: 1500,
  proxy: {
    target: 'localhost:3000',
    ws: true,
  },
  // server: {
  //   baseDir: config.publicDirectory,
  //   middleware: [morgan('dev')],
  // },
  // files: ['public/**/*.html'],
};
