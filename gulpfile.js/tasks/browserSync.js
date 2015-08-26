'use strict';
const bs = require('browser-sync');
const gulp = require('gulp');
const config = require('../config/browserSync');

gulp.task('browserSync', function() {
  return bs.init(config);
});
