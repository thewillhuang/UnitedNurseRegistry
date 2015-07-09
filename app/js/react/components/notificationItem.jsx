'use strict';
const React = require('react');
const moment = require('moment');
const notificationAction = require('../actions/notificationAction.js');

let NotificationItem = React.createClass({
  propTypes: {
    date: React.PropTypes.string.isRequired,
    source: React.PropTypes.string.isRequired,
    detail: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    reactId: React.PropTypes.string.isRequired
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

  handleClick() {
    notificationAction.delete(this.props.reactId);
  },

  render() {
    // console.log(this.props.date);
    let fromSection = () => {
      if (this.props.source) {
        return (
          'From: ' + this.props.source
        );
      }
    };

    return (
      <li className="external" onClick={this.handleClick}>
        <h3 onClick={this.handleToggle} style={{cursor: 'pointer'}}>
          <span className="bold">{moment.utc(this.props.date).local().format('MMMM Do YYYY h:mm:ss a')}</span>
          <br/>
          {fromSection()}
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
