'use strict';
const React = require('react');
const manifestApi = require('../webapi/manifestApi.js');
const moment = require('moment');

let UrgentTag = React.createClass({

  propTypes: {
    guid: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      expires: '',
      urgent: ''
    };
  },

  componentDidMount() {
    manifestApi.getRecordRequestDetails(this.props.guid, (data) => {
      // console.log(data);
      this.setStateFromAjax(data);
    });
  },

  setStateFromAjax(data) {
    this.setState({
      urgent: data.urgent,
      expires: data.expires
    });
  },

  render() {
    // console.log(this.state);
    let prettyDate = moment(this.state.expires).format('dddd, MMMM Do YYYY, h:mm:ss a');
    // let prettyDate = this.state.expires
    let notUrgent = (
      <div className='pull-right urgentTag'>Expires: <strong>{prettyDate}</strong></div>
    );

    let urgent = (
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
