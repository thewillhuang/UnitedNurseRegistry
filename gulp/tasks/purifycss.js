// 'use strict';
// var browserSync = require('browser-sync');
// var gulp = require('gulp');
// var config = require('../config');
// var size = require('gulp-filesize');
// var purify = require('gulp-purify');
//
// gulp.task('purifycss', function() {
//   return gulp.src(config.production.jsSrc, config.minifyHtml.src)
//     .pipe(purify(config.production.cssSrc))
//     .pipe(gulp.dest(config.production.dest))
//     .pipe(size())
//     .pipe(browserSync.reload({
//       stream: true
//     }));
// });
