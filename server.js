const budo = require('budo');
const babelify = require('babelify');

const twitterPrefixRegex = /^\/twitter/;

const proxyToTwitter = (req, res, next) => {
  // call twitter API from here
}

budo(
  './index.js',
  {
    live: true,
    open: true,
    stream: process.stdout,
    port: 8000,
    middleware: [
      (req, res, next) => {
        if(req.url.match(twitterPrefixRegex)){
          // proxy to twitter
          console.log(req.url);
        }
        next();
      }
    ],
    browserify: {
      transform: babelify   // use ES6
    }
  }
);
