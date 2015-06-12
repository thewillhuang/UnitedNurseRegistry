'use strict';
var React = require('react');
var manifestApi = require('../webapi/manifestApi.js');
var moment = require('moment');

var React = require('react');

var UrgentTag = React.createClass({

  propTypes: {
    guid: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      expires: '',
      urgent: ''
    };
  },

  componentDidMount: function() {
    manifestApi.getRecordRequestDetails(this.props.guid, function(data){
      // console.log(data);
      this.setStateFromAjax(data);
    }.bind(this));
  },

  setStateFromAjax: function(data){
    this.setState({
      urgent: data.urgent,
      expires: data.expires
    });
  },

  render: function() {
    console.log(this.state);
    var prettyDate = moment(this.state.expires).format('dddd, MMMM Do YYYY, h:mm:ss a');
    // var prettyDate = this.state.expires
    var notUrgent = (
      <div className='pull-right urgentTag'>Expires: <strong>{prettyDate}</strong></div>
    );

    var urgent = (
      <div className='pull-right urgentTag'>
        Expires: <strong>{prettyDate}</strong><span className='label label-danger label-urgent'>URGENT</span>
      </div>
    );

    if (this.state.urgent === 'True') {
      return urgent;
    } else {
      return notUrgent;
    }
  }

});

module.exports = UrgentTag;
