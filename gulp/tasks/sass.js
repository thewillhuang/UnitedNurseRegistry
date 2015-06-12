'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config').sass;
// var cache = require('gulp-cached');
var changed = require('gulp-changed');


gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    // .pipe(cache('sass')) //cache files and skip unchanged files
    // Convert sass into css
    .pipe(sass(config.settings))
    // Catch any SCSS errors and prevent them from crashing gulp
    .on('error', function(error) {
      console.error(error);
      this.emit('end');
    })
    // Load existing internal sourcemap
    .pipe(sourcemaps.init(config.sourcemap))
    // Autoprefix properties
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    // Write final .map file
    .pipe(sourcemaps.write())
    // Save the CSS
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
