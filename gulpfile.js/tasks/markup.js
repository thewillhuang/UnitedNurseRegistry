'use strict';
const gulp = require('gulp');
const config = require('../config/markup');
const browserSync = require('browser-sync');
const minifyHTML = require('gulp-minify-html');
const gulpif       = require('gulp-if');

gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(gulpif(process.env.NODE_ENV === 'production', minifyHTML()))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
