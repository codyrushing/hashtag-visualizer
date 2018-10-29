import '@babel/polyfill';
import WebFont from 'webfontloader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

WebFont.load({
  google: {
    families: ['Roboto:400,700']
  }
});

const container = document.createElement('div');
container.setAttribute('id', 'wrapper');
document.body.appendChild(container);

ReactDOM.render(
  <App />,
  container
);
