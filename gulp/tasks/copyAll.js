'use strict';
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');

gulp.task('copyAll', function() {
  return gulp.src(config.copy.src, config.copy.base)
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
