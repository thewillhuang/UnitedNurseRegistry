'use strict';
var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('production', ['copyAll', 'gzip', 'markup', 'images', 'minifyHtml', 'minifyCss', 'uglifyJs']);
