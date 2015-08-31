'use strict';
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('build:production', function(cb) {
  gulpSequence('clean', ['copy', 'fonts', 'iconFont', 'images', 'svg-sprite'], ['webpack:production', 'markup', 'sass'], 'gzip', cb);
});
