'use strict';
const config = require('./');
const neat = require('node-neat');

module.exports = {
  autoprefixer: { browsers: ['> 1%'] },
  src: config.sourceAssets + '/stylesheets/**/*.{sass,scss}',
  dest: config.publicAssets + '/stylesheets',
  settings: {
    // indentedSyntax: false, // Enable .sass syntax!
    imagePath: 'images', // Used by the image-url helper
    includePaths: neat.includePaths,
  },
  sourcemaps: {
    loadMaps: true,
    debug: true,
  },
  minify: {
    advanced: true,
  },
};
