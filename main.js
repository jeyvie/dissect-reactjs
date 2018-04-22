
import React from './react.js';

const {createElement} = React;

React.render(
  createElement(
    'div',
    null,
    [
      createElement('p', null,'hello'),
      createElement('p', null,'world')
    ]
  ),
  document.getElementById("container")
)