'use strict';
const browserSync = require('browser-sync');
const gulp = require('gulp');
const config = require('../config/config').browserSync;

gulp.task('browserSync', ['copy'], function() {
  browserSync(config);
});
