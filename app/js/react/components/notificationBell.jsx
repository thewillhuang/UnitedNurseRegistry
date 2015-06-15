'use strict';

const React = require('react');
const NotificationList = require('./notificationList.jsx');
const notificationApi = require('../webapi/notificationApi.js');
const notificationStore = require('../stores/notificationStore.js');

let getStateFromStore = () => {
  return {
    notification: notificationStore.getAll()
  };
};

let NotificationBell = React.createClass({
  getInitialState() {
    return getStateFromStore();
  },

  componentDidMount() {
    notificationStore.addChangeListener(this._onChange);
    notificationApi.subscribe((data) => {
      notificationApi.completeSubscription(data.subscriptionChannel);
    });
  },

  componentWillUnmount() {
    notificationStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    // console.log('on change called');
    this.setState(getStateFromStore());
  },

  render() {
    return (
      <li className="dropdown dropdown-extended dropdown-inbox">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
          <i className="icon-bell"></i>
          <span className="badge"></span>
          <span className="label label-danger bellNumber" style={{fontWeight: 100, position: 'relative', bottom: '2'}}>{this.state.notification.length}</span>
        </a>
        <NotificationList data={this.state.notification}/>
      </li>
    );
  }

});

module.exports = NotificationBell;
