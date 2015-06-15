'use strict';

const React = require('react');
const NotificationItem = require('./notificationItem.jsx');
const $ = require('jquery');

let NotificationList = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render() {
    let notificationItemArray = this.props.data.map((value, key) => {
      value = $.parseJSON(value.notificationMessage);
      return (
        <NotificationItem date={value.Date} detail={value.Detail} message={value.Message} source={value.Source} key={key}/>
      );
    });
    return (
        <ul className='dropdown-menu' style={{maxHeight: '400', overflow: 'auto'}}>
          {notificationItemArray}
        </ul>
    );
  }

});

module.exports = NotificationList;
