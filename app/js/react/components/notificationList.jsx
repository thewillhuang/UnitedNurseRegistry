'use strict';

const React = require('react');
const NotificationItem = require('./notificationItem.jsx');
const $ = require('jquery');

let NotificationList = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render() {
    // console.log('data on item object', this.props.data);
    let notificationItemArray = this.props.data.map((value, key) => {
      var reactId = value.reactId;
      value = $.parseJSON(value.notificationMessage);
      // console.log('value after json parse', value);
      return (
        <NotificationItem date={value.Date} detail={value.Detail} reactId={reactId} message={value.Message} source={value.Source} key={key} />
      );
    });
    return (
      <div className="dropdown-menu row">
        <div className="col-md-12 col-lg-12">Notification</div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <ul style={{maxHeight: '400', overflow: 'auto'}}>
              {notificationItemArray}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-6">Mark All As Read</div>
          <div className="col-md-6 col-lg-6">View All</div>
        </div>
      </div>
    );
  }

});

module.exports = NotificationList;
