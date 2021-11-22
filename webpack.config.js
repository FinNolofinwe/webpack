const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {

  context: path.resolve(__dirname, 'src'),

  entry: {
    main: './index.js',
  },

  output: {
    clean: true, 
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: '[name][ext]',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  devServer: {
    static : {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    port: 8080,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
        keepClosingSlash: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
        removeScriptTypeAttributes: isProd,
        removeStyleLinkTypeAttributes: isProd,
        useShortDoctype: isProd
      }
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     { from: 'assets/Avatar.jpg', to: './dist'}
    //   ]
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
        { loader: "style-loader" },
        {
          loader: "css-loader",
          options: { 
            importLoaders: 1,
            sourceMap: true
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                [
                  "autoprefixer"
                ],
              ],
            },
          },
        }, 
        { loader: "sass-loader", options: { sourceMap: true }}
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
}