'use strict';

var React = require('react');
var NotificationItem = require('./notificationItem.jsx');
var $ = require('jquery');

var NotificationList = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render: function() {
    var notificationItemArray = this.props.data.map(function(value, key){
      value = $.parseJSON(value.notificationMessage);
      return (
        <NotificationItem date={value.Date} detail={value.Detail} message={value.Message} source={value.Source} key={key}/>
      );
    });
    return (
        <ul className='dropdown-menu' style={{maxHeight: '300px', overflow: 'auto'}}>
          {notificationItemArray}
        </ul>
    );
  }

});

module.exports = NotificationList;
