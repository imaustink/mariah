const path = require('path')

module.exports = {
  mode: 'production',
  entry: './demo.js',
  output: {
    path: path.resolve(__dirname, 'demos'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2017'],
            plugins: [require('babel-plugin-transform-class-properties')]
          }
        }
      }
    ]
  }
}
