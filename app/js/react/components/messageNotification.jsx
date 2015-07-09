'use strict';

const React = require('react');
const NotificationList = require('./notificationList.jsx');
// const notificationApi = require('../webapi/notificationApi.js');
const messageStore = require('../stores/messageStore.js');

let getStateFromStore = () => {
  return {
    message: messageStore.getAll()
  };
};

let NotificationBell = React.createClass({
  getInitialState() {
    return getStateFromStore();
  },

  componentDidMount() {
    messageStore.addChangeListener(this._onChange);
    // notificationApi.subscribe((data) => {
    //   notificationApi.completeSubscription(data.subscriptionChannel);
    // });
  },

  componentWillUnmount() {
    messageStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    // console.log('on change called');
    this.setState(getStateFromStore());
  },

  render() {
    // console.log(this.state);
    let labelNumber = () => {
      if (this.state.message.length > 0) {
        // console.log('this.state.message', this.state.message);
        return (
          <span className="label label-info bellNumber" style={{fontWeight: 100, position: 'relative', bottom: '8'}}>{this.state.message.length}</span>
        );
      }
    };
    return (
      <li className="dropdown dropdown-extended dropdown-inbox">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
          <i className="fa fa-comment-o"></i>
          <span className="badge"></span>
          {labelNumber()}
        </a>
        <NotificationList data={this.state.message}/>
      </li>
    );
  }

});

module.exports = NotificationBell;
