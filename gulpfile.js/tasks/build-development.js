'use strict';
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('build:development', function(cb) {
  gulpSequence('nodemon', 'clean', ['copy', 'fonts', 'iconFont', 'images', 'svg-sprite'], ['webpack:development', 'sass', 'markup'], cb);
});
