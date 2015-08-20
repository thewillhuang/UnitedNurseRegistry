'use strict';
const dest = './public';
const src = './app';
const jsDest = dest + '/js';
const test = './test';
// important lesson, always just use the base directory for gulp.dest, anything else will fuck up sourcemaps
// and or other weird settings, giving you useless grief
// const neat = require('node-neat').includePaths;
// const compression = require('compression');
const morgan = require('morgan');
module.exports = {
  mocha: {
    src: test + '/**/*.js',
  },
  browserSync: {
    // port: 8080,  // use *different* port than above
    // proxy: 'localhost:3000',  // local node app address
    // browser: ['google chrome', 'firefox', 'safari']
    server: {
      // Serve up our build folder
      baseDir: dest,
      middleware: [morgan('dev')],
    },
    reloadDelay: 500,
  },
  nodemon: {
    // nodemon our expressjs server
    script: './server.js',
    // watch core server file(s) that require server restart on change
    watch: ['./server.js', './server/**/*'],
    env: { 'NODE_ENV': 'development' },
  },
  sass: {
    src: src + '/stylesheets/**/*.{sass,scss}',
    dest: dest,
    base: {base: src},
    settings: {
      // sourceMap: true,
      // sourceMapContents: true,
      // outFile: '/',
      // sourceMapEmbed: true,
      includePaths: ['vendor', 'themes', '../fonts', 'images'],
      sourceComments: true,
      // sourceMap: true,
      // sourceMapContents: true,
      // sourceMapEmbed: true
      // imagePath: '/images' // Used by the imlpage-url helper
        // includePaths: ['styles'].concat(neat)
    },
    sourcemap: {
      loadMaps: true,
      debug: true,
    },
  },
  clean: {
    src: [
      dest + '/**/*.{js,css,map,gz,jsx}',
      '!' + dest + '/plugins/**/*',
    ],
  },
  copy: {
    src: [
      src + '/**/*',
      '!' + src + '/images/**/*',
      '!' + src + '/stylesheets/**/*.{sass,scss}',
      '!' + src + '/**/*.html',
      '!' + src + '/**/*.jsx',
      '!' + src + '/js/components/**/*',
    ], // '!' must be a string
    dest: dest,
    base: {
      base: src,
    },
  },
  changed: {
    src: src,
  },
  images: {
    src: src + '/images/**/*',
    base: {base: src},
    dest: dest,
  },
  markup: {
    src: src + '/**/*.html',
    dest: dest,
  },
  browserify: {
    dest: dest,
    baseDir: 'js',
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
      {
        entries: src + '/js/index.js',
        dest: jsDest,
        outputName: 'index.js',
      },
      // {
      //   entries: src + '/js/components/app.jsx',
      //   dest: jsDest + '/components',
      //   outputName: 'app.js',
      // },
      // {
      //   entries: src + '/js/components/home.jsx',
      //   dest: jsDest + '/components',
      //   outputName: 'home.js',
      // },
      // {
      //   entries: src + '/js/components/login.jsx',
      //   dest: jsDest + '/components',
      //   outputName: 'login.js',
      // },
      // {
      //   entries: src + '/js/components/signup.jsx',
      //   dest: jsDest + '/components',
      //   outputName: 'signup.js',
      // },
    ],
  },
  gzip: {
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
    src: dest + '/**/*',
    srcBase: {
      base: dest,
    },
    dest: dest,
  },
  production: {
    cssSrc: [dest + '/**/*.css', '!' + dest + '/plugins/**/*'],
    cssDest: dest,
    cssBase: {base: dest},
    jsSrc: [
      // dest + '/*.js'
      dest + '/**/*.js',
      '!' + dest + '/js/components/**/*',
      '!' + dest + '/js/test/**/*',
      // '!' + dest + '/js/vendor/**/*',
      '!' + dest + '/js/cors/**/*',
      '!' + dest + '/plugins/**/*',
    ],
    jsDest: dest,
    jsBase: {
      base: dest,
    },
    dest: dest,
    cssOpt: {
      keepSpecialComments: 0,
    },
  },
  minifyHtml: {
    opts: {
      spare: true,
    },
    src: [
      dest + '/**/*.html',
      '!' + dest + '/plugins/**/*.html',
    ],
    dest: dest,
    srcBase: {
      base: dest,
    },
  },
};
