'use strict';
var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config/config').browserSync;

gulp.task('browserSync', ['copy'], function() {
  browserSync(config);
});
