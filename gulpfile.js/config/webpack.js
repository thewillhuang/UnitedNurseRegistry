const path = require('path');
const paths = require('./');
const webpack = require('webpack');
// const webpackManifest = require('../lib/webpackManifest');

module.exports = function(env) {
  const jsSrc = path.resolve(paths.sourceAssets + '/javascripts/');
  const jsDest = paths.publicAssets + '/javascripts/';
  const publicPath = 'javascripts/';

  const webpackConfig = {
    context: jsSrc,

    plugins: [],

    resolve: {
      extensions: ['', '.js'],
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            optional: ['runtime'],
            stage: 0,
          },
        },
      ],
    },
  };

  if (env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = {
      // page1: ['./page1.js'],
      // page2: ['./page2.js'],
      index: ['./index.js'],
    };

    webpackConfig.output = {
      path: jsDest,
      filename: '[name].js',
      publicPath: publicPath,
    };

    // Factor out common dependencies into a shared.js
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: '[name].js',
        async: true,
        children: true,
      })
    );
  }

  if (env === 'development') {
    webpackConfig.devtool = 'source-map';
    webpack.debug = true;
  }

  if (env === 'production') {
    webpackConfig.devtool = 'source-map';
    webpack.debug = true;
    webpackConfig.plugins.push(
      // new webpackManifest(publicPath, 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.NoErrorsPlugin()
    );
  }

  return webpackConfig;
};
