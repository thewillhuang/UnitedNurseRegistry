'use strict';
var gulp = require('gulp');
var config = require('../config/config').markup;
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var size = require('gulp-size');

gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
