'use strict';
var dest = '../public';
var src = '../app';
var gulp = './gulp';
var jsDest = dest + '/js';
// var neat = require('node-neat').includePaths;
// var compression = require('compression');
module.exports = {
  browserSync: {
    proxy: 'http://localhost:3000',
    port: 8080,
    // server: {
    //   // Serve up our build folder
    //   baseDir: dest
    // },
    reloadDelay: 500
    // browser: ['google chrome', 'firefox', 'safari']
      // port: 4004  // use *different* port than above
      // proxy: 'localhost:3000',  // local node app address
  },
  nodemon: {
    // nodemon our expressjs server
    script: '../server.js',
    // watch core server file(s) that require server restart on change
    watch: ['../server.js', '../server/**/*'],
    env: { 'NODE_ENV': 'development' }
  },
  sass: {
    src: src + '/css/**/*.{sass,scss}',
    dest: dest,
    base: {base: src},
    settings: {
      sourcemap: true,
      sourceComments: 'map',
      imagePath: '/images' // Used by the imlpage-url helper
        // includePaths: ['styles'].concat(neat)
    },
    sourcemap: {
      loadMaps: true,
      debug: true
    }
  },
  copy: {
    src: [
      src + '/**/*',
      '!' + src + '/images/**/*',
      '!' + src + '/css/**/*.{sass,scss}',
      '!' + src + '/**/*.html',
      '!' + src + '/**/*.jsx',
      '!' + src + '/js/react/**/*'
    ], // '!' must be a string
    dest: dest,
    base: {
      base: src
    }
  },
  changed: {
    src: src
  },
  gulp: {
    src: gulp + '/**/*'
  },
  images: {
    src: src + '/images/**/*',
    base: {base: src},
    dest: dest
  },
  markup: {
    src: src + '/**/*.html',
    dest: dest
  },
  browserify: {
    dest: dest,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
      // {
      //   entries: src + '/javascript/global.coffee',
      //   dest: dest,
      //   outputName: 'global.js',
      //   // Additional file extentions to make optional
      //   extensions: ['.coffee', '.hbs'],
      //   // list of modules to make require-able externally
      //   require: ['jquery', 'underscore']
      // },
      // {
      //   entries: src + '/javascript/page.js',
      //   dest: dest,
      //   outputName: 'page.js'
      //   // list of externally available modules to exclude from the bundle
      //   external: ['jquery', 'underscore']
      // },
      {
        entries: src + '/js/common.js',
        dest: jsDest,
        outputName: 'common.js',
        require: ['react', 'jquery', 'moment', 'socket.io-client', 'react-bootstrap', 'node-uuid', 'keymirror', 'flux', 'object-assign', 'events']
      },
      {
        entries: src + '/js/notification.js',
        dest: jsDest,
        outputName: 'notification.js',
        external: ['react', 'jquery', 'moment', 'react-bootstrap', 'socket.io-client', 'node-uuid', 'keymirror', 'flux', 'object-assign', 'events']
      }, {
        entries: src + '/js/activate.js',
        dest: jsDest,
        outputName: 'activate.js',
        external: ['jquery']
      }, {
        entries: src + '/js/dashboardWidgets.js',
        dest: jsDest,
        outputName: 'dashboardWidgets.js',
        external: ['react', 'jquery', 'moment', 'socket.io-client', 'react-bootstrap', 'node-uuid', 'keymirror', 'flux', 'object-assign', 'events']
      }, {
        entries: src + '/js/uploader.js',
        dest: jsDest,
        outputName: 'uploader.js'
      }, {
        entries: src + '/js/requestRecords.js',
        dest: jsDest,
        outputName: 'requestRecords.js',
        external: ['react', 'jquery', 'socket.io-client', 'react-bootstrap', 'node-uuid', 'keymirror', 'flux', 'object-assign', 'events']
      }, {
        entries: src + '/js/clientValidate.js',
        dest: jsDest,
        outputName: 'clientValidate.js',
        external: ['react', 'jquery', 'socket.io-client', 'react-bootstrap', 'node-uuid', 'keymirror', 'flux', 'object-assign', 'events']
      }
    ]
  },
  gzip: {
    opts: {
      threshold: 1400,
      gzipOptions: {
        level: 9
      }
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
      '**/*.map'
    ],
    src: dest + '/**/*',
    srcBase: {
      base: dest
    },
    dest: dest
  },
  production: {
    cssSrc: dest + '/css/**/*.css',
    cssDest: dest,
    cssBase: {base: dest},
    jsSrc: [
      // dest + '/*.js'
      dest + '/**/*.js',
      '!' + dest + '/js/components/**/*',
      '!' + dest + '/js/test/**/*',
      // '!' + dest + '/js/vendor/**/*',
      '!' + dest + '/js/cors/**/*',
      '!' + dest + '/plugins/**/*'
    ],
    jsDest: dest + '/js/',
    jsBase: {
      base: dest
    },
    dest: dest,
    cssOpt: {
      keepSpecialComments: 0
    }
  },
  minifyHtml: {
    opts: {
      spare: true
    },
    src: [
      dest + '/**/*.html',
      '!' + dest + '/plugins/**/*.html'
    ],
    dest: dest,
    srcBase: {
      base: dest
    }
  }
};
