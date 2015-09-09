module.exports = {
  entry: './example/index.js',
  output: {
    filename: './example/bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};

