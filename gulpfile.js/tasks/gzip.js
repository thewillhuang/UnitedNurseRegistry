'use strict';
const gulp = require('gulp');
const config = require('../config/config');
const gzip = require('gulp-gzip');
// const size = require('gulp-size');
const gulpFilter = require('gulp-filter');

gulp.task('gzip', ['copy', 'minifyHtml', 'minifyCss', 'uglifyJs'], function() {
  const filter = gulpFilter(config.gzip.filter);
  return gulp.src(config.gzip.src, config.gzip.srcBase)
    .pipe(filter)
    .pipe(gzip(config.gzip.opts))
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.gzip.dest));
});
