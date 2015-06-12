'use strict';
var React = require('react');
var manifestApi = require('../webapi/manifestApi.js');
var moment = require('moment');
var Button = require('react-bootstrap').Button;
var ReactZeroClipboard = require('react-zeroclipboard');

var RequestLink = React.createClass({

  getInitialState: function() {
    return {
      link: ''
    };
  },

  componentDidMount: function() {
    var time = moment().add(14, 'd')._d;
    manifestApi.createMedicalRecordsRequestUrl(time, function(data){
      this.setLink(data);
    }.bind(this));
  },

  setLink: function(data) {
    this.setState({
      link: data.url
    });
  },

  handleClick: function(){
    // React.findDOMNode(this.refs.link).focus();
    console.log(this.refs.link.state);
  },

  render: function() {
    return (
      <div>
        <div className='urlDiv' onClick={this.handleClick} ref='link'>
          {this.state.link}
        </div>
        <ReactZeroClipboard text={this.state.link}>
          <Button className='copyButton'>Copy To Clipboard</Button>
        </ReactZeroClipboard>
      </div>
    );
  }

});

module.exports = RequestLink;
