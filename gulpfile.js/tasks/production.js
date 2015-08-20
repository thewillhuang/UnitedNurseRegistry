'use strict';
const gulp = require('gulp');

// Run this to compress all the things!
gulp.task('prod', ['images', 'gzip']);
