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
    'Cache-Control': 'max-age=315360000, no-transform, public',
  },
  'noCache': {
    'Cache-Control': 'max-age=0, no-transform, public',
  },
  'filter': [
    '**/*.js',
    '**/*.html',
    '**/*.css',
    '**/*.less',
    '**/*.scss',
    '**/*.sass',
    '**/*.svg',
    '**/*.txt',
    '**/*.json',
    '**/*.ico',
    '**/*.otf',
    '**/*.ttf',
    '**/*.map',
    '**/*.md',
  ],
  'html': [
    '**/*.html',
    '**/*.json',
  ],
};
