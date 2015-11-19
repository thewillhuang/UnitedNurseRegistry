import React from 'react';

const Root = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  render() {
    console.log(this.props.children);
    return (
      <div>
        { this.props.children }
      </div>
    );
  },
});

export default Root;
