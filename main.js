
import React from './react.js';

const { createElement } = React;


var HelloMessage = React.createClass({
  getInitialState: function () {
    return { type: 'say:' };
  },
  componentWillMount: function () {
    console.log('我就要开始渲染了。。。')
  },
  componentDidMount: function () {
    console.log('我已经渲染好了。。。')
  },
  changeType: function () {
    this.setState({ type: 'shout:' })
  },
  render: function () {
    return React.createElement(
      "div",
      { onclick: this.changeType.bind(this) },
      this.state.type,
      "Hello ",
      this.props.name
    );
  }
});


React.render(
  createElement(
    HelloMessage,
    {
      name: 'John'
    },
    /* [    // 子元素是在 render 的 this.props.children
      createElement('p', null,'hello'),
      createElement('p', null,'world')
    ] */
  ),
  document.getElementById("container")
)