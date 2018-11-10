const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/index.js",
    "production-dependencies": ["phaser"]
  },

  output: {
    path: path.resolve(__dirname, "www"),
    filename: "app.bundle.js"
  },

  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"],

    extensions: [".js", ".jsx", ".json"],

    alias: {}
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader" // inject CSS to page
          },
          {
            loader: "css-loader" // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins: function() {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              }
            }
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "www")
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "index.html"),
        to: path.resolve(__dirname, "www")
      },
      {
        from: path.resolve(__dirname, "assets", "**", "*"),
        to: path.resolve(__dirname, "www")
      }
    ]),
    new webpack.DefinePlugin({
      "typeof CANVAS_RENDERER": JSON.stringify(true),
      "typeof WEBGL_RENDERER": JSON.stringify(true)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "production-dependencies",
      filename: "production-dependencies.bundle.js"
    })
  ]
};
