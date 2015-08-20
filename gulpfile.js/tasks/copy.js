'use strict';
const gulp = require('gulp');
const config = require('../config/config');
const browserSync = require('browser-sync');
const changed = require('gulp-changed');
// const size = require('gulp-size');

gulp.task('copy', ['clean'], function() {
  return gulp.src(config.copy.src, config.copy.base)
    .pipe(changed(config.copy.dest)) // Ignore unchanged files
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
