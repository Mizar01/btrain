var webpack = require("webpack");

var path = require("path");
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
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/dist/"
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
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]


};
