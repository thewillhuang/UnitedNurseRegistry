'use strict';

const config = require('../config/config').clean;
const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function() {
  del(config.src, {read: false});
});
