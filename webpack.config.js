var webpack = require("webpack");

var path = require("path");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  entry: {
    app: ["./app/index.js"]
  },
  devServer: {
  	contentBase: [
  		"assets",
  		"css",
      "resources"
  	],
    host: "0.0.0.0",
    port: "3000",
    disableHostCheck: true
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|fnt|jpe?g|png)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
   plugins: [
    new UglifyJSPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]


};
