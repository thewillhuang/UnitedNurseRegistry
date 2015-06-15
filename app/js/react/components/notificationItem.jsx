'use strict';
const React = require('react');
const moment = require('moment');

let NotificationItem = React.createClass({
  propTypes: {
    date: React.PropTypes.string.isRequired,
    source: React.PropTypes.string.isRequired,
    detail: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      display: 'none'
    };
  },

  handleToggle() {
    if (this.state.display === 'none') {
      this.setState({
        display: ''
      });
    } else {
      this.setState({
        display: 'none'
      });
    }
  },

  render() {
    // console.log(this.props.date);
    return (
      <li className="external">
        <h3 onClick={this.handleToggle} style={{cursor: 'pointer'}}>
          <span className="bold">{moment.utc(this.props.date).local().format('h:mm:ss a')}</span>
          <br/>
          From: {this.props.source}
        </h3>
        <br/>
        <h3>
          {this.props.message}
        </h3>
        <br/>
        <h3>
          {this.props.detail}
        </h3>
      </li>
    );
  }

});

module.exports = NotificationItem;
