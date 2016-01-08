'use strict';

const config = require('./');

module.exports = {
  src: [
    config.sourceDirectory + '/**/*',
    '!' + config.sourceDirectory + '/icons/**/*',
    '!' + config.sourceDirectory + '/sprites/**/*',
    '!' + config.sourceDirectory + '/stylesheets/**/*.{sass,scss}',
    '!' + config.sourceDirectory + '/**/*.html',
    '!' + config.sourceDirectory + '/**/*.jsx',
    '!' + config.sourceDirectory + '/javascripts/components/**/*',
    '!' + config.sourceDirectory + '/javascripts/**/*',
  ], // '!' must be a string
  dest: config.publicDirectory,
  base: {
    base: config.sourceDirectory,
  },
};
