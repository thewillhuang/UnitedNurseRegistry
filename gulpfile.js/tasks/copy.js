'use strict';
const gulp = require('gulp');
const config = require('../config/copy');
const browserSync = require('browser-sync');
const changed = require('gulp-changed');
// const size = require('gulp-size');

gulp.task('copy', ['clean'], function() {
  return gulp.src(config.src, config.base)
    .pipe(changed(config.dest)) // Ignore unchanged files
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
