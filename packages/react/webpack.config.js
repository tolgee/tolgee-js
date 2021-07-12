const path = require('path');

const WebpackBundleAnalyzer =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
  const isDevelopment = env.mode === 'development';

  const makeTarget = (target) => ({
    entry: './src/index.ts',
    devtool: 'source-map',
    output: {
      filename: 'tolgee-react.' + target + '.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'tolgee-react',
      libraryTarget: target,
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: [/node_modules/, /lib/],
        },
      ],
    },
    mode: isDevelopment ? 'development' : 'production',
    plugins: [
      //new WebpackBundleAnalyzer()
    ],
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'tolgee/ui': 'tolgee/ui',
    },
  });

  return [makeTarget('commonjs'), makeTarget('umd'), makeTarget('window')];
};
