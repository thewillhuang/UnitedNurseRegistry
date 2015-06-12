'use strict';

var React = require('react');
var NotificationList = require('./notificationList.jsx');
var notificationApi = require('../webapi/notificationApi.js');
var notificationStore = require('../stores/notificationStore.js');

var getStateFromStore = function() {
  return {
    notification: notificationStore.getAll()
  };
};

var NotificationBell = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    notificationStore.addChangeListener(this._onChange);
    notificationApi.subscribe(function(data){
      notificationApi.completeSubscription(data.subscriptionChannel);
    });
  },

  componentWillUnmount: function() {
    notificationStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    // console.log('on change called');
    this.setState(getStateFromStore());
  },

  render: function() {
    return (
      <li className="dropdown dropdown-extended dropdown-inbox">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
          <i className="icon-bell"></i>
          <span className="badge"></span>
          <span className="label label-danger bellNumber">{this.state.notification.length}</span>
        </a>
        <NotificationList data={this.state.notification}/>
      </li>
    );
  }

});

module.exports = NotificationBell;
