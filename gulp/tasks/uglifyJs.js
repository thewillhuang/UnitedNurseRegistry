'use strict';
var gulp = require('gulp');
var config = require('../config').production;
var size = require('gulp-size');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');

gulp.task('uglifyJs', ['browserify'], function() {
  return gulp.src(config.jsSrc)
    // .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(size({showFiles: true, gzip: true}))
    .pipe(uglify())
    // .pipe(sourcemaps.write(config.dest))
    .pipe(size({showFiles: true, gzip: true}))
    .pipe(gulp.dest(config.dest));
});
