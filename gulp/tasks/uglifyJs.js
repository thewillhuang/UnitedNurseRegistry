'use strict';
var gulp = require('gulp');
var config = require('../config').production;
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
// var sourcemaps = require('gulp-sourcemaps');

gulp.task('uglifyJs', ['browserify'], function() {
  return gulp.src(config.jsSrc)
    // .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(gulp.dest(config.dest))
    .pipe(gzip({threshold: true, gzipOptions: { level: 9 }}))
    .pipe(size({showFiles: true}))
    // .pipe(sourcemaps.write(config.dest))
    .pipe(gulp.dest(config.dest));
});
