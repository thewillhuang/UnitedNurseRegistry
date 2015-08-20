'use strict';
const gulp = require('gulp');
const config = require('../config/config').markup;
const browserSync = require('browser-sync');
const changed = require('gulp-changed');
const size = require('gulp-size');

gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(size({showFiles: true, title: 'markup'}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
