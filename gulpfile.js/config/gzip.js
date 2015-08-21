var config = require('./');

module.exports = {
  opts: {
    threshold: 1000,
    gzipOptions: {
      level: 9,
    },
  },
  filter: [
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
  src: config.publicAssets + '/**/*',
  srcBase: {
    base: config.publicAssets,
  },
  dest: config.publicAssets,
}
