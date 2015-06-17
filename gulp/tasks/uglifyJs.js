'use strict';
var gulp = require('gulp');
var config = require('../config').production;
var size = require('gulp-size');
var uglify = require('gulp-uglify');
// var gzip = require('gulp-gzip');

gulp.task('uglifyJs', ['browserify'], function() {
  return gulp.src(config.jsSrc, config.jsBase)
    .pipe(uglify())
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest));
    // .pipe(gzip({threshold: 1400, gzipOptions: { level: 9 }}))
    // .pipe(size({showFiles: true}))
    // .pipe(gulp.dest(config.dest));
});
