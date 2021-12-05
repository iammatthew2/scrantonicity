import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  externals: {
    express: "require('express')",
    // support web sockets
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
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
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
};

export default config;
