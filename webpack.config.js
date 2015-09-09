module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist/pdf-annotate.js',
    library: 'PDFAnnotate',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};
