'use strict';
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');

gulp.task('copy', function() {
  return gulp.src(config.copy.src, config.copy.base)
    .pipe(changed(config.copy.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
