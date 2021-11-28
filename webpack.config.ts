import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  externals: {
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
    express: "require('express')",
  },
  optimization: {
    minimize: false,
  },
  entry: {
    main: './src/app.ts',
    server: { import: './src/__server.ts', filename: 'server.js' },
  },
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'appBundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
    ],
  },
};

export default config;
