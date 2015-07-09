'use strict';
const React = require('react');
const manifestApi = require('../webapi/manifestApi.js');
const moment = require('moment');
const Button = require('react-bootstrap').Button;
const ReactZeroClipboard = require('react-zeroclipboard');

let RequestLink = React.createClass({

  getInitialState() {
    return {
      link: ''
    };
  },

  componentDidMount() {
    let time = moment().add(14, 'd')._d;
    manifestApi.createMedicalRecordsRequestUrl(time, (data) => {
      this.setLink(data);
    });
  },

  setLink(data) {
    this.setState({
      link: data.url
    });
  },

  handleClick(){
    console.log(this.state);
  },

  render() {
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
