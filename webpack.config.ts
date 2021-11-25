import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts'],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};

export default config;
