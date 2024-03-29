// webpack.config.js
const VueLoaderPlugin = require("vue-loader/dist/plugin");

const path = require("path");
const webpack = require('webpack');
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
});

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader",
        ]
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed
    }),
  ],

};