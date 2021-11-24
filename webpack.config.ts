import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'foo.bundle.js',
  },
};

export default config;
