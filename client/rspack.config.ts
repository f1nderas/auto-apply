import { rspack } from '@rspack/core';
import type { Configuration } from '@rspack/core';
import path from 'path';

const config: Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@app':      path.resolve(__dirname, 'src/app'),
      '@pages':    path.resolve(__dirname, 'src/pages'),
      '@widgets':  path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared':   path.resolve(__dirname, 'src/shared'),
      '@dto':      path.resolve(__dirname, 'src/shared/api/generatedApi.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'css',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
  ],
  experiments: {
    css: true,
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
};

export default config;
