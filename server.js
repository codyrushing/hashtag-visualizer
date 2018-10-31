const budo = require('budo');
const babelify = require('babelify');
const { sendJSON } = require('./utils');

budo(
  './app/index.js',
  {
    live: true,
    open: true,
    title: 'Twitter text visualizer',
    stream: process.stdout,
    port: 8000,
    css: 'dist/main.css',
    middleware: [
      require('./twitter-proxy')
    ],
    browserify: {
      transform: babelify   // use ES6
    }
  }
);
