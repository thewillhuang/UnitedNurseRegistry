'use strict';
const config = require('./');
const neat = require('node-neat').includePaths;
console.log(neat);

module.exports = {
  autoprefixer: { browsers: ['last 2 version'] },
  src: config.sourceAssets + '/stylesheets/**/*.{sass,scss}',
  dest: config.publicAssets + '/stylesheets',
  settings: {
    // indentedSyntax: false, // Enable .sass syntax!
    imagePath: 'images', // Used by the image-url helper
    includePaths: neat,
  },
  sourcemaps: {
    loadMaps: true,
    debug: true,
  },
};
