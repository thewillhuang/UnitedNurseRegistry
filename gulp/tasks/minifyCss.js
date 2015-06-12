'use strict';
var browserSync  = require('browser-sync');
var gulp      = require('gulp');
var config    = require('../config').production;
// var markup = require('../config').markup;
var minifyCSS = require('gulp-minify-css');
//this will enable uncss, to remove unused css, it will not work with react atm
// var uncss = require('gulp-uncss');
var size      = require('gulp-filesize');
gulp.task('minifyCss', ['sass'], function() {
  return gulp.src(config.cssSrc)
    // .pipe(uncss({html:[markup.src]}))
    .pipe(minifyCSS(config.cssOpt))
    .pipe(gulp.dest(config.dest))
    .pipe(size())
    .pipe(browserSync.reload({stream:true}));
});
