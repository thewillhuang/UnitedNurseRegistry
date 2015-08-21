'use strict';
const config = require('./');

module.exports = {
  watch: config.sourceDirectory + '/**/*.html',
  src: config.sourceAssets + '/**/*.html',
  dest: config.publicDirectory,
  // markup: {
  //   src: config.sourceAssets + '/**/*.html',
  //   dest: config.publicDirectory,
  // },
  // minifyHtml: {
  //   opts: {
  //     spare: true,
  //   },
  //   src: [
  //     dest + '/**/*.html',
  //     '!' + dest + '/plugins/**/*.html',
  //   ],
  //   dest: dest,
  //   srcBase: {
  //     base: dest,
  //   },
  // },
};
