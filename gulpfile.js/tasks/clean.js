'use strict';

const gulp = require('gulp');
const del = require('del');
const config = require('../config');
const htmlConfig = require('../config/markup');
const iconFontConfig = require('../config/iconFont');

gulp.task('clean', function(cb) {
  del([
    config.publicAssets,
    htmlConfig.dest,
    iconFontConfig.sassDest,
  ]).then(function() {
    cb();
  });
});
