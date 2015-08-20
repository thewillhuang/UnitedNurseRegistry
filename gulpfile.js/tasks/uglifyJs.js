'use strict';
const gulp = require('gulp');
const config = require('../config/config').production;
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');

gulp.task('uglifyJs', ['browserify', 'copy'], function() {
  return gulp.src(config.jsSrc, config.jsBase)
    .on('error', gutil.log)
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true, debug: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(size({showFiles: true, title: 'uglify'}))
    .pipe(gulp.dest(config.dest));
});
