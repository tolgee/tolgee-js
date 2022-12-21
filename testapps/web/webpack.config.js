const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { readdirSync } = require('fs');

const APPS_PATH = path.resolve(__dirname, 'apps');

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent);

module.exports = () => {
  return getDirectories(APPS_PATH).map((dir) => ({
    entry: path.resolve(APPS_PATH, dir.name, 'index.js'),
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist', dir.name),
      filename: 'index_bundle.js',
    },
    mode: 'development',
    plugins: [
      new HtmlWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            //Note:- No wildcard is specified hence will copy all files and folders
            from: path.resolve(__dirname, 'public'), //Will resolve to RepoDir/src/assets
            to: '', //Copies all files from above dest to dist/assets
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
      ],
    },
  }));
};
