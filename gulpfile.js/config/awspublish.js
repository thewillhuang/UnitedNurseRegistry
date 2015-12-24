'use strict';

const config = require('./');

module.exports = {
  'src': config.publicDirectory + '/**/*',
  'srcBase': {
    'base': config.publicDirectory,
  },
  'create': {
    'params': {
      'Bucket': 'unitednurseregistry.com',
    },
    'region': 'us-west-2',
  },
  'headers': {
    'Cache-Control': 'max-age=3600, no-transform, public',
  },
  'no-cache': {
    'Cache-Control': 'max-age=0, no-transform, public',
  },
  'filter': [
    '**/*.js',
    '**/*.html',
    '**/*.css',
    '**/*.svg',
    '**/*.txt',
    '**/*.json',
    '**/*.ico',
    '**/*.otf',
    '**/*.ttf',
    '**/*.map',
  ],
  'html': [
    '**/*.html',
  ],
};
