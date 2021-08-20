const path = require('path')
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './public/javascript/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'./public/dist')
  },
  plugins: [
    new Dotenv()
  ],
}