const path = require('path')
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/javascript/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'./src/dist')
  },
  plugins: [
    new Dotenv()
  ],
}