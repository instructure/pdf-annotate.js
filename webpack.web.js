var webpack = require('webpack');

module.exports = {
  entry: './docs/index.js',

  output: {
    filename: 'index.js',
    path: 'docs/__build__',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
