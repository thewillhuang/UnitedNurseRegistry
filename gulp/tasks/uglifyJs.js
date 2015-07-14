'use strict';
var gulp = require('gulp');
var config = require('../config').production;
var size = require('gulp-size');
var uglify = require('gulp-uglify');
// var gzip = require('gulp-gzip');
// var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('uglifyJs', ['browserify'], function() {
  return gulp.src(config.jsSrc, config.jsBase)
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true, debug: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('/'))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest));
    // .pipe(gzip({threshold: 1400, gzipOptions: { level: 9 }}))
    // .pipe(size({showFiles: true}))
    // .pipe(gulp.dest(config.dest));
});
